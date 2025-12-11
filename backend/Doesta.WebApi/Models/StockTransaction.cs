using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class StockTransaction
{
    public int Id { get; set; }
    
    public DateTime Date { get; set; } = DateTime.Now;
    
    public int ProductId { get; set; }
    public Product Product { get; set; }
    
    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; }
    
    public string Type { get; set; } // "IN", "OUT", "TRANSFER", "SALE", "WASTE"
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Quantity { get; set; } // Positive for IN, Negative for OUT usually handled in logic
    
    public string? ReferenceNo { get; set; } // Invoice No or Order No
    public string? Description { get; set; }
}
