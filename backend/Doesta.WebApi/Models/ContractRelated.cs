using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Doesta.WebApi.Models
{
    public class ContractPeriod
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        [JsonIgnore]
        public Contract? Contract { get; set; }

        public string Name { get; set; } = string.Empty; // e.g., "Winter Period"
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public ICollection<ContractPrice> Prices { get; set; } = new List<ContractPrice>();
    }

    public class ContractPrice
    {
        public int Id { get; set; }
        public int ContractPeriodId { get; set; }
        [JsonIgnore]
        public ContractPeriod? ContractPeriod { get; set; }

        public string? RoomType { get; set; } // Oda Tipi
        public string? BoardType { get; set; } // Pansiyon Tipi
        public string? PriceType { get; set; } // Fiyat Tipi (Non-Ref, etc.)
        
        // Adult Prices
        [Column(TypeName = "decimal(18,2)")]
        public decimal SinglePrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DoublePrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TriplePrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal QuadPrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal ExtraBedPrice { get; set; }

        // Child Prices (mapping to screenshot ranges: 0-1.99, 2-5.99, 6-11.99)
        [Column(TypeName = "decimal(18,2)")]
        public decimal BabyPrice { get; set; } // 0-1.99
        [Column(TypeName = "decimal(18,2)")]
        public decimal ChildPrice { get; set; } // 2-5.99
        [Column(TypeName = "decimal(18,2)")]
        public decimal TeenPrice { get; set; } // 6-11.99
        
        // Single Parent / Companion Prices if needed (Screenshot has map colums like Bbk(sng))
        [Column(TypeName = "decimal(18,2)")]
        public decimal BabySngPrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal ChildSngPrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TeenSngPrice { get; set; }
    }
}
