using System.ComponentModel.DataAnnotations;

namespace Doesta.WebApi.Models;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    public string? Type { get; set; } // "Product", "Service", "Expense"
    public int? ParentId { get; set; }
    public Category? Parent { get; set; }
}
