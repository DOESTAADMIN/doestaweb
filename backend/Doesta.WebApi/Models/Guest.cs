using System.ComponentModel.DataAnnotations;

namespace Doesta.WebApi.Models
{
    public class Guest
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        public string? IdentificationNumber { get; set; } // TC or Passport

        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        
        public string? Address { get; set; }
        
        public DateTime? BirthDate { get; set; }
        public string? Nationality { get; set; }
        
        public bool IsVip { get; set; }
        public string? Notes { get; set; }
    }
}
