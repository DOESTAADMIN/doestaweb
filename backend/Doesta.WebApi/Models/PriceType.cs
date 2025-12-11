using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class PriceType
{
    public int Id { get; set; }
    
    [Required]
    public string Code { get; set; } = string.Empty;
    
    public bool IsRefundable { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal PrepayRatio { get; set; } = 100;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal PriceFactor { get; set; } = 1.0m;
    
    public int? MinStay { get; set; }
    public int? MaxStay { get; set; }
    
    public int? MinDaysBeforeCheckin { get; set; }
    public int? MaxDaysBeforeCheckin { get; set; }
}
