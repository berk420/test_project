namespace BerberApi;

public class BookingStore
{
    private int _nextId = 1;

    public List<Barber> Barbers { get; } =
    [
        new(1, "Ahmet Usta", "Beşiktaş", "15 yıllık deneyimli berber. Klasik ve modern kesimde uzman.", 4.8, "/photos/ahmet.jpg",
        [
            new(1, "Saç + Sakal", 150, 60),
            new(2, "Saç Kesimi", 90, 30),
            new(3, "Sakal Düzeltme", 70, 20),
        ]),
        new(2, "Mehmet Berber", "Kadıköy", "Trendleri yakından takip eden genç ve dinamik berber.", 4.6, "/photos/mehmet.jpg",
        [
            new(1, "Saç + Sakal", 170, 60),
            new(2, "Saç Kesimi", 100, 30),
            new(3, "Çocuk Saç Kesimi", 70, 25),
        ]),
        new(3, "Ali Usta", "Üsküdar", "Geleneksel Türk berberi. Ustura tıraş ve çocuk kesimi uzmanı.", 4.9, "/photos/ali.jpg",
        [
            new(1, "Saç + Sakal", 160, 75),
            new(2, "Saç Kesimi", 95, 35),
            new(3, "Ustura Tıraş", 80, 30),
            new(4, "Çocuk Saç Kesimi", 75, 25),
        ]),
        new(4, "Burak Style", "Şişli", "Saç boyama ve özel tasarım kesimde deneyimli.", 4.7, "/photos/burak.jpg",
        [
            new(1, "Saç + Sakal", 180, 70),
            new(2, "Saç Kesimi", 110, 40),
            new(3, "Saç Boyama", 300, 90),
        ]),
    ];

    public List<Booking> Bookings { get; } = [];

    public int NextId() => _nextId++;
}
