namespace Doesta.WebApi.Models;

public class Reservation
{
    public int Id { get; set; }
    
    // Links to expanded details
    public ICollection<ReservationGuest> Guests { get; set; } = new List<ReservationGuest>();
    public ICollection<ReservationDailyPrice> DailyPrices { get; set; } = new List<ReservationDailyPrice>();
    public ICollection<FolioTransaction> FolioTransactions { get; set; } = new List<FolioTransaction>();

    // Basic Header Info
    public int RoomId { get; set; } // FK to Room
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    
    // Details
    public string Agency { get; set; } = "ONLINE";
    public string VoucherNo { get; set; } = string.Empty;
    public string BoardType { get; set; } = "BB"; // BB, HB, FB, AI
    public int AdultCount { get; set; } = 1;
    public int ChildCount { get; set; } = 0;
    public int BabyCount { get; set; } = 0;
    public string RoomType { get; set; } = "STD";
    
    public string Status { get; set; } = "Confirmed"; // Confirmed, CheckedIn, CheckedOut, Cancelled, NoShow
    public decimal TotalPrice { get; set; }
    public string Currency { get; set; } = "EUR";
    public bool IsPaid { get; set; } = false;
    public decimal PaidAmount { get; set; } = 0;
    public string Note { get; set; } = string.Empty;

    // Contact/Profile Link (Optional - Main Profile in CRM)
    public int? GuestId { get; set; }
    public Guest? Guest { get; set; }
    public string GuestName { get; set; } = string.Empty; // For quick display in lists

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Additional Fields for UI Parity
    public string SaleType { get; set; } = "Sold"; // Sold, Comp, HouseUse
    public string Payer { get; set; } = ""; // Individual, Company Name, etc.
    public string BedType { get; set; } = ""; // King, Twin, French
    public string TrackingCode { get; set; } = ""; // Custom tracking info
}
