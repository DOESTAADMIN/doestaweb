using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PriceTypesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PriceTypesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PriceType>>> GetPriceTypes()
    {
        return await _context.PriceTypes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PriceType>> GetPriceType(int id)
    {
        var priceType = await _context.PriceTypes.FindAsync(id);
        if (priceType == null) return NotFound();
        return priceType;
    }

    [HttpPost]
    public async Task<ActionResult<PriceType>> PostPriceType(PriceType priceType)
    {
        _context.PriceTypes.Add(priceType);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPriceType), new { id = priceType.Id }, priceType);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutPriceType(int id, PriceType priceType)
    {
        if (id != priceType.Id) return BadRequest();
        _context.Entry(priceType).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!PriceTypeExists(id)) return NotFound(); else throw; }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePriceType(int id)
    {
        var priceType = await _context.PriceTypes.FindAsync(id);
        if (priceType == null) return NotFound();
        _context.PriceTypes.Remove(priceType);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool PriceTypeExists(int id) => _context.PriceTypes.Any(e => e.Id == id);
}
