namespace Doesta.WebApi.Models;

public class ReservationRequest
{
    public int Id { get; set; }
    public int ReservationId { get; set; }
    public Reservation? Reservation { get; set; }
    
    public string Type { get; set; } = "Request"; // Request, Complaint, Task
    public string Status { get; set; } = "New"; // New, InProcess, Completed, Cancelled
    public string Department { get; set; } = "F.O"; // Front Office, Housekeeping, etc.
    public string? SubDepartment { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    
    // New Fields
    public string? Priority { get; set; } = "Normal"; // Normal, High, Urgent
    public string? AssignedTo { get; set; } // The person who is assigned the task
    public string? Device { get; set; }
    public string? Area { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpectedEndDate { get; set; }
    public DateTime? ActualEndDate { get; set; }
    public DateTime? StartedAt { get; set; }
    
    public string CreatedBy { get; set; } = "System";
    public string? Notes { get; set; } // Optional closing notes
    public int? GuestRating { get; set; }
}
