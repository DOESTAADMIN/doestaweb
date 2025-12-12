using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupBookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GroupBookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/GroupBookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupBooking>>> GetGroupBookings([FromQuery] string? status)
        {
            var query = _context.GroupBookings
                .Include(g => g.Agency)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(g => g.Status == status);
            }

            return await query.ToListAsync();
        }

        // GET: api/GroupBookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GroupBooking>> GetGroupBooking(int id)
        {
            var groupBooking = await _context.GroupBookings
                .Include(g => g.Agency)
                .Include(g => g.Reservations)
                    .ThenInclude(r => r.Room)
                .Include(g => g.Reservations)
                    .ThenInclude(r => r.Guests)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (groupBooking == null)
            {
                return NotFound();
            }

            return groupBooking;
        }

        // POST: api/GroupBookings
        [HttpPost]
        public async Task<ActionResult<GroupBooking>> PostGroupBooking(GroupBooking groupBooking)
        {
            // Initial validation if needed
            groupBooking.CreatedAt = DateTime.UtcNow;
            
            _context.GroupBookings.Add(groupBooking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGroupBooking", new { id = groupBooking.Id }, groupBooking);
        }

        // PUT: api/GroupBookings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGroupBooking(int id, GroupBooking groupBooking)
        {
            if (id != groupBooking.Id)
            {
                return BadRequest();
            }

            _context.Entry(groupBooking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroupBookingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/GroupBookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroupBooking(int id)
        {
            var groupBooking = await _context.GroupBookings.FindAsync(id);
            if (groupBooking == null)
            {
                return NotFound();
            }

            _context.GroupBookings.Remove(groupBooking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GroupBookingExists(int id)
        {
            return _context.GroupBookings.Any(e => e.Id == id);
        }
    }
}
