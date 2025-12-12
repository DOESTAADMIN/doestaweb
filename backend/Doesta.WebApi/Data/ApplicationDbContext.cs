using Microsoft.EntityFrameworkCore;
using Doesta.WebApi.Models;

namespace Doesta.WebApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Room> Rooms { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<ReservationGuest> ReservationGuests { get; set; }
    public DbSet<ReservationDailyPrice> ReservationDailyPrices { get; set; }
    public DbSet<FolioTransaction> FolioTransactions { get; set; }
    public DbSet<ReservationNote> ReservationNotes { get; set; }
    public DbSet<ReservationRequest> ReservationRequests { get; set; }
    public DbSet<ReservationLog> ReservationLogs { get; set; }
    public DbSet<User> Users { get; set; }
        
    // Add other DbSets as needed for future modules
    public DbSet<Guest> Guests { get; set; }
    public DbSet<Definition> Definitions { get; set; }
    
    // Settings & Financials
    public DbSet<BedType> BedTypes { get; set; }
    public DbSet<RevenueGroup> RevenueGroups { get; set; }
    public DbSet<Currency> Currencies { get; set; }
    public DbSet<BoardType> BoardTypes { get; set; }
    public DbSet<PriceType> PriceTypes { get; set; }
    public DbSet<RoomType> RoomTypes { get; set; }
    
    // POS & Products
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<PosTable> PosTables { get; set; }
    public DbSet<PosOrder> PosOrders { get; set; }
    public DbSet<PosOrderItem> PosOrderItems { get; set; }
    
    // Accounting
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<InvoiceItem> InvoiceItems { get; set; }
    
    // Stock
    public DbSet<Warehouse> Warehouses { get; set; }
    public DbSet<StockInventory> StockInventories { get; set; }
    public DbSet<StockTransaction> StockTransactions { get; set; }
    
    // Sales & Marketing
        public DbSet<Agency> Agencies { get; set; }
        public DbSet<AgencyStopSell> AgencyStopSells { get; set; }
        public DbSet<AgencyQuota> AgencyQuotas { get; set; }
        public DbSet<AgencyDiscount> AgencyDiscounts { get; set; }
        public DbSet<AgencyOfficial> AgencyOfficials { get; set; }
        public DbSet<AgencyFolioRouting> AgencyFolioRoutings { get; set; }

    public DbSet<RoomDailyRate> RoomDailyRates { get; set; }
    public DbSet<Contract> Contracts { get; set; }
    public DbSet<ContractPeriod> ContractPeriods { get; set; }
    public DbSet<ContractPrice> ContractPrices { get; set; }
    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<Rate> Rates { get; set; }
    public DbSet<GroupBooking> GroupBookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Seed data or configuration can go here
        modelBuilder.Entity<Room>().Property(r => r.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Reservation>().Property(r => r.TotalPrice).HasColumnType("decimal(18,2)");
        
        // Folio precision
        modelBuilder.Entity<FolioTransaction>().Property(f => f.Debit).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<FolioTransaction>().Property(f => f.Credit).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<ReservationDailyPrice>().Property(p => p.Price).HasColumnType("decimal(18,2)");
        
        // Room Types
        modelBuilder.Entity<RoomType>().Property(r => r.SngFactor).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<RoomType>().Property(r => r.DblFactor).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<RoomType>().Property(r => r.TrpFactor).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<RoomType>().Property(r => r.QuadFactor).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<RoomType>().Property(r => r.ExtraBedCoef).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<RoomType>().Property(r => r.WorkLoad).HasColumnType("decimal(18,2)");
    }
}
