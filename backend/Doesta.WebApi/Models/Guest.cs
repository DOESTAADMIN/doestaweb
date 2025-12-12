using System.ComponentModel.DataAnnotations;

namespace Doesta.WebApi.Models
{
    public class Guest
    {
        public int Id { get; set; }

        public string? Title { get; set; } // Unvan

        [Required]
        public string FirstName { get; set; } = string.Empty;

        public string? MiddleName { get; set; }

        [Required]
        public string LastName { get; set; } = string.Empty;

        public string? Gender { get; set; } // M/F

        public string? IdentificationNumber { get; set; } // TC No
        public DateTime? IdValidDate { get; set; }
        public DateTime? IdIssueDate { get; set; }

        public string? PassportNo { get; set; }
        public DateTime? PassportValidDate { get; set; }
        public DateTime? PassportIssueDate { get; set; }

        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        
        public DateTime? BirthDate { get; set; }
        public string? BirthPlace { get; set; }
        public string? Nationality { get; set; }
        
        public string? CarPlate { get; set; }

        public bool IsVip { get; set; }
        public bool IsBlacklist { get; set; }

        public bool KvkkConsent { get; set; }
        public bool PhoneContactConsent { get; set; }
        public bool EmailContactConsent { get; set; }

        public string? Notes { get; set; }
    }
}
