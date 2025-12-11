using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RatesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RatesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Rate>>> GetRates()
    {
        return await _context.Rates.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Rate>> PostRate(Rate rate)
    {
        _context.Rates.Add(rate);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRates), new { id = rate.Id }, rate);
    }
    
    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        if (_context.Rates.Any()) return Ok("Already seeded");
        
        _context.Rates.AddRange(
            new Rate { Name = "Best Available Rate", Code = "BAR", BasePrice = 100, Currency = "EUR", BoardType = "BB" },
            new Rate { Name = "Non Refundable", Code = "NONREF", BasePrice = 90, Currency = "EUR", BoardType = "BB" },
            new Rate { Name = "Package Deal", Code = "PKG", BasePrice = 150, Currency = "EUR", BoardType = "AI" }
        );
        
        await _context.SaveChangesAsync();
        return Ok("Seeded");
    }
}
