using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models
{
    public class Folio
    {
        public int Id { get; set; }
        public string FolioNumber { get; set; } = string.Empty; // FOL-2024-0001
        
        public int ReservationId { get; set; }
        [ForeignKey("ReservationId")]
        public Reservation? Reservation { get; set; }

        public decimal TotalDebit { get; set; }  // Borç (Harcamalar)
        public decimal TotalCredit { get; set; } // Alacak (Ödemeler)
        
        public decimal Balance => TotalDebit - TotalCredit;
        
        public bool IsClosed { get; set; }
    }
}
