using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class Invoice
{
    public int Id { get; set; }
    
    [Required]
    public string InvoiceNumber { get; set; }
    
    public DateTime Date { get; set; } = DateTime.Now;
    public DateTime? DueDate { get; set; }
    
    public int AccountId { get; set; }
    public Account Account { get; set; }
    
    public string Type { get; set; } = "Sales"; // "Sales", "Purchase"
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal SubTotal { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TaxAmount { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }
    
    public string Status { get; set; } = "Draft"; // "Draft", "Sent", "Paid", "Overdue"
    
    public List<InvoiceItem> Items { get; set; } = new();
}
