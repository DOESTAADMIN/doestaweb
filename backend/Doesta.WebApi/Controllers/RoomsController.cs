using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RoomsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
    {
        return await _context.Rooms.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Room>> GetRoom(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return NotFound();
        return room;
    }

    [HttpPost]
    public async Task<ActionResult<Room>> PostRoom(Room room)
    {
        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> PutRoom(int id, Room room)
    {
        if (id != room.Id) return BadRequest();
        _context.Entry(room).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!RoomExists(id)) return NotFound(); else throw; }
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoom(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return NotFound();
        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    private bool RoomExists(int id) => _context.Rooms.Any(e => e.Id == id);

    // Simple endpoint to seed rooms if empty
    [HttpPost("seed")]
    public async Task<ActionResult> SeedRooms()
    {
        if (_context.Rooms.Any()) return BadRequest("Rooms already exist");
        
        var types = new[] { "Standard", "Deluxe", "Suite" };
        var statuses = new[] { "Clean", "Dirty", "Occupied" };
        var rand = new Random();

        for (int i = 101; i <= 120; i++)
        {
            _context.Rooms.Add(new Room
            {
                Number = i.ToString(),
                Type = types[rand.Next(types.Length)],
                Status = statuses[rand.Next(statuses.Length)],
                Price = rand.Next(100, 500),
                Capacity = rand.Next(1, 4),
                Floor = (i / 100).ToString(),
                Location = "Main Building",
                View = rand.Next(2) == 0 ? "Sea" : "Garden"
            });
        }
        await _context.SaveChangesAsync();
        return Ok("Seeded 20 rooms");
    }
    // Housekeeping Status Update
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return NotFound();

        // Validate status if needed (Clean, Dirty, InProgr, DND, Occupied)
        room.Status = status;
        
        // If status is "Clean", maybe reset IsOccupied if it was false? 
        // Logic: Housekeeping usually cleans dirty rooms after checkout.
        
        await _context.SaveChangesAsync();
        return Ok(room);
    }

    [HttpGet("room-plan")]
    public async Task<ActionResult<IEnumerable<RoomPlanDto>>> GetRoomPlan([FromQuery] string? floor, [FromQuery] string? type, [FromQuery] string? status)
    {
        // 1. Get all rooms (apply filters if simple)
        var query = _context.Rooms.AsQueryable();

        if (!string.IsNullOrEmpty(floor))
            query = query.Where(r => r.Floor == floor);
            
        if (!string.IsNullOrEmpty(type))
            query = query.Where(r => r.Type == type);
            
        // Status filter is tricky because it could be Room Status (Clean/Dirty) OR Reservation Status (Occupied)
        // We will apply status filter after merging if possible, or simple room status here.
        // Let's assume 'status' param might filter IsOccupied/Clean/Dirty later.
        
        var rooms = await query.ToListAsync();

        // 2. Get active reservations for today
        // Active = CheckIn <= Today < CheckOut AND Status != Cancelled/NoShow
        var today = DateTime.Today; // Use server local time or UtcNow based on preference. Reservations usually stored as dates.
        // If dates are DateTime, we should be careful. Assuming just Date comparison.
        
        var activeReservations = await _context.Reservations
            .Where(r => r.Status != "Cancelled" && r.Status != "NoShow" && r.Status != "CheckedOut"
                        && r.CheckInDate.Date <= today && r.CheckOutDate.Date > today)
            .ToListAsync();

        // 3. Merge data
        var roomPlans = rooms.Select(room =>
        {
            var res = activeReservations.FirstOrDefault(r => r.RoomId == room.Id);
            var isOccupied = res != null;

            // Determine effective status for UI
            // If Occupied -> "Occupied"
            // Else -> room.Status (Clean, Dirty)
            var uiStatus = isOccupied ? "Occupied" : room.Status;

            return new RoomPlanDto
            {
                Id = room.Id,
                Number = room.Number,
                Type = room.Type,
                BedType = room.BedType,
                Status = uiStatus, // Use effective status
                Floor = room.Floor,
                View = room.View,
                
                IsOccupied = isOccupied,
                GuestName = res?.GuestName,
                Pax = res != null ? (res.AdultCount + res.ChildCount) : 0,
                CheckInDate = res?.CheckInDate,
                CheckOutDate = res?.CheckOutDate,
                ReservationId = res?.Id,
                ReservationStatus = res?.Status,
                
                IsDirty = room.Status == "Dirty" || (isOccupied && room.Status == "Dirty"), // Keep track if physically dirty
                IsDeleted = room.IsDeleted,
                IsPassive = room.IsPassive
            };
        });

        // 4. Apply complex status filter if needed
        if (!string.IsNullOrEmpty(status))
        {
            // If status is "Occupied", "Vacant", "Clean", "Dirty"
             if (status == "Occupied")
                roomPlans = roomPlans.Where(rp => rp.IsOccupied);
             else if (status == "Vacant")
                roomPlans = roomPlans.Where(rp => !rp.IsOccupied);
             else if (status == "Clean")
                 roomPlans = roomPlans.Where(rp => rp.Status == "Clean" && !rp.IsOccupied); // Assuming Clean implies Vacant Clean
             else if (status == "Dirty")
                 roomPlans = roomPlans.Where(rp => rp.Status == "Dirty" || rp.IsDirty);
        }

        return Ok(roomPlans);
    }
}
