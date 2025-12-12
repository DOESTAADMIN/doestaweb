using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DistributionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DistributionController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("channels")]
    public async Task<ActionResult<IEnumerable<ChannelStatDto>>> GetChannelStats([FromQuery] string? startDate, [FromQuery] string? endDate)
    {
        Console.WriteLine($"[API] GetChannelStats called. Range: {startDate} - {endDate}");
        try
        {
            var query = _context.Reservations.Include(r => r.Agency).AsQueryable();

            // Filter by Date Range (CheckIn Date)
            if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out DateTime start))
            {
                query = query.Where(r => r.CheckInDate >= start);
            }

            if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out DateTime end))
            {
                query = query.Where(r => r.CheckInDate <= end);
            }

            // Exclude Cancelled? Usually distribution includes realized revenue, so stick to Confirmed/CheckedIn/CheckedOut
            query = query.Where(r => r.Status != "Cancelled" && r.Status != "NoShow");

            var stats = await query
                .GroupBy(r => r.AgencyId != null ? r.Agency.Name : "Direct")
                .Select(g => new ChannelStatDto
                {
                    ChannelName = g.Key,
                    ReservationCount = g.Count(),
                    TotalRevenue = g.Sum(r => r.TotalPrice),
                    // Calculate ADR (Average Daily Rate) = Total Revenue / Total Nights
                    // Note: SQL calculation for nights might be complex, approximation: TotalRevenue / ReservationCount (Avg Revenue per Res)
                    // Let's stick to simple Avg Revenue for now or try to calc nights:
                    // TotalNights = g.Sum(r => EF.Functions.DateDiffDay(r.CheckInDate, r.CheckOutDate))
                    // SQLite doesn't support DateDiffDay easily in all versions. Let's use simpler metrics first.
                    ADR = g.Count() > 0 ? g.Sum(r => r.TotalPrice) / g.Count() : 0 
                })
                .OrderByDescending(x => x.TotalRevenue)
                .ToListAsync();

            return stats;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[API] Error in GetChannelStats: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}

public class ChannelStatDto
{
    public string ChannelName { get; set; } = string.Empty;
    public int ReservationCount { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal ADR { get; set; } // Actually Average Revenue Per Reservation for now
}
