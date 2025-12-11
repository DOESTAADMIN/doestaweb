using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class InvoiceItem
{
    public int Id { get; set; }
    
    public int InvoiceId { get; set; }
    public Invoice Invoice { get; set; }
    
    public string Description { get; set; } // Can be free text or Product Name
    
    public int? ProductId { get; set; }
    public Product? Product { get; set; }
    
    public int Quantity { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }
}
