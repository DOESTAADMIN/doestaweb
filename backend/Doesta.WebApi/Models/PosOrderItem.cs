using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class PosOrderItem
{
    public int Id { get; set; }
    
    public int PosOrderId { get; set; }
    public PosOrder PosOrder { get; set; }
    
    public int ProductId { get; set; }
    public Product Product { get; set; }
    
    public int Quantity { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }
    
    public string? Note { get; set; }
}
