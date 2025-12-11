using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Doesta.WebApi.Models;

public class Contract
{
    public int Id { get; set; }
    
    public int AgencyId { get; set; }
    public Agency Agency { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    public string Name { get; set; } // "Summer 2025"
    public string Status { get; set; } = "Active"; // "Active", "Pending", "Expired"
}
