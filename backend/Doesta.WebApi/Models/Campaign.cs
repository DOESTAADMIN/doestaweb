using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class Campaign
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    public double DiscountPercentage { get; set; }
    
    public string? Code { get; set; } // "EARLYBIRD"
    public bool IsActive { get; set; } = true;
}
