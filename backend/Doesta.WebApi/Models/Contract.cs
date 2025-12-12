using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Doesta.WebApi.Models;

public class Contract
{
    public int Id { get; set; }
    
    public int AgencyId { get; set; }
    [JsonIgnore]
    public Agency? Agency { get; set; }
    
    // Core Contract Info
    public string Code { get; set; } = string.Empty; // Kontrat Kodu / Fiyat Kodu
    public string Name { get; set; } // Description/Name
    
    // Tab: Detaylar (Details)
    public string? PriceType { get; set; } // Fiyat Tipi (Non-Refundable, etc)
    public string? BoardType { get; set; } // Pan Tipi (BB, etc)
    public string? RoomType { get; set; } // Oda Tipi (Std, etc)
    public string? Market { get; set; } // Market
    public string? Nationality { get; set; } // Uyruk
    public string? Currency { get; set; } // Döviz (TRY, EUR)

    public DateTime ContractStartDate { get; set; } // Kontrat Baş
    public DateTime ContractEndDate { get; set; } // Kontrat Bitiş
    public DateTime SalesStartDate { get; set; } // Satış Baş
    public DateTime SalesEndDate { get; set; } // Satış Bitiş
    
    public decimal? MaxCommission { get; set; } // Max. Komisyon
    public bool IncludeCommission { get; set; } // Komisyon Dahil
    public bool IsPassive { get; set; } // Pasif
    public bool IsApproved { get; set; } // Onaylanan
    
    // Pricing Rules (Simplified for now, screenshot shows child pricing matrix)
    public string? PricingPolicy { get; set; } // Manual JSON or relation for complex Child/Extra bed rules

    public ICollection<ContractPeriod> Periods { get; set; } = new List<ContractPeriod>();
}
