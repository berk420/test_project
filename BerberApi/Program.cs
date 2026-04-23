using BerberApi;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
builder.Services.AddSingleton<BookingStore>();

var app = builder.Build();

app.UseCors(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.MapGet("/api/barbers", (BookingStore store) => Results.Ok(store.Barbers));

app.MapGet("/api/barbers/{id:int}", (int id, BookingStore store) =>
    store.Barbers.FirstOrDefault(b => b.Id == id) is { } barber
        ? Results.Ok(barber)
        : Results.NotFound());

app.MapPost("/api/bookings", (BookingRequest req, BookingStore store) =>
{
    var barber = store.Barbers.FirstOrDefault(b => b.Id == req.BarberId);
    if (barber is null) return Results.BadRequest("Berber bulunamadı.");

    var service = barber.Services.FirstOrDefault(s => s.Id == req.ServiceId);
    if (service is null) return Results.BadRequest("Hizmet bulunamadı.");

    var booking = new Booking(
        store.NextId(), req.BarberId, req.ServiceId,
        req.CustomerName, req.CustomerPhone,
        req.Address, req.Date, "Beklemede");

    store.Bookings.Add(booking);
    return Results.Created($"/api/bookings/{booking.Id}", booking);
});

app.MapGet("/api/bookings", (BookingStore store) => Results.Ok(store.Bookings));

app.Run();
