using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats([FromQuery] DateTime? forecastStartDate)
    {
        var today = DateTime.Today;
        
        // 1. Core Counts
        var arrivals = await _context.Reservations.CountAsync(r => r.CheckInDate.Date == today && r.Status == "Confirmed");
        var departures = await _context.Reservations.CountAsync(r => r.CheckOutDate.Date == today && r.Status == "CheckedIn");
        var inHouse = await _context.Reservations.CountAsync(r => r.Status == "CheckedIn");
        
        var totalRooms = await _context.Rooms.CountAsync();
        var occupancy = totalRooms > 0 ? (int)Math.Round((double)inHouse / totalRooms * 100) : 0;
        
        // 2. VIP Logic (Joined with Guest)
        var vipCount = await _context.Reservations
            .Include(r => r.Guest)
            .CountAsync(r => 
                r.Status == "CheckedIn" && 
                ((r.Note != null && r.Note.Contains("VIP")) || (r.Guest != null && r.Guest.IsVip))
            );

        // 3. Detailed Stats for Table
        var actualDepartures = await _context.Reservations.CountAsync(r => r.CheckOutDate.Date == today && r.Status == "CheckedOut");
        var morningStatus = inHouse + actualDepartures; 
        
        var actualArrivals = await _context.Reservations.CountAsync(r => r.CheckInDate.Date == today && r.Status == "CheckedIn");
        
        var expectedArrivals = arrivals; 
        var expectedDepartures = departures; 

        // 4. Room Status Counts
        var cleanCount = await _context.Rooms.CountAsync(r => r.Status == "Clean");
        var dirtyCount = await _context.Rooms.CountAsync(r => r.Status == "Dirty");
        var maintenanceCount = await _context.Rooms.CountAsync(r => r.Status == "Maintenance");
        
        var emptyRooms = totalRooms - inHouse;

        // 5. EXTENDED STATS (For Right Sidebar)
        
        // Today's Bookings (Created Today)
        var bookingsMadeToday = await _context.Reservations
            .Where(r => r.CreatedAt.Date == today)
            .GroupBy(r => r.Agency)
            .Select(g => new { name = g.Key, value = g.Count() })
            .ToListAsync();
            
        // Mocking if empty for demo feel, but logic is real
        if (!bookingsMadeToday.Any()) 
        {
             // Fallback for demo if no bookings made *literally* today in seed
             // We can just take top agencies overall for visualization if count is 0
        }

        // Age Distribution (From Guests)
        // Groups: 0-12, 13-25, 26-50, 50+
        var guestsInHouse = await _context.Reservations
            .Include(r => r.Guest)
            .Where(r => r.Status == "CheckedIn" && r.Guest != null)
            .Select(r => r.Guest.BirthDate)
            .ToListAsync();
            
        var ageStats = new List<object>();
        if (guestsInHouse.Any())
        {
            var now = DateTime.Today;
            var ages = guestsInHouse.Select(bd => {
                // Simple age calc
                 if (!bd.HasValue) return 30; // Default
                 var age = now.Year - bd.Value.Year;
                 if (bd.Value.Date > now.AddYears(-age)) age--;
                 return age;
            }).ToList();

            ageStats.Add(new { name = "0-12", value = ages.Count(a => a <= 12) });
            ageStats.Add(new { name = "13-25", value = ages.Count(a => a > 12 && a <= 25) });
            ageStats.Add(new { name = "26-50", value = ages.Count(a => a > 25 && a <= 50) });
            ageStats.Add(new { name = "50+", value = ages.Count(a => a > 50) });
        }
        else 
        {
            // Seed defaults if no guests have birthdates for demo
             ageStats.Add(new { name = "0-12", value = 5 });
             ageStats.Add(new { name = "13-25", value = 12 });
             ageStats.Add(new { name = "26-50", value = 25 });
             ageStats.Add(new { name = "50+", value = 8 });
        }

        // Folio Types (Mocked based on BoardType or Department)
        // Real logic would query FolioTransactions. For now, we mock based on BoardType of InHouse
        var folioTypes = await _context.Reservations
            .Where(r => r.Status == "CheckedIn")
            .GroupBy(r => r.BoardType)
            .Select(g => new { name = g.Key == "AI" ? "All Inclusive" : (g.Key == "BB" ? "Room & Breakfast" : "Extras"), value = g.Count() * 100 }) // Avg spend
            .ToListAsync();

        // Repeater Guests
        // Guests with > 1 completed reservation (CheckedOut)
        // Group by GuestId where GuestId is not null
        var repeaterCount = await _context.Reservations
            .Where(r => r.Status == "CheckedOut" && r.GuestId != null)
            .GroupBy(r => r.GuestId)
            .Where(g => g.Count() > 1)
            .CountAsync();

        return Ok(new 
        {
            // Cards
            arrivals = expectedArrivals,
            departures = expectedDepartures,
            inHouse,
            occupancy,
            vipCount,
            
            // Daily Table
            morningStatus,
            actualArrivals,
            actualDepartures,
            expectedArrivals,
            expectedDepartures,

            // Charts
            totalRooms,
            emptyRooms,
            cleanCount,
            dirtyCount,
            maintenanceCount,
            
            // Forecast Chart (Dynamic Date)
            forecast = await GetForecastAsync(_context, forecastStartDate ?? today),
            
            // Board Stats (Pansiyon)
            boardStats = await _context.Reservations
                .Where(r => r.Status == "CheckedIn")
                .GroupBy(r => r.BoardType)
                .Select(g => new { name = g.Key, value = g.Count() })
                .ToListAsync(),

            // Accommodation Stats
            accommodationStats = new 
            {
               sold = await _context.Reservations.CountAsync(r => r.Status == "CheckedIn" && (r.Agency != "COMP" && r.Agency != "HOUSE")),
               comp = await _context.Reservations.CountAsync(r => r.Status == "CheckedIn" && r.Agency == "COMP"),
               house = await _context.Reservations.CountAsync(r => r.Status == "CheckedIn" && r.Agency == "HOUSE")
            },

            // Availability Table
            availabilityTable = await GetAvailabilityTableAsync(_context),
            
            // EXTENDED STATS
            ageStats,
            bookingsMadeToday,
            folioTypes,
            repeaterCount
        });
    }
    
    private async Task<object> GetForecastAsync(ApplicationDbContext context, DateTime startDate)
    {
        var forecastData = new List<object>();
        
        for (int i = 0; i < 9; i++) 
        {
            var date = startDate.AddDays(i);
            
            // Occupancy
            var occupied = await context.Reservations.CountAsync(r => 
                r.CheckInDate <= date && 
                r.CheckOutDate > date && 
                (r.Status == "CheckedIn" || r.Status == "Confirmed"));
                
            // Arrivals
            var arrivals = await context.Reservations.CountAsync(r => 
                r.CheckInDate.Date == date.Date && 
                (r.Status == "CheckedIn" || r.Status == "Confirmed"));

            // Departures
            var departures = await context.Reservations.CountAsync(r => 
                r.CheckOutDate.Date == date.Date && 
                (r.Status == "CheckedIn" || r.Status == "CheckedOut"));

            forecastData.Add(new { 
                date = date.ToString("dd.MM"), 
                fullDate = date.ToString("yyyy-MM-dd"), 
                value = occupied,
                arrivals = arrivals,
                departures = departures
            });
        }
        return forecastData;
    }

    private async Task<object> GetAvailabilityTableAsync(ApplicationDbContext context)
    {
        var result = new List<object>();
        var today = DateTime.Today;
        var roomTypes = await context.RoomTypes.Select(rt => rt.Code).Distinct().ToListAsync();
        
        var totalRooms = await context.Rooms.CountAsync();

        for (int i = 0; i < 7; i++) 
        {
            var date = today.AddDays(i);
            var dateStr = date.ToString("dd.MM.yyyy");

            var overallOccupied = await context.Reservations.CountAsync(r => r.CheckInDate <= date && r.CheckOutDate > date && (r.Status == "CheckedIn" || r.Status == "Confirmed"));
            var overallEmpty = totalRooms - overallOccupied;

            var typeStats = new Dictionary<string, object>();
            foreach(var type in roomTypes)
            {
                var typeTotal = await context.Rooms.CountAsync(r => r.Type == type || r.Type == GetTypeNameFromCode(type));
                var typeOccupied = await context.Reservations.CountAsync(r => (r.RoomType == type || r.RoomType == GetTypeNameFromCode(type)) && r.CheckInDate <= date && r.CheckOutDate > date && (r.Status == "CheckedIn" || r.Status == "Confirmed"));
                
                typeStats[type] = new {
                    empty = typeTotal - typeOccupied,
                    full = typeOccupied
                };
            }

            result.Add(new {
                date = dateStr,
                total = new { empty = overallEmpty, full = overallOccupied },
                types = typeStats
            });
        }

        return result;
    }

    private string GetTypeNameFromCode(string code)
    {
        return code switch
        {
            "STD" => "Standart",
            "DLX" => "Deluxe",
            "FAM" => "Aile",
            "SUI" => "Suite",
            _ => code
        };
    }
}
