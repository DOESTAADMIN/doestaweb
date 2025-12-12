using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models
{
    public class AgencyStopSell
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        [JsonIgnore]
        public Agency? Agency { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        public string? RoomType { get; set; }
        public string? BoardType { get; set; }
        public string? PriceType { get; set; }
        public string? Market { get; set; }
        public string? ChannelPriceType { get; set; } // Kanal Fiyat Tipi
        public bool AllChannels { get; set; } = false; // Tüm Kanallar

        public bool IsActive { get; set; } = true;
    }



    // Updated per new screenshot requirements
    public class AgencyQuota
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        [JsonIgnore]
        public Agency? Agency { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        public string? RoomType { get; set; }
        public int Guarantee { get; set; } // Kontrat
        public int Quota { get; set; } // Kontrat ve Fiyat
        
        // Detailed Quota Fields from Screenshot
        public bool IsConsumed { get; set; } = false; // Tükendi
        public DateTime? ConsumptionDate { get; set; } // Tükenme Tarihi
        public string? QuotaNo { get; set; } // Kota No
        public int Multiplier { get; set; } = 1; // Çarpan
        
        public int AgencySold { get; set; } // Acente Satılan
        public int AgencyRemaining { get; set; } // Acente Kalan
        public bool UseAgencyTotal { get; set; } = false; // Acente Total Kullanabilir
        
        public int IndividualQuota { get; set; } // Münferit Kota
        public int IndividualSold { get; set; } // Münferit Satılan
        public int IndividualRemaining { get; set; } // Münferit Kalan
        public bool UseIndividualTotal { get; set; } = true; // Münferit Total Kullanabilir
    }

    // Updated per new screenshot requirements
    public class AgencyOfficial
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        [JsonIgnore]
        public Agency? Agency { get; set; }

        public string FullName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        
        public string? Phone1 { get; set; }
        public string? Phone2 { get; set; }
        public string? Gsm { get; set; }
        public string? Fax { get; set; }
        public string? Email { get; set; }
        public string? Web { get; set; }
        
        public string? Experience { get; set; } // Deneyim
        public string? Position { get; set; }
        public string? Graduation { get; set; } // Mezuniyet
        public decimal? CommissionRate { get; set; } // Prim %
        public string? UserCode { get; set; } // Kullanıcı Kodu
        public bool IsActive { get; set; } = true;
        public string? DecisionPower { get; set; } // Karar Gücü
        public string? PhotoUrl { get; set; }
    }
    public class AgencyDiscount
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        [JsonIgnore]
        public Agency? Agency { get; set; }

        public string Code { get; set; } = string.Empty;
        public string? PriceCode { get; set; }
        
        public decimal DiscountValue { get; set; }
        public string DiscountType { get; set; } = "Percentage"; // Percentage or Amount
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class AgencyFolioRouting
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        [JsonIgnore]
        public Agency? Agency { get; set; }

        public string? DepartmentName { get; set; } // Departman Adı
        public string? RevenueGroup { get; set; } // Gelir Grubu
        public string? TargetRoomNumber { get; set; } // Yönlendirilecek Oda No
        public DateTime StartDate { get; set; } // Başlangıç Tarihi
        public DateTime EndDate { get; set; } // Bitiş Tarihi
    }
}
