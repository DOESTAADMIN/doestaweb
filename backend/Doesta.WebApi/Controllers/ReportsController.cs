using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("revenue")]
    public async Task<ActionResult<IEnumerable<object>>> GetRevenueStats()
    {
        // Simple mock-ish logic for demo: Group invoices by Date
        // In real life, use GroupBy on SQL. SQLite limitations might apply for Date functions.
        var today = DateTime.Today;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek + 1); // Monday
        
        // Fetch last 7 days invoices
        var invoices = await _context.Invoices
            .Where(i => i.Date >= startOfWeek.AddDays(-7))
            .ToListAsync();
            
        var sales = invoices
            .Where(i=> i.Type == "Sales")
            .GroupBy(i => i.Date.Date)
            .Select(g => new { Date = g.Key, Total = g.Sum(x => x.TotalAmount) })
            .ToList();
            
        var result = new List<object>();
        for(int i=0; i<7; i++)
        {
            var day = DateTime.Today.AddDays(-6 + i);
            var val = sales.FirstOrDefault(s => s.Date == day)?.Total ?? 0;
            result.Add(new { name = day.ToString("ddd"), result = val });
        }

        return Ok(result);
    }
    
    [HttpGet("occupancy")]
    public async Task<ActionResult<IEnumerable<object>>> GetOccupancyStats()
    {
        // Snapshot of current status
        var total = await _context.Rooms.CountAsync();
        var occupied = await _context.Rooms.CountAsync(r => r.Status == "Occupied");
        var dirty = await _context.Rooms.CountAsync(r => r.Status == "Dirty");
        var empty = total - occupied - dirty; // Simplified
        
        return Ok(new []
        {
            new { name = "Dolu", value = occupied },
            new { name = "Boş", value = empty },
            new { name = "Kirli", value = dirty },
            new { name = "Bakım", value = 0 }
        });
    }
    
    [HttpGet("summary")]
    public async Task<ActionResult<object>> GetSummary()
    {
       var revenue = await _context.Invoices.Where(i => i.Type == "Sales").SumAsync(i => i.TotalAmount);
       var roomCount = await _context.Rooms.CountAsync();
       // RevPAR etc requires timeframe, using simplified total/all-time for demo
       return Ok(new 
       {
           totalRevenue = revenue,
           adr = roomCount > 0 ? revenue / roomCount : 0, // Not real ADR but ok for prototype
           revPar = 0,
           occupancy = 0
       });
    }
}
