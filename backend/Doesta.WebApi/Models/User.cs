using System;

namespace Doesta.WebApi.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; // SHA256 Hash
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "User"; // Admin, User, Manager
    public string PinCode { get; set; } = string.Empty; // For quick access
    public bool IsActive { get; set; } = true;
    public string Permissions { get; set; } = "{}"; // JSON string of permissions
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
