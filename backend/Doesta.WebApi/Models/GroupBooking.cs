using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Doesta.WebApi.Models
{
    public class GroupBooking
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // GroupName / Project Name
        
        public int? AgencyId { get; set; }
        public Agency? Agency { get; set; }

        public string Status { get; set; } = "Definite"; // Definite, Tentative, Pending, Cancelled
        public string? LeaderName { get; set; }
        public string? Note { get; set; }
        
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
