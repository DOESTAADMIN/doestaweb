using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class PosOrder
{
    public int Id { get; set; }
    
    public DateTime OrderDate { get; set; } = DateTime.Now;
    
    public int? TableId { get; set; }
    public PosTable? Table { get; set; }
    
    public string Status { get; set; } = "Open"; // "Open", "Paid", "Cancelled", "Merged"
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }
    
    // Link to Room/Folio (Charge to Room)
    public int? RoomId { get; set; }
    public int? FolioId { get; set; }
    
    public List<PosOrderItem> Items { get; set; } = new();
}
