using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PosOrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PosOrdersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PosOrder>>> GetOrders([FromQuery] string status = "Open")
    {
        return await _context.PosOrders
            .Include(o => o.Table)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .Where(o => o.Status == status)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<PosOrder>> CreateOrder(PosOrder order)
    {
        // If table is specified, check if it's already occupied
        if (order.TableId.HasValue)
        {
            var table = await _context.PosTables.FindAsync(order.TableId.Value);
            if (table != null)
            {
                if (table.Status == "Occupied" && table.CurrentOrderId != null)
                {
                     // Add to existing order logic could go here, but for simplicity creation implies new or separate
                     // In real scenario, we might merge or reject
                }
                
                table.Status = "Occupied";
                order.Status = "Open";
            }
        }
        
        _context.PosOrders.Add(order);
        await _context.SaveChangesAsync();
        
        // Update table current order ref
        if (order.TableId.HasValue)
        {
            var table = await _context.PosTables.FindAsync(order.TableId.Value);
            if (table != null)
            {
                table.CurrentOrderId = order.Id;
                await _context.SaveChangesAsync();
            }
        }

        return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
    }
    
    [HttpPost("{id}/items")]
    public async Task<IActionResult> AddItem(int id, PosOrderItem item)
    {
        var order = await _context.PosOrders.Include(o => o.Table).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();

        item.PosOrderId = id;
        
        // Get product price if not zero
        if (item.UnitPrice == 0)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product != null)
            {
                item.UnitPrice = product.Price;
            }
        }
        item.TotalPrice = item.UnitPrice * item.Quantity;
        
        _context.PosOrderItems.Add(item);
        
        // Update total
        order.TotalAmount += item.TotalPrice;
        if (order.Table != null) order.Table.CurrentBillAmount = order.TotalAmount;
        
        await _context.SaveChangesAsync();
        
        return Ok(order);
    }
    
    [HttpPost("{id}/pay")]
    public async Task<IActionResult> PayOrder(int id)
    {
        var order = await _context.PosOrders.Include(o => o.Table).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();
        
        order.Status = "Paid";
        
        if (order.Table != null)
        {
            order.Table.Status = "Empty";
            order.Table.CurrentOrderId = null;
            order.Table.CurrentBillAmount = 0;
        }
        
        // Here we would also create a Transaction Record (Income)
        var transaction = new Transaction
        {
            Description = $"POS Order #{order.Id} Payment",
            Amount = order.TotalAmount,
            Type = "Payment",
            Category = "F&B",
            Date = DateTime.Now
        };
        _context.Transactions.Add(transaction);

        await _context.SaveChangesAsync();
        return Ok(order);
    }
}
