using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CampaignsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CampaignsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Campaign>>> GetCampaigns()
    {
        return await _context.Campaigns.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Campaign>> PostCampaign(Campaign campaign)
    {
        _context.Campaigns.Add(campaign);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCampaigns), new { id = campaign.Id }, campaign);
    }
}
