namespace Doesta.WebApi.Models;

public class ReservationDailyPrice
{
    public int Id { get; set; }

    public int ReservationId { get; set; }
    public Reservation? Reservation { get; set; }

    public DateTime Date { get; set; }
    
    // Price details
    public decimal Price { get; set; }
    public string Currency { get; set; } = "EUR";
    
    // Breakdown (Optional for analytics)
    public string RateCode { get; set; } = "BAR"; // e.g., BAR, COR, PROMO
    public string RoomType { get; set; } = "STD";
    public string BoardType { get; set; } = "BB";
    
    public bool IsManualPrice { get; set; } = false; // If changed manually by user
}
