using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Doesta.WebApi.Models;

public class Currency
{
    [Key]
    public string Code { get; set; } = string.Empty; // TRY, USD
    
    public string Description { get; set; } = string.Empty;
    
    public bool CloseInB2C { get; set; }
    
    [Precision(18, 4)]
    public decimal Rate { get; set; } // Exchange rate relative to base currency
}
