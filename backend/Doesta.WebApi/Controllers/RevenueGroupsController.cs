using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RevenueGroupsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RevenueGroupsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RevenueGroup>>> GetRevenueGroups()
    {
        return await _context.RevenueGroups.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RevenueGroup>> GetRevenueGroup(int id)
    {
        var group = await _context.RevenueGroups.FindAsync(id);
        if (group == null) return NotFound();
        return group;
    }

    [HttpPost]
    public async Task<ActionResult<RevenueGroup>> PostRevenueGroup(RevenueGroup group)
    {
        _context.RevenueGroups.Add(group);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRevenueGroup), new { id = group.Id }, group);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutRevenueGroup(int id, RevenueGroup group)
    {
        if (id != group.Id) return BadRequest();
        _context.Entry(group).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!RevenueGroupExists(id)) return NotFound(); else throw; }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRevenueGroup(int id)
    {
        var group = await _context.RevenueGroups.FindAsync(id);
        if (group == null) return NotFound();
        _context.RevenueGroups.Remove(group);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool RevenueGroupExists(int id) => _context.RevenueGroups.Any(e => e.Id == id);
}
