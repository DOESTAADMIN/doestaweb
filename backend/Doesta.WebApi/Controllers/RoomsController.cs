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
}
