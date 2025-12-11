namespace Doesta.WebApi.Models;

public class Room
{
    public int Id { get; set; }
    public string Number { get; set; } = string.Empty;
    public string Status { get; set; } = "Clean";
    public string Type { get; set; } = "Standart"; // e.g. Standart, Deluxe
    public string BedType { get; set; } = "";
    public string Floor { get; set; } = "";
    public string Location { get; set; } = "";
    public string View { get; set; } = "";
    public string Description { get; set; } = "";
    
    public bool IsDeleted { get; set; }
    public bool IsPassive { get; set; }
    
    // Additional Details
    public string KeyNo { get; set; } = "";
    public string ConnectedRooms { get; set; } = "";
    public string Features { get; set; } = "";
    public string PhoneNo { get; set; } = "";
    public string PaidTv { get; set; } = "";
    public string Key { get; set; } = "";
    public string Internet { get; set; } = "";
    public string AcNo { get; set; } = "";
    
    public decimal Price { get; set; }
    public int Capacity { get; set; } = 2;
    public bool IsOccupied { get; set; } = false;
}
