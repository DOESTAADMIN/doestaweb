using System;

namespace Doesta.WebApi.Models;

public class ReservationLog
{
    public int Id { get; set; }
    public int? ReservationId { get; set; }
    public string Module { get; set; } = "System"; // Reservation, User, System, Report
    public string Action { get; set; } = string.Empty; // Create, Update, CheckIn, CheckOut, Cancel
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string User { get; set; } = "System"; // Username
}
