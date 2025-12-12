using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class RoomDailyRate
{
    public int Id { get; set; }
    
    public DateTime Date { get; set; }
    
    public int RoomTypeId { get; set; }
    // public RoomType RoomType { get; set; } // Optional Nav prop
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    public bool StopSell { get; set; }
    public bool ClosedToArrival { get; set; }
    public bool ClosedToDeparture { get; set; }
    
    public int MinStay { get; set; } = 1;
}
