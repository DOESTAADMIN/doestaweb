using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgenciesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AgenciesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Agency>>> GetAgencies()
        {
            return await _context.Agencies.OrderBy(a => a.Name).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Agency>> GetAgency(int id)
        {
            var agency = await _context.Agencies
                .Include(a => a.StopSells)
                .Include(a => a.Quotas)
                .Include(a => a.Discounts)
                .Include(a => a.Officials)
                .Include(a => a.FolioRoutings)
                .FirstOrDefaultAsync(a => a.Id == id);
                
            if (agency == null) return NotFound();
            return agency;
        }

        [HttpPost]
        public async Task<ActionResult<Agency>> PostAgency(Agency agency)
        {
            // Simple validation
            if (await _context.Agencies.AnyAsync(a => a.Code == agency.Code))
            {
                return BadRequest("Bu acenta kodu zaten kullanılıyor.");
            }

            _context.Agencies.Add(agency);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAgency", new { id = agency.Id }, agency);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAgency(int id, Agency agency)
        {
            if (id != agency.Id) return BadRequest();

            _context.Entry(agency).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Agencies.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAgency(int id)
        {
            var agency = await _context.Agencies.FindAsync(id);
            if (agency == null) return NotFound();

            _context.Agencies.Remove(agency);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
