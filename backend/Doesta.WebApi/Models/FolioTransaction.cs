namespace Doesta.WebApi.Models;

public class FolioTransaction
{
    public int Id { get; set; }

    public int ReservationId { get; set; }
    public Reservation? Reservation { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Description { get; set; } = string.Empty;
    
    // Department / Category (e.g., Room Revenue, Cash Payment, Minibar)
    public string DepartmentCode { get; set; } = "MISC"; 
    
    // Financials
    public decimal Debit { get; set; } = 0; // Borç (Room Fee, Extra)
    public decimal Credit { get; set; } = 0; // Alacak (Payment)
    public string Currency { get; set; } = "EUR";
    
    public string CreatedBy { get; set; } = "System"; // User who posted it
    public bool IsSystemPosting { get; set; } = false; // e.g., Automatic Night Audit posting
}
