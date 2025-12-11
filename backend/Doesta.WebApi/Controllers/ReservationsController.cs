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
        try 
        {
            var query = _context.Reservations
                .Include(r => r.Guests)
                .Include(r => r.Guest) // Include main guest profile for VIP check
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
        var reservation = await _context.Reservations
            .Include(r => r.Guests)
            .Include(r => r.DailyPrices)
            .Include(r => r.FolioTransactions)
            .FirstOrDefaultAsync(r => r.Id == id);
            
        if (reservation == null) return NotFound();
        return reservation;
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

        _context.Reservations.Add(reservation);
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
        
        await _context.SaveChangesAsync();
        return NoContent();
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

    // --- Check In/Out ---

    [HttpPost("{id}/checkin")]
    public async Task<IActionResult> CheckIn(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();
        
        reservation.Status = "CheckedIn";
        var room = await _context.Rooms.FindAsync(reservation.RoomId);
        if (room != null) { room.Status = "Occupied"; room.IsOccupied = true; }
        
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
        
        await _context.SaveChangesAsync();
        return Ok(reservation);
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
                Agency = "Booking.com",
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
                    new ReservationGuest { FirstName = "Ahmet", LastName = "Yılmaz", IsMainGuest = true, Nationality = "TR" },
                    new ReservationGuest { FirstName = "Ayşe", LastName = "Yılmaz", IsMainGuest = false, Nationality = "TR" }
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
                Agency = "Direct",
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
                Agency = "Expedia",
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
}
