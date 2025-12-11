using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CurrenciesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CurrenciesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Currency>>> GetCurrencies()
    {
        return await _context.Currencies.ToListAsync();
    }

    [HttpGet("{code}")]
    public async Task<ActionResult<Currency>> GetCurrency(string code)
    {
        var currency = await _context.Currencies.FindAsync(code);
        if (currency == null) return NotFound();
        return currency;
    }

    [HttpPost]
    public async Task<ActionResult<Currency>> PostCurrency(Currency currency)
    {
        if (CurrencyExists(currency.Code)) return Conflict();
        _context.Currencies.Add(currency);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCurrency), new { code = currency.Code }, currency);
    }

    [HttpPut("{code}")]
    public async Task<IActionResult> PutCurrency(string code, Currency currency)
    {
        if (code != currency.Code) return BadRequest();
        _context.Entry(currency).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!CurrencyExists(code)) return NotFound(); else throw; }
        return NoContent();
    }

    [HttpDelete("{code}")]
    public async Task<IActionResult> DeleteCurrency(string code)
    {
        var currency = await _context.Currencies.FindAsync(code);
        if (currency == null) return NotFound();
        _context.Currencies.Remove(currency);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool CurrencyExists(string code) => _context.Currencies.Any(e => e.Code == code);
}
