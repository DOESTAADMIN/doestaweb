namespace Doesta.WebApi.Models;

public class AnalyticsMetric
{
    public string Label { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Count { get; set; } // e.g. Number of Reservations or Room Nights
    public decimal ADR { get; set; } // Average Daily Rate
    public decimal Percentage { get; set; }
}

public class DistributionAnalyticsData
{
    public List<AnalyticsMetric> Metrics { get; set; } = new();
    public decimal TotalRevenue { get; set; }
    public int TotalReservations { get; set; }
}
