using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class BoardType
{
    public int Id { get; set; }
    
    [Required]
    public string Code { get; set; } = string.Empty; // BB, HB
    
    public string Name { get; set; } = string.Empty;
    public string SystemCode { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal ExtraAdultPrice { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal ExtraBigChildPrice { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal ExtraSmallChildPrice { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal ExtraBabyPrice { get; set; }
    
    public string? CrmCode { get; set; }
    public string? PmsCode { get; set; }
    public string? Description { get; set; }
    
    public bool CloseInB2C { get; set; }
    public bool IsPassive { get; set; }
    public bool DisableExternalSync { get; set; }
    public bool SkipOnDailyPrices { get; set; }
}
