using System.ComponentModel.DataAnnotations;

namespace Doesta.WebApi.Models;

public class Warehouse
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    public string Type { get; set; } = "Main"; // "Main", "Kitchen", "Bar", "Housekeeping"
    
    public bool IsActive { get; set; } = true;
}
