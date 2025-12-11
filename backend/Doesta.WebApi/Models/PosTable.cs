using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class PosTable
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    public string? Zone { get; set; } // "Indoor", "Garden", "Terrace"
    public int Capacity { get; set; }
    
    public string Status { get; set; } = "Empty"; // "Empty", "Occupied", "Bill", "Reserved"
    
    // Active Order Context
    public int? CurrentOrderId { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal CurrentBillAmount { get; set; }
}
