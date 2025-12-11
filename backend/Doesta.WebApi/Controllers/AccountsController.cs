using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AccountsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Account>>> GetAccounts([FromQuery] string? type)
    {
        var query = _context.Accounts.AsQueryable();
        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(a => a.Type == type);
        }
        return await query.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Account>> PostAccount(Account account)
    {
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAccounts), new { id = account.Id }, account);
    }
    
    [HttpPost("seed")]
    public async Task<IActionResult> SeedAccounts()
    {
        if (_context.Accounts.Any()) return Ok("Already seeded");
        
        var accounts = new List<Account>
        {
            new Account { Name = "ETS Tur", Type = "Agency", Balance = 150000, Code = "120.01.001" },
            new Account { Name = "Booking.com", Type = "Agency", Balance = 45000, Code = "120.01.002" },
            new Account { Name = "Metro Market", Type = "Vendor", Balance = -25000, Code = "320.01.001" },
            new Account { Name = "General Cash", Type = "Cash", Balance = 5000, Code = "100.01.001" }
        };
        
        _context.Accounts.AddRange(accounts);
        await _context.SaveChangesAsync();
        return Ok("Seeded accounts");
    }
}
