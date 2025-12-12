using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LogsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LogsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReservationLog>>> GetLogs(
        [FromQuery] string? module, 
        [FromQuery] string? user, 
        [FromQuery] string? action,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] int limit = 100)
    {
        var query = _context.ReservationLogs.AsQueryable();

        if (!string.IsNullOrEmpty(module)) query = query.Where(l => l.Module == module);
        if (!string.IsNullOrEmpty(user)) query = query.Where(l => l.User == user);
        if (!string.IsNullOrEmpty(action)) query = query.Where(l => l.Action == action);
        if (startDate.HasValue) query = query.Where(l => l.Date >= startDate.Value);
        if (endDate.HasValue) query = query.Where(l => l.Date <= endDate.Value);

        return await query
            .OrderByDescending(l => l.Date)
            .Take(limit)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ReservationLog>> CreateLog(ReservationLog log)
    {
        log.Date = DateTime.UtcNow;
        _context.ReservationLogs.Add(log);
        await _context.SaveChangesAsync();
        return Ok(log);
    }
}
