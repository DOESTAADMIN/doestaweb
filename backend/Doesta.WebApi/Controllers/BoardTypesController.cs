using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BoardTypesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BoardTypesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BoardType>>> GetBoardTypes()
    {
        return await _context.BoardTypes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BoardType>> GetBoardType(int id)
    {
        var boardType = await _context.BoardTypes.FindAsync(id);
        if (boardType == null) return NotFound();
        return boardType;
    }

    [HttpPost]
    public async Task<ActionResult<BoardType>> PostBoardType(BoardType boardType)
    {
        _context.BoardTypes.Add(boardType);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBoardType), new { id = boardType.Id }, boardType);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBoardType(int id, BoardType boardType)
    {
        if (id != boardType.Id) return BadRequest();
        _context.Entry(boardType).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!BoardTypeExists(id)) return NotFound(); else throw; }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBoardType(int id)
    {
        var boardType = await _context.BoardTypes.FindAsync(id);
        if (boardType == null) return NotFound();
        _context.BoardTypes.Remove(boardType);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool BoardTypeExists(int id) => _context.BoardTypes.Any(e => e.Id == id);
}
