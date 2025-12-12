using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AnalyticsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AnalyticsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("distribution/market")]
    public async Task<ActionResult<DistributionAnalyticsData>> GetMarketAnalytics()
    {
        // Group by ContractType (Market Segment Proxy)
        var rawData = await _context.Reservations
            .Where(r => r.Status != "Cancelled")
            .GroupBy(r => r.ContractType ?? "Unknown")
            .Select(g => new 
            {
                Label = g.Key,
                Revenue = g.Sum(r => r.TotalPrice),
                Reservations = g.Count(),
                // Simplistic ADR calc: TotalPrice / Reservations (assuming 1 night avg for simplicity in agg, or better: sum(nights))
                // For better ADR we need sum of nights. let's assume CheckOut - CheckIn
                // SQLite DateDiff might be tricky in EF Core, doing clientside projection for MVP safety or simple sum
            })
            .ToListAsync();

        // Refined ADR Calculation needs nights. 
        // EF Core 8+ supports primitive mapping, but let's do a more robust query for nights calculation in memory if dataset is small, 
        // or try to use EF functions.
        
        var allRes = await _context.Reservations
            .Where(r => r.Status != "Cancelled")
            .Select(r => new { r.ContractType, r.TotalPrice, r.CheckInDate, r.CheckOutDate })
            .ToListAsync();
            
        var grouped = allRes
            .GroupBy(r => r.ContractType ?? "Diğer")
            .Select(g => 
            {
                var revenue = g.Sum(x => x.TotalPrice);
                var nights = g.Sum(x => (x.CheckOutDate - x.CheckInDate).Days > 0 ? (x.CheckOutDate - x.CheckInDate).Days : 1);
                var count = g.Count();
                
                return new AnalyticsMetric
                {
                    Label = g.Key,
                    Revenue = revenue,
                    Count = count, // displaying reservations count here, could be nights
                    ADR = nights > 0 ? revenue / nights : 0,
                    Percentage = 0 // Calc later
                };
            })
            .OrderByDescending(x => x.Revenue)
            .ToList();

        decimal totalRev = grouped.Sum(x => x.Revenue);
        int totalRes = grouped.Sum(x => x.Count);

        foreach (var item in grouped)
        {
            if (totalRev > 0) item.Percentage = (item.Revenue / totalRev) * 100;
        }

        return Ok(new DistributionAnalyticsData
        {
            Metrics = grouped,
            TotalRevenue = totalRev,
            TotalReservations = totalRes
        });
    }

    [HttpGet("distribution/channels")]
    public async Task<ActionResult<DistributionAnalyticsData>> GetChannelAnalytics()
    {
        // Group by Agency
        var allRes = await _context.Reservations
            .Include(r => r.Agency)
            .Where(r => r.Status != "Cancelled")
            .Select(r => new { AgencyName = r.Agency != null ? r.Agency.Name : "Direct", r.TotalPrice, r.CheckInDate, r.CheckOutDate })
            .ToListAsync();

        var grouped = allRes
            .GroupBy(r => r.AgencyName)
            .Select(g => 
            {
                var revenue = g.Sum(x => x.TotalPrice);
                var nights = g.Sum(x => (x.CheckOutDate - x.CheckInDate).Days > 0 ? (x.CheckOutDate - x.CheckInDate).Days : 1);
                
                return new AnalyticsMetric
                {
                    Label = g.Key,
                    Revenue = revenue,
                    Count = g.Count(),
                    ADR = nights > 0 ? revenue / nights : 0,
                };
            })
            .OrderByDescending(x => x.Revenue)
            .ToList();

        decimal totalRev = grouped.Sum(x => x.Revenue);
        int totalRes = grouped.Sum(x => x.Count);

        foreach (var item in grouped)
        {
            if (totalRev > 0) item.Percentage = (item.Revenue / totalRev) * 100;
        }

        return Ok(new DistributionAnalyticsData
        {
            Metrics = grouped,
            TotalRevenue = totalRev,
            TotalReservations = totalRes
        });
    }

    [HttpGet("distribution/geo")]
    public async Task<ActionResult<DistributionAnalyticsData>> GetGeoAnalytics()
    {
        // Join with Guest to get Nationality
        var query = from r in _context.Reservations
                    join g in _context.Guests on r.GuestId equals g.Id into guests
                    from subGuest in guests.DefaultIfEmpty()
                    where r.Status != "Cancelled"
                    select new 
                    { 
                        Nationality = subGuest.Nationality ?? "Unknown", 
                        r.TotalPrice,
                        r.CheckInDate,
                        r.CheckOutDate
                    };

        var allRes = await query.ToListAsync();

        var grouped = allRes
            .GroupBy(x => x.Nationality)
            .Select(g => 
            {
                var revenue = g.Sum(x => x.TotalPrice);
                var nights = g.Sum(x => (x.CheckOutDate - x.CheckInDate).Days > 0 ? (x.CheckOutDate - x.CheckInDate).Days : 1);
                
                return new AnalyticsMetric
                {
                    Label = g.Key,
                    Revenue = revenue,
                    Count = g.Count(),
                    ADR = nights > 0 ? revenue / nights : 0,
                };
            })
            .OrderByDescending(x => x.Revenue)
            .ToList();

        decimal totalRev = grouped.Sum(x => x.Revenue);
        int totalRes = grouped.Sum(x => x.Count);

        foreach (var item in grouped)
        {
            if (totalRev > 0) item.Percentage = (item.Revenue / totalRev) * 100;
        }

        return Ok(new DistributionAnalyticsData
        {
            Metrics = grouped,
            TotalRevenue = totalRev,
            TotalReservations = totalRes
        });
    }

    [HttpGet("reports/occupancy")]
    public async Task<ActionResult<List<object>>> GetOccupancyReport([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        // 1. Get all dates in range
        var dates = Enumerable.Range(0, 1 + end.Subtract(start).Days)
                              .Select(offset => start.AddDays(offset))
                              .ToList();

        // 2. Mock Total Rooms (In real app, fetch count from Rooms table where !Deleted)
        // Let's assume constant for now or count rooms
        var totalRooms = await _context.Rooms.CountAsync(r => !r.IsDeleted && !r.IsPassive);
        if (totalRooms == 0) totalRooms = 10; // Fallback

        // 3. Get daily loads
        var result = new List<object>();
        
        // This is heavy in loop, better to fetch all reservations in range and process in memory for small hotels
        var reservations = await _context.Reservations
            .Where(r => r.Status != "Cancelled" && r.CheckInDate < end && r.CheckOutDate > start)
            .Include(r => r.DailyPrices)
            .ToListAsync();

        foreach (var date in dates)
        {
            // Find reservations active on this date
            var activeRes = reservations.Where(r => r.CheckInDate <= date && r.CheckOutDate > date).ToList();
            
            int soldRooms = activeRes.Count;
            // Calculate revenue for this specific night
            // Uses DailyPrices if available, else avg
            decimal nightlyRevenue = 0;
            
            foreach (var r in activeRes)
            {
                var priceEntry = r.DailyPrices.FirstOrDefault(p => p.Date.Date == date.Date);
                if (priceEntry != null)
                {
                    nightlyRevenue += priceEntry.Price;
                }
                else
                {
                    // Fallback to average
                    var nights = (r.CheckOutDate - r.CheckInDate).Days;
                    if (nights < 1) nights = 1;
                    nightlyRevenue += r.TotalPrice / nights;
                }
            }

            double occupancyRate = totalRooms > 0 ? (double)soldRooms / totalRooms * 100 : 0;
            decimal adr = soldRooms > 0 ? nightlyRevenue / soldRooms : 0;
            decimal revPar = totalRooms > 0 ? nightlyRevenue / totalRooms : 0;

            result.Add(new 
            {
                Date = date,
                TotalRooms = totalRooms,
                SoldRooms = soldRooms,
                OccupancyRate = occupancyRate,
                Revenue = nightlyRevenue,
                ADR = adr,
                RevPAR = revPar
            });
        }

        return Ok(result);
    }

    [HttpGet("reports/forecast")]
    public async Task<ActionResult<List<object>>> GetForecastReport([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        // Similar logic to Occupancy but usually includes "Tentative" or different visualization
        // Reusing logic for MVP simplicity but separating endpoint for clarity
        return await GetOccupancyReport(start, end);
    }

    [HttpGet("reports/future")]
    public async Task<ActionResult<object>> GetFutureReport([FromQuery] DateTime? date)
    {
        var targetDate = date ?? DateTime.UtcNow.Date;
        var endDate = targetDate.AddDays(14); // 2-week outlook

        // 1. Fetch all relevant reservations for the next 14 days
        var reservations = await _context.Reservations
            .Where(r => r.Status != "Cancelled" && r.CheckOutDate >= targetDate && r.CheckInDate <= endDate)
            .Include(r => r.DailyPrices)
            .ToListAsync();

        var totalRooms = await _context.Rooms.CountAsync(r => !r.IsDeleted && !r.IsPassive) > 0 
            ? await _context.Rooms.CountAsync(r => !r.IsDeleted && !r.IsPassive) 
            : 10;

        // 2. Calculate Today's Snapshot
        var todayArrivals = reservations.Count(r => r.CheckInDate.Date == targetDate.Date);
        var todayDepartures = reservations.Count(r => r.CheckOutDate.Date == targetDate.Date);
        var todayInHouse = reservations.Count(r => r.CheckInDate.Date <= targetDate.Date && r.CheckOutDate.Date > targetDate.Date);
        var totalFutureRevenue = reservations.Sum(r => r.TotalPrice);

        // 3. Calculate 14-Day Outlook
        var outlook = new List<object>();
        for (int i = 0; i < 14; i++)
        {
            var currentDay = targetDate.AddDays(i);
            
            var dayArrivals = reservations.Count(r => r.CheckInDate.Date == currentDay);
            var dayDepartures = reservations.Count(r => r.CheckOutDate.Date == currentDay);
            
            // Occupancy for this night
            var dayInHouse = reservations.Count(r => r.CheckInDate.Date <= currentDay && r.CheckOutDate.Date > currentDay);
            
            // Revenue for this night
            decimal dayRevenue = 0;
            var activeRes = reservations.Where(r => r.CheckInDate.Date <= currentDay && r.CheckOutDate.Date > currentDay);
            foreach (var r in activeRes)
            {
               var priceEntry = r.DailyPrices.FirstOrDefault(p => p.Date.Date == currentDay);
               if (priceEntry != null) dayRevenue += priceEntry.Price;
               else {
                    var nights = (r.CheckOutDate - r.CheckInDate).Days;
                    if(nights < 1) nights = 1;
                    dayRevenue += r.TotalPrice / nights;
               }
            }

            outlook.Add(new {
                Date = currentDay,
                Arrivals = dayArrivals,
                Departures = dayDepartures,
                InHouse = dayInHouse,
                OccupancyRate = (double)dayInHouse / totalRooms * 100,
                Revenue = dayRevenue
            });
        }

        return Ok(new 
        {
            Date = targetDate,
            Summary = new {
                Arrivals = todayArrivals,
                Departures = todayDepartures,
                InHouse = todayInHouse,
                TotalFutureRevenue = totalFutureRevenue,
                UpcomingReservations = reservations.Count
            },
            Outlook = outlook
        });
    }


    [HttpGet("reports/management")]
    public async Task<ActionResult<object>> GetManagementReport()
    {
        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var startOfYear = new DateTime(today.Year, 1, 1);

        // Previous Year for Comparison
        var startOfLastMonth = startOfMonth.AddYears(-1);
        var endOfLastMonth = today.AddYears(-1); // Same date last year

        // FETCH DATA (Optimized for demo, real world needs optimized SQL)
        var mtdRes = await _context.Reservations
            .Where(r => r.Status != "Cancelled" && r.CheckInDate < today.AddDays(1) && r.CheckOutDate > startOfMonth)
            .Include(r => r.DailyPrices)
            .ToListAsync();

        var ytdRes = await _context.Reservations
             .Where(r => r.Status != "Cancelled" && r.CheckInDate < today.AddDays(1) && r.CheckOutDate > startOfYear)
             .Include(r => r.DailyPrices)
             .Include(r => r.Guests) // For nationality stats if needed
             .Include(r => r.Agency) // Include Agency
             .ToListAsync();

        // Daily Trends (Last 30 Days)
        var trendStart = today.AddDays(-30);
        var trendRes = await _context.Reservations
            .Where(r => r.Status != "Cancelled" && r.CheckInDate < today.AddDays(1) && r.CheckOutDate > trendStart) 
            .Include(r => r.DailyPrices)
            .ToListAsync();
        
        var dailyTrends = new List<object>();
        for (int i = 0; i < 30; i++)
        {
            var d = trendStart.AddDays(i);
            var rev = CalculatePeriodRevenue(trendRes, d, d);
            var occ = CalculatePeriodNights(trendRes, d, d);
            dailyTrends.Add(new { Date = d, Revenue = rev, Occupancy = occ });
        }

        // Channel Breakdown (YTD)
        var channelStats = ytdRes
            .GroupBy(r => r.AgencyId != null ? r.Agency.Name : "Direct")
            .Select(g => new { 
                Name = g.Key, 
                Revenue = CalculatePeriodRevenue(g.ToList(), startOfYear, today),
                Count = g.Count() 
            })
            .OrderByDescending(x => x.Revenue)
            .ToList();

        // HELPERS
        var totalRooms = await _context.Rooms.CountAsync(r => !r.IsDeleted && !r.IsPassive);
        if (totalRooms == 0) totalRooms = 10;

        // CALCULATE MTD
        decimal mtdRevenue = CalculatePeriodRevenue(mtdRes, startOfMonth, today);
        int mtdNights = CalculatePeriodNights(mtdRes, startOfMonth, today);
        double mtdOcc = totalRooms > 0 ? (double)mtdNights / (totalRooms * (today - startOfMonth).Days + 1) * 100 : 0;
        decimal mtdAdr = mtdNights > 0 ? mtdRevenue / mtdNights : 0;

        // CALCULATE YTD
        decimal ytdRevenue = CalculatePeriodRevenue(ytdRes, startOfYear, today);
        int ytdNights = CalculatePeriodNights(ytdRes, startOfYear, today);
        double ytdOcc = totalRooms > 0 ? (double)ytdNights / (totalRooms * (today - startOfYear).Days + 1) * 100 : 0;
        decimal ytdAdr = ytdNights > 0 ? ytdRevenue / ytdNights : 0;
        
        return Ok(new 
        {
            Date = today,
            MTD = new { Revenue = mtdRevenue, Occupancy = mtdOcc, ADR = mtdAdr, SoldNights = mtdNights },
            YTD = new { Revenue = ytdRevenue, Occupancy = ytdOcc, ADR = ytdAdr, SoldNights = ytdNights },
            Budget = new { MTD_Revenue = mtdRevenue * 1.1m, YTD_Revenue = ytdRevenue * 1.15m },
            Trends = dailyTrends,
            Channels = channelStats
        });
    }

    private decimal CalculatePeriodRevenue(List<Reservation> reservations, DateTime start, DateTime end)
    {
        decimal total = 0;
        var startDay = start.Date;
        var endDay = end.Date;

        foreach (var r in reservations)
        {
             // Overlap logic: Sum daily prices that fall within start-end
             // If no daily prices, prorate
             if (r.DailyPrices != null && r.DailyPrices.Any())
             {
                 total += r.DailyPrices
                    .Where(d => d.Date.Date >= startDay && d.Date.Date <= endDay)
                    .Sum(d => d.Price);
             }
             else
             {
                 // Prorate
                 var rStart = r.CheckInDate.Date < startDay ? startDay : r.CheckInDate.Date;
                 var rEnd = r.CheckOutDate.Date > endDay ? endDay : r.CheckOutDate.Date;
                 
                 // If the reservation overlaps with the period
                 if (rEnd > rStart)
                 {
                     var daysInPeriod = (rEnd - rStart).Days;
                     // Edge case: if start == end (single day) and r overlaps, daysInPeriod might be 1?
                     // rEnd is usually exclusive. 
                     // If asking for [Today, Today], and Res is [Yesterday, Tomorrow], overlap is Today.
                     // rStart = Today, rEnd = Today (capped at endDay). Wait.
                     // If endDay is inclusive for the period query, we need to handle rEnd carefully.
                     
                     // Revised Logic for Proration:
                     // Calculate intersection of [r.CheckIn, r.CheckOut) and [start, end] (inclusive-inclusive?)
                     // usually daily stats are meant to be "Night of X".
                     
                     // Let's iterate days for safety and clarity in proration
                     var totalResDays = (r.CheckOutDate.Date - r.CheckInDate.Date).Days;
                     if (totalResDays < 1) totalResDays = 1;
                     decimal dailyRate = r.TotalPrice / totalResDays;

                     // Iterate strictly through the requested period
                     for (var d = startDay; d <= endDay; d = d.AddDays(1))
                     {
                         if (d >= r.CheckInDate.Date && d < r.CheckOutDate.Date)
                         {
                             total += dailyRate;
                         }
                     }
                 }
             }
        }
        return total;
    }

    private int CalculatePeriodNights(List<Reservation> reservations, DateTime start, DateTime end)
    {
        int nights = 0;
        var startDay = start.Date;
        var endDay = end.Date;

        foreach (var r in reservations)
        {
             // Overlap of [CheckIn, CheckOut) with [startDay, endDay] (inclusive query period)
             // We want to count how many nights of this reservation fall within the query dates.
             // If query is for "Nov 12", we want to know if they stayed night of Nov 12.
             // That means CheckIn <= Nov 12 AND CheckOut > Nov 12.

             for (var d = startDay; d <= endDay; d = d.AddDays(1))
             {
                 if (d >= r.CheckInDate.Date && d < r.CheckOutDate.Date)
                 {
                     nights++;
                 }
             }
        }
        return nights;
    }
}
