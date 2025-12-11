using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class Agency
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    public string Type { get; set; } = "Travel Agency"; // "Travel Agency", "Corporate", "OTA"
    
    public string? Code { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    
    public double CommissionRate { get; set; } = 0.0;
    
    // Link to Accounting
    public int? AccountId { get; set; }
    public Account? Account { get; set; }
}
