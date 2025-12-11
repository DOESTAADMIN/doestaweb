using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class StockInventory
{
    public int Id { get; set; }
    
    public int ProductId { get; set; }
    public Product Product { get; set; }
    
    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Quantity { get; set; }
    
    public int? MinLevel { get; set; }
    public int? MaxLevel { get; set; }
}
