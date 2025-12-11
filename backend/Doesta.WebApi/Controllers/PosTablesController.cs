using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PosTablesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PosTablesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PosTable>>> GetTables()
    {
        return await _context.PosTables.OrderBy(t => t.Name).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<PosTable>> PostTable(PosTable table)
    {
        _context.PosTables.Add(table);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTables), new { id = table.Id }, table);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTable(int id, PosTable table)
    {
        if (id != table.Id) return BadRequest();
        _context.Entry(table).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    [HttpPost("seed")]
    public async Task<IActionResult> SeedTables()
    {
        if (_context.PosTables.Any()) return Ok("Already seeded");

        var tables = new List<PosTable>();
        for (int i = 1; i <= 10; i++)
        {
            tables.Add(new PosTable { Name = $"Table {i}", Capacity = 4, Zone = "Indoor" });
        }
        for (int i = 1; i <= 5; i++)
        {
            tables.Add(new PosTable { Name = $"Terrace {i}", Capacity = 2, Zone = "Terrace" });
        }
        
        _context.PosTables.AddRange(tables);
        await _context.SaveChangesAsync();
        return Ok("Seeded tables");
    }
}
