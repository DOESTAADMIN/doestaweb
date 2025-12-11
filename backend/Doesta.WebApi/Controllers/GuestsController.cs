using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GuestsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GuestsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Guest>>> GetGuests([FromQuery] string? search)
    {
        var query = _context.Guests.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(g => g.FirstName.Contains(search) || 
                                     g.LastName.Contains(search) || 
                                     g.IdentificationNumber.Contains(search));
        }

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Guest>> GetGuest(int id)
    {
        var guest = await _context.Guests.FindAsync(id);

        if (guest == null)
        {
            return NotFound();
        }

        return guest;
    }

    [HttpPost]
    public async Task<ActionResult<Guest>> PostGuest(Guest guest)
    {
        _context.Guests.Add(guest);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGuest), new { id = guest.Id }, guest);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutGuest(int id, Guest guest)
    {
        if (id != guest.Id)
        {
            return BadRequest();
        }

        _context.Entry(guest).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!GuestExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    private bool GuestExists(int id)
    {
        return _context.Guests.Any(e => e.Id == id);
    }
}
