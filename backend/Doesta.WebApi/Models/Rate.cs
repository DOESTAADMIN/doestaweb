using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class Rate
{
    public int Id { get; set; }
    
    [Required]
    public string Code { get; set; } // "BAR", "NONREF", "CORP"
    
    public string Name { get; set; }
    public string Currency { get; set; } = "EUR"; // "TRY", "USD", "EUR"
    
    public string BoardType { get; set; } // "BB", "FB", "AI"
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal BasePrice { get; set; }
    
    public bool IsActive { get; set; } = true;
}
