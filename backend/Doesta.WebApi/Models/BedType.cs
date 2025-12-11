using System.ComponentModel.DataAnnotations;

namespace Doesta.WebApi.Models;

public class BedType
{
    public int Id { get; set; }
    
    [Required]
    public string SystemBedType { get; set; } = "Twin"; // Twin, French, King
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public bool IsDisabled { get; set; }
    public bool IsDeleted { get; set; }
}
