using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InvoicesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public InvoicesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices([FromQuery] string? type)
    {
        var query = _context.Invoices.Include(i => i.Account).AsQueryable();
        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(i => i.Type == type);
        }
        return await query.OrderByDescending(i => i.Date).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Invoice>> CreateInvoice(Invoice invoice)
    {
        // Calculate totals from items if 0
        if (invoice.TotalAmount == 0 && invoice.Items.Any())
        {
            invoice.SubTotal = invoice.Items.Sum(i => i.UnitPrice * i.Quantity);
            invoice.TaxAmount = invoice.SubTotal * 0.20m; // Mock 20% tax
            invoice.TotalAmount = invoice.SubTotal + invoice.TaxAmount;
        }

        _context.Invoices.Add(invoice);
        
        // Update Account Balance
        var account = await _context.Accounts.FindAsync(invoice.AccountId);
        if (account != null)
        {
            if (invoice.Type == "Sales")
                account.Balance += invoice.TotalAmount;
            else if (invoice.Type == "Purchase")
                account.Balance -= invoice.TotalAmount;
        }

        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInvoices), new { id = invoice.Id }, invoice);
    }
}
