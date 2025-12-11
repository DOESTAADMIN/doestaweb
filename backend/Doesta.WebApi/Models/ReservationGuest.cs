namespace Doesta.WebApi.Models;

public class ReservationGuest
{
    public int Id { get; set; }
    
    // Link to main reservation
    public int ReservationId { get; set; }
    public Reservation? Reservation { get; set; }
    
    // Guest Details (Snapshot for this reservation)
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PassportNo { get; set; } = string.Empty;
    public string IdNumber { get; set; } = string.Empty; // TCKN or ID
    public string Nationality { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    
    // Status in room
    public bool IsMainGuest { get; set; } = false; // The primary guest for this room
}
