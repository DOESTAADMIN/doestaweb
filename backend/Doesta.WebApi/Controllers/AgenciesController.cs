using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AgenciesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AgenciesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Agency>>> GetAgencies()
    {
        return await _context.Agencies.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Agency>> PostAgency(Agency agency)
    {
        _context.Agencies.Add(agency);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAgencies), new { id = agency.Id }, agency);
    }
    
    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        if (_context.Agencies.Any()) return Ok("Already seeded");
        
        _context.Agencies.AddRange(
            new Agency { Name = "Booking.com", Type = "OTA", CommissionRate = 15, Code = "BKG" },
            new Agency { Name = "Expedia", Type = "OTA", CommissionRate = 18, Code = "EXP" },
            new Agency { Name = "TUI", Type = "Travel Agency", CommissionRate = 10, Code = "TUI" },
            new Agency { Name = "Walk-in", Type = "Direct", CommissionRate = 0, Code = "WALK" }
        );
        
        await _context.SaveChangesAsync();
        return Ok("Seeded");
    }
}
