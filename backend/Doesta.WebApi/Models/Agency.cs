using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models
{
    public class Agency
    {
        public int Id { get; set; }

        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? FullName { get; set; }

        public string? AgencyGroup { get; set; } // Acenta Grup

        public string? PriceCode { get; set; } // Fiyat Kodu

        public string? Market { get; set; }
        public string? Segment { get; set; }

        // Contact Info
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? WebAddress { get; set; }
        public string? Address { get; set; }
        public string? InvoiceAddress { get; set; }

        // Accounting Info
        public string? TaxOffice { get; set; }
        public string? TaxNo { get; set; }
        public string? AccountCode { get; set; } // Hesap Kodu

        // Settings / Defaults
        public string? DefaultRoomType { get; set; }
        public string? DefaultBoardType { get; set; }
        public string? Currency { get; set; } = "EUR";
        public string? PaymentType { get; set; } // Krediye Kaldır / Nakit / Kredi Kartı

        // Toggles / Status
        public bool IsActive { get; set; } = true;
        public bool IsBlacklisted { get; set; } = false;
        public string? BlacklistReason { get; set; }
        
        public string? SalesManager { get; set; } // Satış Yetkilisi
        public string? ContactName { get; set; } // Kontak Adı
        public string? Position { get; set; } // Pozisyon
        public string? PortalVendor { get; set; } // Portal Satıcı
        
        public bool IsAgency { get; set; } = true; // Acente mi?
        public bool IsCompany { get; set; } = false; // Firma mı?
        public string? BavelCode { get; set; }

        public string? DefaultNationality { get; set; } // Varsayılan Uyruk
        public string? Source { get; set; } // Kaynak
        public string? Payer { get; set; } // Odeyen
        public string? AccommodationType { get; set; } // Konaklama Tipi
        public string? DefaultBlock { get; set; } // Varsayılan Blok
        public string? TaxAccount { get; set; } // Vergi Basılacak Hesap

        // Child Free Toggles
        public bool Child1Free { get; set; } = false;
        public bool Child2Free { get; set; } = false;
        public bool Child3Free { get; set; } = false;

        // --- ACCOUNTING TAB FIELDS ---
        public string? TaxContactPerson { get; set; } // Vergi Kontak Kişi
        public string? TaxContactEmail { get; set; } // Vergi Kontak E-Mail
        public string? CancellationPolicy { get; set; } // İptal Politikası
        public string? PaymentPolicy { get; set; } // Ödeme Politikası
        public string? FreeStayPolicy { get; set; } // Ücretsiz Konaklama Politikası
        public string? PONumber { get; set; } // PO Numarası
        public int? InvoiceFrequencyDays { get; set; } // Fatura Sıklık Günleri
        public int? InvoicePaymentDay { get; set; } // Fatura Ödeme Günü

        // Credit Limit Control
        public bool CityLedgerActive { get; set; } = false; // City Ledger Aktif
        public decimal? CreditLimit { get; set; } // Krediye Kaldırma Limiti
        public decimal? TotalRiskLimit { get; set; } // Toplam Risk Limiti
        public decimal? UpperRiskLimit { get; set; } // Üst Risk Limiti
        
        // Account Control
        public bool OpenAccountCard { get; set; } = false; // Hesap Kartı Aç
        public string? PrepaymentAccount { get; set; } // Ön Ödeme Hesabı
        public string? DirectedAccountId { get; set; } // Yönlendirilen HesapID
        public string? GlAccountId { get; set; } // GL Hesap ID
        
        public decimal? CommissionRate { get; set; } // Kanal Komisyon Oranı
        public bool ManualPriceActive { get; set; } = false; // Manuel Fiyat Etkin (Used in Initializer)

        // Navigation Properties for Tabs
        public ICollection<AgencyStopSell> StopSells { get; set; } = new List<AgencyStopSell>();
        public ICollection<AgencyQuota> Quotas { get; set; } = new List<AgencyQuota>();
        public ICollection<AgencyDiscount> Discounts { get; set; } = new List<AgencyDiscount>();
        public ICollection<AgencyOfficial> Officials { get; set; } = new List<AgencyOfficial>();
        public ICollection<AgencyFolioRouting> FolioRoutings { get; set; } = new List<AgencyFolioRouting>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
