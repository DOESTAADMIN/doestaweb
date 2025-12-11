using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class Product
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    public string? Code { get; set; }
    public string? Barcode { get; set; }
    
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Cost { get; set; }
    
    public string? Unit { get; set; } // "Adet", "Kg", "Porsiyon"
    
    public bool IsStockTracked { get; set; } = true;
    public bool IsForSale { get; set; } = true; // For POS
    public bool IsRawMaterial { get; set; } = false; // For Recipes
}
