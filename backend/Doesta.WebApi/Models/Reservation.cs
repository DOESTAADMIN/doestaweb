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
    public Room? Room { get; set; } // Navigation Property
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    
    // Details
    // public string Agency { get; set; } = "ONLINE"; // Removed duplicate
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

    public int? AgencyId { get; set; }
    public Agency? Agency { get; set; }

    public int? GroupBookingId { get; set; }
    [System.Text.Json.Serialization.JsonIgnore] // Added namespace for JsonIgnore
    public GroupBooking? GroupBooking { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Additional Fields for UI Parity
    public string SaleType { get; set; } = "Sold"; // Sold, Comp, HouseUse
    public string Payer { get; set; } = ""; // Individual, Company Name, etc.
    public string BedType { get; set; } = ""; // King, Twin, French
    public string TrackingCode { get; set; } = ""; // Custom tracking info

    // --- PRICING TAB ---
    public string ContractType { get; set; } = "WALKIN";
    public string PriceType { get; set; } = "Refundable";
    public bool ManualPriceActive { get; set; } = false;
    public decimal ExchangeRate { get; set; } = 1.0m;
    public DateTime? ExchangeDate { get; set; }
    
    // Valid values: "No", "Yes"
    public string ApplyTax { get; set; } = "No"; 
    
    // Valid values: "Included", "Excluded"
    public string TaxIncluded { get; set; } = "Included";
    
    public string TaxAccount { get; set; } = "";
    
    public bool DiscountActive { get; set; } = false;
    // Store as JSON or simple string for now if complex
    public string DiscountType { get; set; } = ""; // Manual, Skipped
    
    // --- OTHER TAB (Invoice & Real Ops) ---
    public DateTime? RealCheckInDate { get; set; }
    public DateTime? RealCheckOutDate { get; set; }
    public DateTime? QTime { get; set; } // Queue Time
    
    public string InvoiceTitle { get; set; } = "";
    public string TaxOffice { get; set; } = "";
    public string TaxNumber { get; set; } = "";
    public string InvoiceAddress { get; set; } = "";
    public string InvoiceTaxType { get; set; } = "";
    
    // --- NAVIGATIONS ---
    public ICollection<ReservationNote> Notes { get; set; } = new List<ReservationNote>();
    public ICollection<ReservationRequest> Requests { get; set; } = new List<ReservationRequest>();
}
