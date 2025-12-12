namespace Doesta.WebApi.Models;

/// <summary>
/// DTO for Room Plan view - combines Room data with current reservation/guest information
/// </summary>
public class RoomPlanDto
{
    public int Id { get; set; }
    public string Number { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string BedType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Clean, Dirty, etc.
    public string Floor { get; set; } = string.Empty;
    public string View { get; set; } = string.Empty;
    
    // Occupancy Information
    public bool IsOccupied { get; set; }
    public string? GuestName { get; set; }
    public int? Pax { get; set; } // Total guest count (adults + children)
    public DateTime? CheckInDate { get; set; }
    public DateTime? CheckOutDate { get; set; }
    public int? ReservationId { get; set; }
    public string? ReservationStatus { get; set; }
    
    // Additional flags
    public bool IsDirty { get; set; }
    public bool IsDeleted { get; set; }
    public bool IsPassive { get; set; }
}
