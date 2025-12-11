using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Data;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] int? categoryId, [FromQuery] string? search)
    {
        var query = _context.Products.Include(p => p.Category).AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId);
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => p.Name.Contains(search) || p.Code.Contains(search));
        }

        return await query.ToListAsync();
    }
    
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        return await _context.Categories.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
    }
    
    [HttpPost("seed")]
    public async Task<IActionResult> SeedProducts()
    {
         if (_context.Categories.Any()) return Ok("Already seeded");

         // Categories
         var mainCat = new Category { Name = "Main Course", Type = "Product" };
         var drinkCat = new Category { Name = "Drinks", Type = "Product" };
         var dessertCat = new Category { Name = "Desserts", Type = "Product" };
         
         _context.Categories.AddRange(mainCat, drinkCat, dessertCat);
         await _context.SaveChangesAsync();
         
         // Products
         _context.Products.AddRange(
             new Product { Name = "Grilled Chicken", Price = 320, Cost = 120, CategoryId = mainCat.Id, Unit = "Portion" },
             new Product { Name = "Steak", Price = 550, Cost = 250, CategoryId = mainCat.Id, Unit = "Portion" },
             new Product { Name = "Coca Cola", Price = 60, Cost = 15, CategoryId = drinkCat.Id, Unit = "Can" },
             new Product { Name = "Water", Price = 30, Cost = 5, CategoryId = drinkCat.Id, Unit = "Bottle" },
             new Product { Name = "Baklava", Price = 200, Cost = 80, CategoryId = dessertCat.Id, Unit = "Portion" }
         );
         
         await _context.SaveChangesAsync();
         return Ok("Seeded products");
    }
}
