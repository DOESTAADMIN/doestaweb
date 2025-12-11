using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BedTypesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BedTypesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BedType>>> GetBedTypes()
    {
        return await _context.BedTypes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BedType>> GetBedType(int id)
    {
        var bedType = await _context.BedTypes.FindAsync(id);
        if (bedType == null) return NotFound();
        return bedType;
    }

    [HttpPost]
    public async Task<ActionResult<BedType>> PostBedType(BedType bedType)
    {
        _context.BedTypes.Add(bedType);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBedType), new { id = bedType.Id }, bedType);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBedType(int id, BedType bedType)
    {
        if (id != bedType.Id) return BadRequest();
        _context.Entry(bedType).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!BedTypeExists(id)) return NotFound(); else throw; }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBedType(int id)
    {
        var bedType = await _context.BedTypes.FindAsync(id);
        if (bedType == null) return NotFound();
        _context.BedTypes.Remove(bedType);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool BedTypeExists(int id) => _context.BedTypes.Any(e => e.Id == id);
}
