using System.ComponentModel.DataAnnotations;

namespace Doesta.WebApi.Models;

public class Definition
{
    public int Id { get; set; }
    
    [Required]
    public string Type { get; set; } // e.g., "RoomType", "BoardType", "PaymentMethod"
    
    [Required]
    public string Name { get; set; }
    
    public string? Code { get; set; }
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
