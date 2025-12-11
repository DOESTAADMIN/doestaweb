using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class RevenueGroup
{
    public int Id { get; set; }
    
    [Required]
    public string Code { get; set; } = string.Empty;
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string Type { get; set; } = "Other"; // Oda, Yiyecek, İçecek, Diğer
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Vat1 { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Vat2 { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Vat3 { get; set; }
    
    public bool IsPassive { get; set; }
    public string? ExtraCode { get; set; }
    public string? MainGroup { get; set; }
}
