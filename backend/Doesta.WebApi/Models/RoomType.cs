using System.ComponentModel.DataAnnotations;

namespace Doesta.WebApi.Models;

public class RoomType
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Code { get; set; } = string.Empty; // e.g., STD, DLX
    
    public string? Group { get; set; } // e.g., Main Building

    public int Count { get; set; } = 0; // Total rooms of this type
    
    // Pricing Factors
    public decimal SngFactor { get; set; } = 1.00m;
    public decimal DblFactor { get; set; } = 1.00m;
    public decimal TrpFactor { get; set; } = 1.00m;
    public decimal QuadFactor { get; set; } = 1.00m;
    public decimal ExtraBedCoef { get; set; } = 0.00m;
    
    public int MaxBed { get; set; } = 2;
    public decimal WorkLoad { get; set; } = 1.0m; // Housekeeping workload score

    public bool IsDeleted { get; set; } = false;
    public bool IsPassive { get; set; } = false;
}
