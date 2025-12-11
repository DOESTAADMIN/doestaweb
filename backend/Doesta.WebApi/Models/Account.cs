using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class Account
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } // Company or Person Name
    
    public string? Code { get; set; } // 120.01.001
    
    public string Type { get; set; } = "Customer"; // "Customer", "Vendor", "Bank", "Cash", "Expense"
    
    public string? TaxOffice { get; set; }
    public string? TaxNumber { get; set; }
    
    public string? Phone { get; set; }
    public string? Address { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Balance { get; set; } = 0;
}
