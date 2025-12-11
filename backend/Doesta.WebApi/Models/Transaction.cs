using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        
        public int? FolioId { get; set; }
        [ForeignKey("FolioId")]
        public Folio? Folio { get; set; }
        
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Description { get; set; } = string.Empty;
        
        public decimal Amount { get; set; }
        
        public string Type { get; set; } = "Service"; // Service, Payment, Refund
        public string Category { get; set; } = "Accommodation"; // Accommodation, F&B, Extra, Payment
        
        public string? ProcessedBy { get; set; }
    }
}
