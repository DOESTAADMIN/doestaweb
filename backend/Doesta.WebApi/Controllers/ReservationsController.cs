using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReservationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReservationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations([FromQuery] string? status, [FromQuery] string? filter)
    {
        Console.WriteLine($"[API] GetReservations called. Status: '{status}', Filter: '{filter}'");
        try 
        {
            var query = _context.Reservations
                .Include(r => r.Guests)
                .Include(r => r.Guest) // Include main guest profile for VIP check
                .Include(r => r.Room) // Include Room details for table
                .AsQueryable();

            if (!string.IsNullOrEmpty(status) && status != "all")
            {
                query = query.Where(r => r.Status == status);
            }

            if (filter == "today")
            {
                var today = DateTime.Today;
                query = query.Where(r => r.CheckInDate.Date == today && r.Status == "Confirmed");
            }
            else if (filter == "checkout")
            {
                var today = DateTime.Today;
                query = query.Where(r => r.CheckOutDate.Date == today && r.Status == "CheckedIn");
            }
            else if (filter == "vip")
            {
                // Filter by Guest VIP status
                query = query.Where(r => r.Guest != null && r.Guest.IsVip);
            }

            return await query.OrderByDescending(r => r.CheckInDate).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR in GetReservations: {ex.Message} \n {ex.StackTrace}");
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Reservation>> GetReservation(int id)
    {
        Console.WriteLine($"[API] Fetching reservation {id}...");
        try
        {
            var reservation = await _context.Reservations
                .Include(r => r.Guests)
                .Include(r => r.Room) // Include Room details
                .Include(r => r.DailyPrices)
                .Include(r => r.FolioTransactions)
                .Include(r => r.Notes)
                .Include(r => r.Requests)
                .FirstOrDefaultAsync(r => r.Id == id);
                
            if (reservation == null) 
            {
                Console.WriteLine($"[API] Reservation {id} not found.");
                return NotFound();
            }
            Console.WriteLine($"[API] Found reservation {id}. Room: {reservation.Room?.Number ?? "None"}");
            return reservation;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[API] ERROR fetching reservation {id}: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    // --- Core Operations ---

    [HttpPost]
    public async Task<ActionResult<Reservation>> PostReservation(Reservation reservation)
    {
        // Simple room availability check
        var isOccupied = await _context.Reservations.AnyAsync(r => 
            r.RoomId == reservation.RoomId && 
            r.Status != "Cancelled" &&  r.Status != "CheckedOut" &&
            ((reservation.CheckInDate >= r.CheckInDate && reservation.CheckInDate < r.CheckOutDate) ||
             (reservation.CheckOutDate > r.CheckInDate && reservation.CheckOutDate <= r.CheckOutDate)));

        if (isOccupied) return BadRequest("Room is already occupied.");

        // Auto-generate VoucherNo if missing
        if (string.IsNullOrEmpty(reservation.VoucherNo))
        {
            reservation.VoucherNo = "VOU-" + new Random().Next(10000, 99999);
        }

        _context.Reservations.Add(reservation);
        await LogAction(reservation.Id, "Create", $"Reservation created for {reservation.GuestName}. Room: {reservation.RoomType}");
        await _context.SaveChangesAsync();

        // Generate Daily Prices ONLY if not provided by frontend
        if ((reservation.DailyPrices == null || !reservation.DailyPrices.Any()) && reservation.TotalPrice > 0)
        {
            var nights = (int)(reservation.CheckOutDate - reservation.CheckInDate).TotalDays;
            if (nights > 0)
            {
                var dailyRate = reservation.TotalPrice / nights;
                for (int i = 0; i < nights; i++)
                {
                    _context.ReservationDailyPrices.Add(new ReservationDailyPrice
                    {
                        ReservationId = reservation.Id,
                        Date = reservation.CheckInDate.AddDays(i),
                        Price = dailyRate,
                        Currency = reservation.Currency,
                        RoomType = reservation.RoomType
                    });
                }
                await _context.SaveChangesAsync();
            }
        }

        return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutReservation(int id, Reservation reservation)
    {
        if (id != reservation.Id) return BadRequest();

        var existing = await _context.Reservations.FindAsync(id);
        if (existing == null) return NotFound();

        // Update Header fields
        _context.Entry(existing).CurrentValues.SetValues(reservation);
        await LogAction(id, "Update", "Reservation details updated.");
        
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/recalculate-price")]
    public async Task<IActionResult> RecalculatePrice(int id, [FromBody] decimal? manualDailyPrice)
    {
        var reservation = await _context.Reservations
            .Include(r => r.DailyPrices)
            .FirstOrDefaultAsync(r => r.Id == id);
            
        if (reservation == null) return NotFound();

        // 1. Clear existing prices (simplified logic: wipe and recreate)
        // In real app maybe preserve manual overrides unless forced
        _context.ReservationDailyPrices.RemoveRange(reservation.DailyPrices);
        
        // 2. Calculate basics
        var nights = (int)(reservation.CheckOutDate - reservation.CheckInDate).TotalDays;
        if (nights <= 0) nights = 1; // Fallback

        decimal totalPrice = 0;
        
        for (int i = 0; i < nights; i++)
        {
            decimal dailyRate = 0;
            
            // If manual price active and provided
            if (reservation.ManualPriceActive && manualDailyPrice.HasValue)
            {
                dailyRate = manualDailyPrice.Value;
            }
            else
            {
                // Basic logic: Standard Room = 100, Delux = 150
                // This would normally come from a RateManager service
                decimal baseRate = reservation.RoomType == "DLX" ? 150 : 100;
                // Add for adults
                baseRate += (reservation.AdultCount - 1) * 30; // Extra adult cost
                
                dailyRate = baseRate;
            }

            reservation.DailyPrices.Add(new ReservationDailyPrice
            {
                Date = reservation.CheckInDate.AddDays(i),
                Price = dailyRate,
                Currency = reservation.Currency,
                RoomType = reservation.RoomType,
                BoardType = reservation.BoardType,
                IsManualPrice = reservation.ManualPriceActive
            });
            
            totalPrice += dailyRate;
        }
        
        // Update Total
        reservation.TotalPrice = totalPrice;
        // Also update balance cache logic if needed, but TotalPrice is the source of truth for "Should Pay"
        
        await _context.SaveChangesAsync();
        return Ok(reservation);
    }

    // --- Guest Management ---

    [HttpPost("{id}/guests")]
    public async Task<ActionResult<ReservationGuest>> AddGuest(int id, ReservationGuest guest)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();

        guest.ReservationId = id;
        _context.ReservationGuests.Add(guest);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReservation), new { id = id }, guest);
    }

    [HttpPut("guests/{guestId}")]
    public async Task<IActionResult> UpdateGuest(int guestId, ReservationGuest guest)
    {
        if (guestId != guest.Id) return BadRequest();

        var existing = await _context.ReservationGuests.FindAsync(guestId);
        if (existing == null) return NotFound();

        _context.Entry(existing).CurrentValues.SetValues(guest);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("guests/{guestId}")]
    public async Task<IActionResult> RemoveGuest(int guestId)
    {
        var guest = await _context.ReservationGuests.FindAsync(guestId);
        if (guest == null) return NotFound();

        _context.ReservationGuests.Remove(guest);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // --- Folio Management ---

    [HttpPost("{id}/folio")]
    public async Task<ActionResult<FolioTransaction>> AddFolioTransaction(int id, FolioTransaction transaction)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();

        transaction.ReservationId = id;
        transaction.Date = DateTime.UtcNow;
        _context.FolioTransactions.Add(transaction);

        // Update Main Reservation Balance Cache
        if (transaction.Debit > 0) 
        {
            // Adding chart usually doesn't increase 'PaidAmount', it increases balance
            // Logic: Balance = TotalPrice + ExtraDebits - Payments
        }
        if (transaction.Credit > 0)
        {
            reservation.PaidAmount += transaction.Credit;
        }

        await _context.SaveChangesAsync();

        return Ok(transaction);
    }
    
    [HttpDelete("folio/{transactionId}")]
    public async Task<IActionResult> DeleteFolioTransaction(int transactionId)
    {
        var transaction = await _context.FolioTransactions.FindAsync(transactionId);
        if (transaction == null) return NotFound();

        var reservation = await _context.Reservations.FindAsync(transaction.ReservationId);
        
        // Revert balance updates
        if (reservation != null && transaction.Credit > 0)
        {
            reservation.PaidAmount -= transaction.Credit;
        }
        
        _context.FolioTransactions.Remove(transaction);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // --- Check In/Out ---

    [HttpPost("{id}/checkin")]
    public async Task<IActionResult> CheckIn(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();
        
        reservation.Status = "CheckedIn";
        var room = await _context.Rooms.FindAsync(reservation.RoomId);
        if (room != null) { room.Status = "Occupied"; room.IsOccupied = true; }
        
        await LogAction(id, "CheckIn", $"Checked in to room {room?.Number}");
        await _context.SaveChangesAsync();
        return Ok(reservation);
    }

    [HttpPost("{id}/checkout")]
    public async Task<IActionResult> CheckOut(int id)
    {
         var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();
        
        reservation.Status = "CheckedOut";
        var room = await _context.Rooms.FindAsync(reservation.RoomId);
        if (room != null) { room.Status = "Dirty"; room.IsOccupied = false; }
        
        await LogAction(id, "CheckOut", "Checked out.");
        await _context.SaveChangesAsync();
        return Ok();
    }

    // --- Detail Tabs Management (Notes, Requests) ---

    [HttpPost("{id}/notes")]
    public async Task<ActionResult<ReservationNote>> AddNote(int id, ReservationNote note)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();

        note.ReservationId = id;
        note.CreatedAt = DateTime.UtcNow;
        _context.ReservationNotes.Add(note);
        await _context.SaveChangesAsync();

        return Ok(note);
    }
    
    [HttpDelete("notes/{noteId}")]
    public async Task<IActionResult> DeleteNote(int noteId)
    {
        var note = await _context.ReservationNotes.FindAsync(noteId);
        if (note == null) return NotFound();
        
        _context.ReservationNotes.Remove(note);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/requests")]
    public async Task<ActionResult<ReservationRequest>> AddRequest(int id, ReservationRequest request)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();

        request.ReservationId = id;
        request.CreatedAt = DateTime.UtcNow;
        _context.ReservationRequests.Add(request);
        await _context.SaveChangesAsync();

        return Ok(request);
    }
    
    [HttpPut("requests/{requestId}")]
    public async Task<IActionResult> UpdateRequest(int requestId, ReservationRequest request)
    {
        if (requestId != request.Id) return BadRequest();
        
        var existing = await _context.ReservationRequests.FindAsync(requestId);
        if (existing == null) return NotFound();
        
        _context.Entry(existing).CurrentValues.SetValues(request);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    [HttpDelete("requests/{requestId}")]
    public async Task<IActionResult> DeleteRequest(int requestId)
    {
        var req = await _context.ReservationRequests.FindAsync(requestId);
        if (req == null) return NotFound();
        
        _context.ReservationRequests.Remove(req);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    // --- Seeding ---

    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        if (await _context.Reservations.AnyAsync())
        {
            return Ok("Database already has reservations.");
        }

        var room101 = await _context.Rooms.FirstOrDefaultAsync(r => r.Number == "101");
        var room102 = await _context.Rooms.FirstOrDefaultAsync(r => r.Number == "102");
        var room205 = await _context.Rooms.FirstOrDefaultAsync(r => r.Number == "205");

        // Use random rooms if specific ones not found, or create dummies if needed. 
        // Assuming rooms likely seeded by other seeders.
        int r101Id = room101?.Id ?? 1;
        int r102Id = room102?.Id ?? 2;
        int r205Id = room205?.Id ?? 3;

        var reservations = new List<Reservation>
        {
            new Reservation
            {
                GuestName = "Ahmet Yılmaz",
                RoomId = r101Id,
                RoomType = "STD",
                AgencyId = 1, // Booking.com
                // Agency = "Booking.com",
                CheckInDate = DateTime.Today.AddDays(-1),
                CheckOutDate = DateTime.Today.AddDays(2),
                Status = "CheckedIn",
                TotalPrice = 300.00m,
                Currency = "EUR",
                AdultCount = 2,
                ChildCount = 0,
                IsPaid = false,
                PaidAmount = 100.00m,
                BoardType = "BB",
                VoucherNo = "BK-12345",
                Note = "Late Check-out request",
                Guests = new List<ReservationGuest>
                {
                    new ReservationGuest { FirstName = "Ahmet", LastName = "Yılmaz", IsMainGuest = true, Nationality = "TR", Phone = "5551234567", IdNumber = "12345678901" },
                    new ReservationGuest { FirstName = "Ayşe", LastName = "Yılmaz", IsMainGuest = false, Nationality = "TR", Phone = "5559876543", IdNumber = "10987654321" }
                },
                FolioTransactions = new List<FolioTransaction>
                {
                    new FolioTransaction { Date = DateTime.Today.AddDays(-1), Description = "Room Rate 101", DepartmentCode = "ROOM", Debit = 100.00m, Credit = 0, Currency = "EUR" },
                    new FolioTransaction { Date = DateTime.Today.AddDays(-1), Description = "Cola", DepartmentCode = "MINIBAR", Debit = 5.00m, Credit = 0, Currency = "EUR" },
                    new FolioTransaction { Date = DateTime.Today, Description = "Cash Payment", DepartmentCode = "CASH", Debit = 0, Credit = 100.00m, Currency = "EUR" }
                }
            },
            new Reservation
            {
                GuestName = "John Doe",
                RoomId = r205Id,
                RoomType = "DLX",
                AgencyId = 2, // Direct
                // Agency = "Direct",
                CheckInDate = DateTime.Today,
                CheckOutDate = DateTime.Today.AddDays(5),
                Status = "Confirmed",
                TotalPrice = 750.00m,
                Currency = "USD",
                AdultCount = 1,
                ChildCount = 0,
                IsPaid = false,
                PaidAmount = 0,
                BoardType = "HB",
                VoucherNo = "DIR-9988",
                Guests = new List<ReservationGuest>
                {
                    new ReservationGuest { FirstName = "John", LastName = "Doe", IsMainGuest = true, Nationality = "US" }
                }
            },
            new Reservation
            {
                GuestName = "Mehmet Demir",
                RoomId = r102Id,
                RoomType = "STD",
                AgencyId = 2, // Expedia
                // Agency = "Expedia",
                CheckInDate = DateTime.Today.AddDays(1),
                CheckOutDate = DateTime.Today.AddDays(4),
                Status = "Confirmed",
                TotalPrice = 450.00m,
                Currency = "EUR",
                AdultCount = 2,
                ChildCount = 1,
                IsPaid = true,
                PaidAmount = 450.00m,
                BoardType = "BB",
                VoucherNo = "EXP-5541",
                Guests = new List<ReservationGuest>
                {
                    new ReservationGuest { FirstName = "Mehmet", LastName = "Demir", IsMainGuest = true, Nationality = "TR" }
                }
            }
        };

        _context.Reservations.AddRange(reservations);
        await _context.SaveChangesAsync();
        
        // Update room status for checked in
        if (room101 != null) { room101.Status = "Occupied"; room101.IsOccupied = true; }
        await _context.SaveChangesAsync();

        return Ok("Reservations seeded successfully.");
    }

    [HttpPost("{id}/demo-data")]
    public async Task<IActionResult> GenerateDemoData(int id)
    {
        var reservation = await _context.Reservations
            .Include(r => r.FolioTransactions)
            .Include(r => r.Requests)
            .Include(r => r.Notes)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reservation == null) return NotFound();

        var rnd = new Random();

        // 1. Add Folio Transactions
        var depts = new[] { "RST", "BAR", "LBY", "SPA", "MIN" };
        var descs = new[] { "Restaurant Dinner", "Pool Bar Drink", "Lobby Tea", "Massage Therapy", "Mini Bar Item" };
        
        for (int i = 0; i < 5; i++)
        {
            var idx = rnd.Next(depts.Length);
            reservation.FolioTransactions.Add(new FolioTransaction
            {
                Date = DateTime.Now.AddHours(-rnd.Next(1, 48)),
                DepartmentCode = depts[idx],
                Description = descs[idx],
                Debit = (decimal)(rnd.NextDouble() * 50 + 5),
                Credit = 0,
                Currency = "EUR",
                CreatedBy = "DemoUser"
            });
        }

        // 2. Add Requests
        var requestTitles = new[] { "Extra Towel", "AC Repair", "Late Check-out", "Wake up Call", "Luggage Help" };
        for (int i = 0; i < 3; i++)
        {
            var rIdx = rnd.Next(requestTitles.Length);
            reservation.Requests.Add(new ReservationRequest
            {
                Title = requestTitles[rIdx],
                Description = $"Customer requested {requestTitles[rIdx]}",
                Type = i % 3 == 0 ? "Complaint" : "Request",
                Status = i % 2 == 0 ? "New" : "Completed",
                Priority = "Normal",
                Department = i % 2 == 0 ? "HK" : "FO",
                CreatedAt = DateTime.Now.AddMinutes(-rnd.Next(10, 500)),
                CreatedBy = "DemoUser"
            });
        }

        // 3. Add Notes
        var notes = new[] { "Guest prefers high floor", "Allergic to nuts", "Vip Guest" };
        foreach (var n in notes)
        {
            if (rnd.Next(2) == 0) // 50% chance
            {
                reservation.Notes.Add(new ReservationNote
                {
                    Message = n,
                    IsActive = true,
                    CreatedAt = DateTime.Now.AddDays(-1),
                    CreatedBy = "System"
                });
            }
        }

        await _context.SaveChangesAsync();
        await LogAction(id, "DemoData", "Generated demo data for testing");

        return Ok(new { message = "Demo data generated", id });
    }

    [HttpPost("seed-all-folio")]
    public async Task<IActionResult> SeedAllFolioData()
    {
        var reservations = await _context.Reservations
            .Include(r => r.FolioTransactions)
            .ToListAsync();

        var rnd = new Random();
        var depts = new[] { "RST", "BAR", "LBY", "SPA", "MIN" };
        var descs = new[] { "Restaurant Dinner", "Pool Bar Drink", "Lobby Tea", "Massage Therapy", "Mini Bar Item" };

        int updatedCount = 0;

        foreach (var r in reservations)
        {
            // Only add if no transactions exist, or keep adding?
            // User: "add for every customer folio randomly"
            int countToAdd = rnd.Next(3, 7);
            for (int i = 0; i < countToAdd; i++)
            {
                var idx = rnd.Next(depts.Length);
                r.FolioTransactions.Add(new FolioTransaction
                {
                    Date = DateTime.Now.AddHours(-rnd.Next(1, 48)),
                    DepartmentCode = depts[idx],
                    Description = descs[idx],
                    Debit = (decimal)(rnd.NextDouble() * 50 + 5),
                    Credit = 0,
                    Currency = "EUR",
                    CreatedBy = "SystemSeed"
                });
            }
            updatedCount++;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Seeded folio data for {updatedCount} reservations." });
    }

    [HttpPost("fix-vouchers")]
    public async Task<IActionResult> FixMissingVouchers()
    {
        var reservations = await _context.Reservations
            .Where(r => r.VoucherNo == null || r.VoucherNo == "")
            .ToListAsync();

        int count = 0;
        var rnd = new Random();
        foreach (var r in reservations)
        {
            r.VoucherNo = "VOU-" + rnd.Next(100000, 999999);
            count++;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Fixed vouchers for {count} reservations." });
    }

    [HttpGet("{id}/history")]
    public async Task<ActionResult<IEnumerable<ReservationLog>>> GetHistory(int id)
    {
        return await _context.ReservationLogs
            .Where(l => l.ReservationId == id)
            .OrderByDescending(l => l.Date)
            .ToListAsync();
    }

    private async Task LogAction(int reservationId, string action, string description)
    {
        try 
        {
            var log = new ReservationLog
            {
                ReservationId = reservationId,
                Action = action,
                Description = description,
                Date = DateTime.UtcNow,
                User = "System", // Could be HttpContext.User.Identity.Name
                Module = "Reservation"
            };
            _context.ReservationLogs.Add(log);
            // We usually save changes in the main method, but to be sure logging persists even if main logic fails (if called before), 
            // or to avoid conflict, we can add it to the tracked context. 
            // The main method SaveChangesAsync will commit it.
        }
        catch(Exception ex)
        {
            Console.WriteLine($"Logging failed: {ex.Message}");
        }
    }
}
