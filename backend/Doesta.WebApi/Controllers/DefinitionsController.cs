using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DefinitionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DefinitionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Definition>>> GetDefinitions([FromQuery] string? type)
    {
        var query = _context.Definitions.AsQueryable();
        
        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(d => d.Type == type);
        }
        
        return await query.OrderBy(d => d.Type).ThenBy(d => d.SortOrder).ToListAsync();
    }
    
    [HttpGet("types")]
    public async Task<ActionResult<IEnumerable<string>>> GetTypes()
    {
        return await _context.Definitions.Select(d => d.Type).Distinct().ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Definition>> PostDefinition(Definition definition)
    {
        _context.Definitions.Add(definition);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetDefinitions", new { id = definition.Id }, definition);
    }
    
    [HttpPost("seed")]
    public async Task<IActionResult> SeedDefinitions()
    {
        if (_context.Definitions.Any()) return Ok("Already seeded");
        
        var defs = new List<Definition>
        {
            new Definition { Type = "RoomType", Name = "Standard", Code = "STD", SortOrder = 1 },
            new Definition { Type = "RoomType", Name = "Deluxe", Code = "DLX", SortOrder = 2 },
            new Definition { Type = "BoardType", Name = "Bed & Breakfast", Code = "BB", SortOrder = 1 },
            new Definition { Type = "BoardType", Name = "All Inclusive", Code = "AI", SortOrder = 2 },
            new Definition { Type = "PaymentMethod", Name = "Cash", Code = "CASH", SortOrder = 1 },
            new Definition { Type = "PaymentMethod", Name = "Credit Card", Code = "CC", SortOrder = 2 },
            new Definition { Type = "PaymentMethod", Name = "City Ledger", Code = "CL", SortOrder = 3 },
            new Definition { Type = "Department", Name = "Front Office", Code = "FO", SortOrder = 1 },
            new Definition { Type = "Department", Name = "Housekeeping", Code = "HK", SortOrder = 2 },
            new Definition { Type = "Department", Name = "Kitchen", Code = "KIT", SortOrder = 3 },
        };
        
        _context.Definitions.AddRange(defs);
        await _context.SaveChangesAsync();
        
        return Ok("Seeded successfully");
    }
}
