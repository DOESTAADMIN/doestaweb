using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StockController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StockController(ApplicationDbContext context)
    {
        _context = context;
    }

    // --- Warehouses ---
    [HttpGet("warehouses")]
    public async Task<ActionResult<IEnumerable<Warehouse>>> GetWarehouses()
    {
        return await _context.Warehouses.ToListAsync();
    }
    
    [HttpPost("warehouses")]
    public async Task<ActionResult<Warehouse>> PostWarehouse(Warehouse warehouse)
    {
        _context.Warehouses.Add(warehouse);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWarehouses), new { id = warehouse.Id }, warehouse);
    }

    // --- Inventory ---
    [HttpGet("inventory")]
    public async Task<ActionResult<IEnumerable<StockInventory>>> GetInventory([FromQuery] int? warehouseId)
    {
        var query = _context.StockInventories.Include(i => i.Product).Include(i => i.Warehouse).AsQueryable();
        if (warehouseId.HasValue)
        {
            query = query.Where(i => i.WarehouseId == warehouseId);
        }
        return await query.ToListAsync();
    }

    // --- Transactions ---
    [HttpPost("transactions")]
    public async Task<IActionResult> PostTransaction(StockTransaction transaction)
    {
        _context.StockTransactions.Add(transaction);
        
        // Update Inventory Level
        var inventory = await _context.StockInventories
            .FirstOrDefaultAsync(i => i.ProductId == transaction.ProductId && i.WarehouseId == transaction.WarehouseId);
            
        if (inventory == null)
        {
            inventory = new StockInventory 
            { 
                ProductId = transaction.ProductId, 
                WarehouseId = transaction.WarehouseId,
                Quantity = 0 
            };
            _context.StockInventories.Add(inventory);
        }
        
        if (transaction.Type == "IN")
            inventory.Quantity += transaction.Quantity;
        else if (transaction.Type == "OUT" || transaction.Type == "SALE" || transaction.Type == "WASTE")
            inventory.Quantity -= transaction.Quantity;
            
        await _context.SaveChangesAsync();
        return Ok(transaction);
    }
    
    [HttpPost("seed")]
    public async Task<IActionResult> SeedStock()
    {
        if (_context.Warehouses.Any()) return Ok("Already seeded");
        
        var mainWh = new Warehouse { Name = "Main Warehouse", Type = "Main" };
        var kitchenWh = new Warehouse { Name = "Kitchen", Type = "Kitchen" };
        var barWh = new Warehouse { Name = "Bar", Type = "Bar" };
        
        _context.Warehouses.AddRange(mainWh, kitchenWh, barWh);
        await _context.SaveChangesAsync();
        
        return Ok("Seeded warehouses");
    }
}
