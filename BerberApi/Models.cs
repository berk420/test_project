namespace BerberApi;

public record Service(int Id, string Name, decimal Price, int DurationMin);

public record Barber(int Id, string Name, string District, string Bio, double Rating, string PhotoUrl, List<Service> Services);

public record BookingRequest(int BarberId, int ServiceId, string CustomerName, string CustomerPhone, string Address, DateTime Date);

public record Booking(int Id, int BarberId, int ServiceId, string CustomerName, string CustomerPhone, string Address, DateTime Date, string Status);
