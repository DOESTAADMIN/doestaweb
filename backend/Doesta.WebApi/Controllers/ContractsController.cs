using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContractsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ContractsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Contract>>> GetContracts()
    {
        return await _context.Contracts.Include(c => c.Agency).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Contract>> PostContract(Contract contract)
    {
        _context.Contracts.Add(contract);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetContracts), new { id = contract.Id }, contract);
    }
}
