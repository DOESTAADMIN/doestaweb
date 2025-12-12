using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        return user;
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        // Check if username exists
        if (await _context.Users.AnyAsync(u => u.Username == user.Username))
        {
            return BadRequest("Username already exists");
        }

        user.Password = HashPassword(user.Password);
        user.CreatedAt = DateTime.UtcNow;
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // LOG ACTION
        _context.ReservationLogs.Add(new ReservationLog
        {
            Module = "User",
            Action = "Create",
            Description = $"User {user.Username} created.",
            User = "Admin", // TODO: Get from claims
            ReservationId = null
        });
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {
        if (id != user.Id) return BadRequest();

        var existingUser = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        if (existingUser == null) return NotFound();

        // Only hash if password changed (and is not empty/dummy)
        // Frontend should send empty string if no change, or we compare.
        // Simple logic: If incoming password is difference from DB hash, hash it.
        // BUT we can't know if incoming is hash or plain. 
        // Convention: Frontend sends empty password if not changing.
        
        if (string.IsNullOrEmpty(user.Password))
        {
            user.Password = existingUser.Password;
        }
        else if (user.Password != existingUser.Password)
        {
            user.Password = HashPassword(user.Password);
        }

        _context.Entry(user).State = EntityState.Modified;
        
        try
        {
            await _context.SaveChangesAsync();
            
            // LOG ACTION
            _context.ReservationLogs.Add(new ReservationLog
            {
                Module = "User",
                Action = "Update",
                Description = $"User {user.Username} updated.",
                User = "Admin", // TODO: Get from claims
                ReservationId = null
            });
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Users.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        
        // LOG ACTION
        _context.ReservationLogs.Add(new ReservationLog
        {
            Module = "User",
            Action = "Delete",
            Description = $"User {user.Username} deleted.",
            User = "Admin", // TODO: Get from claims
            ReservationId = null
        });
        
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private string HashPassword(string password)
    {
        using (var sha256 = System.Security.Cryptography.SHA256.Create())
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
