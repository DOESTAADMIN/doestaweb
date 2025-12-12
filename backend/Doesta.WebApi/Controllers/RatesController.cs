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
    
    // --- Matrix API ---
    
    [HttpGet("matrix")]
    public async Task<ActionResult<IEnumerable<object>>> GetMatrix([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        if (startDate == default) startDate = DateTime.Today;
        if (endDate == default) endDate = DateTime.Today.AddDays(14);

        // 1. Get Room Types
        var roomTypes = await _context.RoomTypes.ToListAsync();
        
        // 2. Get Daily Rates
        var dailyRates = await _context.RoomDailyRates
            .Where(r => r.Date >= startDate && r.Date <= endDate)
            .ToListAsync();
            
        // 3. Get Reservations (for availability calc)
        // CheckIn < EndDate AND CheckOut > StartDate
        var reservations = await _context.Reservations
            .Where(r => r.Status != "Cancelled" && r.Status != "CheckedOut" && // CheckedOut implies they left, but if date range is past?
                        // For future availability, we care about "Occupied" or "Reserved"
                        // CheckedOut today means room is dirty but free for night? Usually yes.
                        (r.Status == "Confirmed" || r.Status == "CheckedIn")) 
            .Where(r => r.CheckInDate < endDate && r.CheckOutDate > startDate)
            .Select(r => new { r.RoomId, r.RoomType, r.CheckInDate, r.CheckOutDate })
            .ToListAsync();

        // Map to result
        var result = new List<object>();

        foreach (var rt in roomTypes)
        {
            var prices = new Dictionary<string, object>();
            
            for (var d = startDate; d < endDate; d = d.AddDays(1))
            {
                var dr = dailyRates.FirstOrDefault(x => x.RoomTypeId == rt.Id && x.Date.Date == d.Date);
                
                // Calculate Sold
                // A res is active on day D if CheckIn <= D < CheckOut.
                int sold = reservations.Count(r => 
                    (r.RoomType == rt.Code || r.RoomType == rt.Name) // Simple match
                    && r.CheckInDate <= d && r.CheckOutDate > d);

                // Default values if no daily rate record
                decimal price = dr?.Price ?? 100;
                bool stopSell = dr?.StopSell ?? false;
                
                int total = rt.Count;
                int available = total - sold;
                if (available < 0) available = 0;
                
                int sellable = stopSell ? 0 : available;
                
                prices[d.ToString("yyyy-MM-dd")] = new 
                {
                    price = price,
                    sellable = sellable,
                    stopSell = stopSell,
                    available = available,
                    sold = sold
                };
            }
            
            result.Add(new 
            {
                id = rt.Id, // Use ID for update
                code = rt.Code,
                name = rt.Name,
                prices = prices
            });
        }
        
        return Ok(result);
    }

    [HttpPost("update-daily")]
    public async Task<IActionResult> UpdateDailyRate([FromBody] UpdateDailyRateRequest request)
    {
        var day = await _context.RoomDailyRates
            .FirstOrDefaultAsync(r => r.RoomTypeId == request.RoomTypeId && r.Date == request.Date);

        if (day == null)
        {
            day = new RoomDailyRate
            {
                RoomTypeId = request.RoomTypeId,
                Date = request.Date,
                Price = request.Price ?? 100,
                StopSell = request.StopSell ?? false
            };
            _context.RoomDailyRates.Add(day);
        }
        else
        {
            if (request.Price.HasValue) day.Price = request.Price.Value;
            if (request.StopSell.HasValue) day.StopSell = request.StopSell.Value;
        }

        await _context.SaveChangesAsync();
        return Ok(day);
    }

    [HttpPost]
    public async Task<ActionResult<Rate>> PostRate(Rate rate)
    {
        _context.Rates.Add(rate);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRates), new { id = rate.Id }, rate);
    }
    [HttpPost("seed-matrix")]
    public async Task<IActionResult> SeedMatrix()
    {
        // 1. Clear existing future rates to avoid duplicates or manually check
        // For simplicity in this action, we just check if exists, if not add.
        
        var roomTypes = await _context.RoomTypes.ToListAsync();
        var startDate = DateTime.Today;
        var endDate = startDate.AddDays(365);
        int addedCount = 0;

        foreach (var rt in roomTypes)
        {
            decimal basePrice = 100;
            if (rt.Code == "DLX") basePrice = 150;
            if (rt.Code == "SUI") basePrice = 300;
            if (rt.Code == "FAM") basePrice = 200;

            for (var d = startDate; d < endDate; d = d.AddDays(1))
            {
                // check directly locally to avoid million DB calls? 
                // Better: Fetch all existing for this room type first.
                // But for "Action Button" performance is less critical than correctness.
                
                bool exists = await _context.RoomDailyRates.AnyAsync(r => r.RoomTypeId == rt.Id && r.Date == d);
                if (!exists)
                {
                    var isWeekend = d.DayOfWeek == DayOfWeek.Friday || d.DayOfWeek == DayOfWeek.Saturday;
                    var price = basePrice * (isWeekend ? 1.2m : 1.0m);

                    _context.RoomDailyRates.Add(new RoomDailyRate
                    {
                        Date = d,
                        RoomTypeId = rt.Id,
                        Price = price,
                        StopSell = false,
                        MinStay = 1,
                        ClosedToArrival = false
                    });
                    addedCount++;
                }
            }
        }
        
        await _context.SaveChangesAsync();
        return Ok(new { message = $"Matrix seeded with {addedCount} new records." });
    }
}

public class UpdateDailyRateRequest
{
    public int RoomTypeId { get; set; }
    public DateTime Date { get; set; }
    public decimal? Price { get; set; }
    public bool? StopSell { get; set; }
}

