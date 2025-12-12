namespace Doesta.WebApi.Models;

public class ReservationNote
{
    public int Id { get; set; }
    public int ReservationId { get; set; }
    public Reservation? Reservation { get; set; }
    
    public string Message { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = "System";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
