using Doesta.WebApi.Models;
using Microsoft.EntityFrameworkCore;

namespace Doesta.WebApi.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // FORCE RESET FOR DEMO - Remove in production
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // --- Currencies ---
            if (!context.Currencies.Any())
            {
                var currencies = new Currency[]
                {
                    new Currency { Code = "TRY", Description = "Türk Lirası", CloseInB2C = false, Rate = 1.0000m },
                    new Currency { Code = "USD", Description = "US Dollar", CloseInB2C = false, Rate = 34.50m },
                    new Currency { Code = "EUR", Description = "Euro", CloseInB2C = false, Rate = 37.20m },
                    new Currency { Code = "GBP", Description = "British Pound", CloseInB2C = false, Rate = 43.80m },
                };
                context.Currencies.AddRange(currencies);
                context.SaveChanges();
            }

            // --- Revenue Groups ---
            if (!context.RevenueGroups.Any())
            {
                var revenueGroups = new RevenueGroup[]
                {
                    new RevenueGroup { Code = "KONAKLAMA", Name = "Konaklama Geliri", Type = "Konaklama", Vat1 = 10 },
                    new RevenueGroup { Code = "KAHVALTI", Name = "Kahvaltı Geliri", Type = "Yiyecek", Vat1 = 10 },
                    new RevenueGroup { Code = "YEMEK", Name = "Yemek Geliri", Type = "Yiyecek", Vat1 = 20 },
                    new RevenueGroup { Code = "ICECEK", Name = "İçecek Geliri", Type = "İçecek", Vat1 = 20 },
                    new RevenueGroup { Code = "SPA", Name = "Spa & Wellness", Type = "Diğer", Vat1 = 20 },
                    new RevenueGroup { Code = "TRANSFER", Name = "Transfer", Type = "Diğer", Vat1 = 20 },
                    new RevenueGroup { Code = "TELEFON", Name = "Telefon", Type = "Diğer", Vat1 = 20 },
                };
                context.RevenueGroups.AddRange(revenueGroups);
                context.SaveChanges();
            }

            // --- Bed Types ---
             if (!context.BedTypes.Any())
            {
                var bedTypes = new BedType[]
                {
                    new BedType { SystemBedType = "SGL", Name = "Tek Kişilik" },
                    new BedType { SystemBedType = "DBL", Name = "Çift Kişilik" },
                    new BedType { SystemBedType = "TWN", Name = "İki Yataklı" },
                    new BedType { SystemBedType = "KNG", Name = "King Size" },
                    new BedType { SystemBedType = "FR", Name = "French Bed" },
                };
                context.BedTypes.AddRange(bedTypes);
                context.SaveChanges();
            }

            // --- Board Types ---
            if (!context.BoardTypes.Any())
            {
                var boardTypes = new List<BoardType>
                {
                    new BoardType { Code = "RO", Name = "Sadece Oda", SystemCode = "RO", ExtraAdultPrice = 0, ExtraBigChildPrice = 0, ExtraSmallChildPrice = 0 },
                    new BoardType { Code = "BB", Name = "Oda Kahvaltı", SystemCode = "BB", ExtraAdultPrice = 15, ExtraBigChildPrice = 7, ExtraSmallChildPrice = 0 },
                    new BoardType { Code = "HB", Name = "Yarım Pansiyon", SystemCode = "HB", ExtraAdultPrice = 35, ExtraBigChildPrice = 17, ExtraSmallChildPrice = 10 },
                    new BoardType { Code = "FB", Name = "Tam Pansiyon", SystemCode = "FB", ExtraAdultPrice = 55, ExtraBigChildPrice = 27, ExtraSmallChildPrice = 15 },
                    new BoardType { Code = "AI", Name = "Her Şey Dahil", SystemCode = "AI", ExtraAdultPrice = 75, ExtraBigChildPrice = 37, ExtraSmallChildPrice = 20 },
                };
                context.BoardTypes.AddRange(boardTypes);
                context.SaveChanges();
            }

             // --- Price Types ---
            if (!context.PriceTypes.Any())
            {
                var priceTypes = new List<PriceType>
                {
                    new PriceType { Code = "NR", IsRefundable = false, PrepayRatio = 100, PriceFactor = 0.90m, MinStay = 1, MaxStay = 30 },
                    new PriceType { Code = "BAR", IsRefundable = true, PrepayRatio = 0, PriceFactor = 1.00m, MinStay = 1, MaxStay = 30 },
                    new PriceType { Code = "CORP", IsRefundable = true, PrepayRatio = 0, PriceFactor = 0.90m, MinStay = 1, MaxStay = 365 },
                    new PriceType { Code = "AGENCY", IsRefundable = false, PrepayRatio = 100, PriceFactor = 0.80m, MinStay = 1, MaxStay = 365 },
                };
                context.PriceTypes.AddRange(priceTypes);
                context.SaveChanges();
            }

            // --- Room Types ---
            var standardRoom = new RoomType { Name = "Standart Oda", Code = "STD", Group = "Ana Bina", Count = 40, MaxBed = 3, SngFactor=0.9m, DblFactor=1.0m, TrpFactor=1.3m };
            var deluxeRoom = new RoomType { Name = "Deluxe Oda", Code = "DLX", Group = "Ana Bina", Count = 20, MaxBed = 3, SngFactor=0.9m, DblFactor=1.2m, TrpFactor=1.5m };
            var familyRoom = new RoomType { Name = "Aile Odası", Code = "FAM", Group = "Ana Bina", Count = 10, MaxBed = 5, SngFactor=1.5m, DblFactor=1.5m, TrpFactor=1.8m };
            var suiteRoom = new RoomType { Name = "King Suite", Code = "SUI", Group = "VIP", Count = 5, MaxBed = 4, SngFactor=2.0m, DblFactor=2.0m, TrpFactor=2.5m };
            
            if (!context.RoomTypes.Any())
            {
                 context.RoomTypes.AddRange(standardRoom, deluxeRoom, familyRoom, suiteRoom);
                 context.SaveChanges();
            }

            // --- Rooms Generator ---
            if (!context.Rooms.Any())
            {
                var rooms = new List<Room>();
                
                // Floor 1: Standard
                for (int i = 101; i <= 120; i++)
                {
                    rooms.Add(new Room { Number = i.ToString(), Type = "Standart", Capacity = 2, Price = 100, Status = "Clean", Floor = "1", View = (i % 2 == 0 ? "Garden" : "Street"), IsPassive = false });
                }
                
                // Floor 2: Standard & Family
                for (int i = 201; i <= 215; i++)
                {
                    rooms.Add(new Room { Number = i.ToString(), Type = "Standart", Capacity = 2, Price = 100, Status = "Clean", Floor = "2", View = "Sea", IsPassive = false });
                }
                for (int i = 216; i <= 220; i++)
                {
                    rooms.Add(new Room { Number = i.ToString(), Type = "Aile", Capacity = 4, Price = 180, Status = "Clean", Floor = "2", View = "Garden", IsPassive = false });
                }

                // Floor 3: Deluxe
                for (int i = 301; i <= 315; i++)
                {
                    rooms.Add(new Room { Number = i.ToString(), Type = "Deluxe", Capacity = 3, Price = 150, Status = "Clean", Floor = "3", View = "Sea", IsPassive = false });
                }

                // Floor 4: Suites
                for (int i = 401; i <= 405; i++)
                {
                    rooms.Add(new Room { Number = i.ToString(), Type = "Suite", Capacity = 4, Price = 450, Status = "Clean", Floor = "4", View = "Panoramic", IsPassive = false });
                }

                context.Rooms.AddRange(rooms);
                context.SaveChanges();
            }

            // --- Guests Generator ---
            if (!context.Guests.Any())
            {
                var guests = new List<Guest>();
                var random = new Random();
                
                for(int i = 0; i < 50; i++)
                {
                    guests.Add(new Guest
                    {
                        FirstName = FakerName(random).Split(' ')[0],
                        LastName = FakerName(random).Split(' ')[1],
                        BirthDate = DateTime.Today.AddYears(-random.Next(18, 70)), // Ages 18-70
                        Nationality = random.Next(0, 2) == 0 ? "TR" : (random.Next(0, 2) == 0 ? "DE" : "GB"),
                        PhoneNumber = "555" + random.Next(1000000, 9999999),
                        Email = "guest" + i + "@example.com",
                        IsVip = random.Next(0, 10) == 0 
                    });
                }
                context.Guests.AddRange(guests);
                context.SaveChanges();
            }

            // --- Reservations Generator (Dependent on Rooms & Guests) ---
            var today = DateTime.Today;
            var hasTodayData = context.Reservations.Any(r => r.CheckInDate.Date == today || r.CheckOutDate.Date == today);

            // ALWAYS RE-SEED FOR DEMO if requested or if data is stale
            // Since user asked for "realistic data" and "no empty charts", we force re-seed logic effectively.
            if (!hasTodayData || true) // Force true for now to update data
            {
                // Clean up existing reservations to prevent overlap issues during re-seed
                var oldReservations = context.Reservations.ToList();
                if (oldReservations.Any()) {
                    context.Reservations.RemoveRange(oldReservations);
                    context.SaveChanges();
                }

                var allRooms = context.Rooms.ToList();
                var allGuests = context.Guests.ToList();

                if (allRooms.Any() && allGuests.Any()) 
                {
                    var reservations = new List<Reservation>();
                    var random = new Random();
                    int totalRooms = allRooms.Count;

                    // REALISTIC SCENARIO: High Season (~75% Occupancy)
                    int targetOccupancy = (int)(totalRooms * 0.75); 
                    int occupiedCount = 0;

                    // Shuffle rooms
                    var shuffledRooms = allRooms.OrderBy(x => random.Next()).ToList();
                    
                    // Shuffle guests to pick from
                    var shuffledGuests = allGuests.OrderBy(x => random.Next()).ToQueue(); 

                    // Helper to get next guest
                    Guest GetNextGuest() => shuffledGuests.Count > 0 ? shuffledGuests.Dequeue() : allGuests[random.Next(allGuests.Count)];

                    // 1. REPEATER GUESTS SETUP
                    // Pick 5 guests to be repeaters -> create past reservations for them
                    var repeaterGuests = allGuests.Take(5).ToList();
                    foreach(var repGuest in repeaterGuests)
                    {
                        // Create 2 past reservations for each
                        for(int k=0; k<2; k++)
                        {
                            reservations.Add(new Reservation 
                            {
                                RoomId = allRooms[random.Next(allRooms.Count)].Id,
                                GuestId = repGuest.Id,
                                GuestName = repGuest.FirstName + " " + repGuest.LastName,
                                CheckInDate = today.AddMonths(-(k+1) * 2), // 2 and 4 months ago
                                CheckOutDate = today.AddMonths(-(k+1) * 2).AddDays(5),
                                Status = "CheckedOut",
                                TotalPrice = 1000,
                                CreatedAt = today.AddMonths(-(k+1) * 3) // Old booking
                            });
                        }
                    }

                    foreach(var room in shuffledRooms)
                    {
                        if (occupiedCount >= targetOccupancy) break;

                        // Decide status: In-House, Departure, or Arrival?
                        int roll = random.Next(100);
                        var guest = GetNextGuest(); // Assign real guest

                        if (roll < 60) // 60% chance basic In-House
                        {
                            room.Status = "Dirty"; 
                            room.IsOccupied = true;
                            
                            reservations.Add(new Reservation 
                            {
                                RoomId = room.Id,
                                GuestId = guest.Id,
                                GuestName = guest.FirstName + " " + guest.LastName,
                                CheckInDate = today.AddDays(-random.Next(1, 10)),
                                CheckOutDate = today.AddDays(random.Next(1, 7)),
                                TotalPrice = random.Next(500, 3000),
                                Currency = random.Next(0,2) == 0 ? "EUR" : "USD",
                                Status = "CheckedIn",
                                RoomType = room.Type,
                                BoardType = random.Next(0, 10) < 3 ? "BB" : (random.Next(0, 10) < 6 ? "HB" : "AI"), // Mix boards
                                Agency = occupiedCount % 3 == 0 ? "Booking.com" : "Direct",
                                CreatedAt = today.AddDays(-random.Next(10, 30)),
                                SaleType = "Sold",
                                Payer = "Guest",
                                BedType = room.Type == "Standart" ? "French" : "King",
                                TrackingCode = "-",
                                Guests = new List<ReservationGuest> 
                                { 
                                    new ReservationGuest 
                                    { 
                                        FirstName = guest.FirstName, 
                                        LastName = guest.LastName, 
                                        Nationality = guest.Nationality, 
                                        IsMainGuest = true,
                                        BirthDate = guest.BirthDate,
                                        Phone = guest.PhoneNumber,
                                        Email = guest.Email
                                    } 
                                }
                            });
                            occupiedCount++;
                        }
                        else if (roll < 75) // 15% chance Departure Today
                        {
                            room.Status = "Dirty"; // Checking out
                            room.IsOccupied = true;

                            reservations.Add(new Reservation 
                            {
                                RoomId = room.Id,
                                GuestId = guest.Id,
                                GuestName = guest.FirstName + " " + guest.LastName,
                                CheckInDate = today.AddDays(-random.Next(2, 8)),
                                CheckOutDate = today, // LEAVING TODAY
                                TotalPrice = random.Next(400, 1500),
                                Currency = "EUR",
                                Status = "CheckedIn", 
                                RoomType = room.Type,
                                BoardType = "HB",
                                Agency = "ETS",
                                CreatedAt = today.AddDays(-random.Next(5, 20)),
                                SaleType = "Sold",
                                Payer = "ETS Tur",
                                BedType = "Twin",
                                TrackingCode = "GRP-01"
                            });
                            occupiedCount++;
                        }
                        else if (roll < 90) // 15% chance Arrival Today
                        {
                            room.Status = "Clean"; 
                            room.IsOccupied = false; 

                            // THIS ONE CREATED TODAY? Maybe 50% chance it's a walk-in or last minute
                            bool isLastMinute = random.Next(0, 2) == 0;

                            reservations.Add(new Reservation 
                            {
                                RoomId = room.Id,
                                GuestId = guest.Id,
                                GuestName = guest.FirstName + " " + guest.LastName,
                                CheckInDate = today, // ARRIVING TODAY
                                CheckOutDate = today.AddDays(random.Next(2, 7)),
                                TotalPrice = random.Next(1000, 5000),
                                Currency = "TRY",
                                Status = "Confirmed",
                                RoomType = room.Type,
                                BoardType = "AI",
                                Agency = "Expedia",
                                CreatedAt = isLastMinute ? today : today.AddDays(-10), // Allow "Bookings Made Today" logic
                                SaleType = random.Next(0, 20) == 0 ? "Comp" : "Sold",
                                Payer = "Expedia Collect",
                                BedType = "King",
                                TrackingCode = "-"
                            });
                        }
                    }

                    // 4. FUTURE RESERVATIONS (For Forecast) - ENHANCED FOR NAVIGATION
                    // Generate bookings for the next 90 days to ensure "Next" button shows data
                    // Aim for ~40-60% occupancy in future to look realistic
                    for(int i = 0; i < 300; i++) // Increased from 20 to 300
                    {
                        var room = allRooms[random.Next(allRooms.Count)];
                        var guest = GetNextGuest();
                        
                        int startDayOffset = random.Next(1, 90);
                        int stayDuration = random.Next(2, 10);

                        // Avoid simple overlap logic for demo speed (or let DB/App handle it, but here we just seed blindly)
                        // Ideally we'd check availability, but for a 300 loop on 75 rooms over 90 days, collisions are manageable or ignored for demo stats.
                        
                        bool bookedToday = random.Next(0, 10) == 0; // 10% chance booked today

                        reservations.Add(new Reservation 
                        {
                            RoomId = room.Id,
                            GuestId = guest.Id,
                            GuestName = guest.FirstName + " " + guest.LastName,
                            CheckInDate = today.AddDays(startDayOffset),
                            CheckOutDate = today.AddDays(startDayOffset + stayDuration),
                            TotalPrice = random.Next(600, 2500),
                            Currency = random.Next(0, 2) == 0 ? "EUR" : "USD",
                            Status = "Confirmed",
                            RoomType = room.Type,
                            BoardType = random.Next(0, 5) == 0 ? "AI" : "BB",
                            Agency = random.Next(0, 2) == 0 ? "HotelBeds" : "Expedia",
                            CreatedAt = bookedToday ? today : today.AddDays(-random.Next(1, 60)),
                            SaleType = "Sold",
                            Payer = "Guest",
                            BedType = "French",
                            TrackingCode = "-"
                        });
                    }

                    context.Rooms.UpdateRange(allRooms); 
                    context.Reservations.AddRange(reservations);
                    context.SaveChanges();
                }
            }
        }

        private static string FakerName(Random r)
        {
            var names = new[] { "Ahmet", "Mehmet", "Ayşe", "Fatma", "John", "Sarah", "Michael", "Emma", "Hans", "Muller", "Olga", "Dimitri" };
            var surnames = new[] { "Yılmaz", "Demir", "Kaya", "Çelik", "Smith", "Johnson", "Brown", "Taylor", "Schmidt", "Ivanov" };
            return names[r.Next(names.Length)] + " " + surnames[r.Next(surnames.Length)];
        }

        // Queue extension for shuffling
        public static Queue<T> ToQueue<T>(this IEnumerable<T> source) => new Queue<T>(source);
    }
}
