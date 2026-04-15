using test_project_api.Models;

namespace test_project_api.Data;

public static class DataStore
{
    private static readonly Lock _lock = new();

    public static List<Category> Categories { get; } =
    [
        new() { Id = 1, Name = "Diş Kliniği",       Slug = "dis-klinigi",       Icon = "🦷", Color = "#3b82f6" },
        new() { Id = 2, Name = "Estetik Klinik",     Slug = "estetik-klinik",    Icon = "✨", Color = "#a855f7" },
        new() { Id = 3, Name = "Göz Hastalıkları",   Slug = "goz-hastaliklari",  Icon = "👁️", Color = "#06b6d4" },
        new() { Id = 4, Name = "Genel Sağlık",       Slug = "genel-saglik",      Icon = "🏥", Color = "#22c55e" },
    ];

    public static List<Clinic> Clinics { get; } =
    [
        new()
        {
            Id = 1, Name = "Beyaz Gülüş Diş Merkezi", Slug = "beyaz-gulus-dis-merkezi",
            CategoryId = 1, CategoryName = "Diş Kliniği", City = "İstanbul", District = "Kadıköy",
            Description = "20 yılı aşkın deneyimimizle implant, ortodonti ve estetik diş tedavilerinde İstanbul'un önde gelen diş kliniğiyiz. Son teknoloji ekipmanlar ve uzman kadromuzla ağız sağlığınıza kavuşun.",
            Phone = "0212 555 10 20", Email = "info@beyazgulus.com", Website = "https://beyazgulus.com",
            Address = "Moda Cad. No:45, Kadıköy/İstanbul",
            Rating = 4.8, ReviewCount = 312,
            ImageUrl = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80",
            Tags = ["İmplant", "Ortodonti", "Estetik"],
            Services = ["İmplant", "Ortodonti", "Diş Beyazlatma", "Porselen Kaplama", "Kanal Tedavisi"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "SGK Anlaşmalı" },
            IsVerified = true, IsFeatured = true
        },
        new()
        {
            Id = 2, Name = "DentaPlus Ortodonti", Slug = "dentaplus-ortodonti",
            CategoryId = 1, CategoryName = "Diş Kliniği", City = "İstanbul", District = "Beşiktaş",
            Description = "Çocuk ve yetişkin ortodonti tedavisinde uzmanlaşmış klinikimiz, şeffaf plak ve metal braket uygulamalarıyla gülüşünüzü mükemmelleştiriyor.",
            Phone = "0212 444 30 30", Email = "randevu@dentaplus.com",
            Address = "Barbaros Bulvarı No:88, Beşiktaş/İstanbul",
            Rating = 4.6, ReviewCount = 178,
            ImageUrl = "https://images.unsplash.com/photo-1588776814546-1ffbb45bf7b6?w=600&q=80",
            Tags = ["Ortodonti", "Şeffaf Plak", "Çocuk Diş"],
            Services = ["Metal Braket", "Şeffaf Plak (Invisalign)", "Çocuk Ortodontisi", "Retainer"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Online", ["Sigorta"] = "Özel Sigorta" },
            IsVerified = true, IsFeatured = false
        },
        new()
        {
            Id = 3, Name = "Güzellik Akademisi İstanbul", Slug = "guzellik-akademisi-istanbul",
            CategoryId = 2, CategoryName = "Estetik Klinik", City = "İstanbul", District = "Şişli",
            Description = "Botoks, dolgu, lazer epilasyon ve cilt yenileme alanında uzman ekibimizle doğal güzelliğinizi ön plana çıkarıyoruz. Sertifikalı hekimler eşliğinde güvenli tedavi.",
            Phone = "0212 666 20 10", Email = "info@guzellikakademisi.com", Website = "https://guzellikakademisi.com",
            Address = "Halaskargazi Cad. No:155, Şişli/İstanbul",
            Rating = 4.9, ReviewCount = 521,
            ImageUrl = "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
            Tags = ["Botoks", "Dolgu", "Lazer", "Cilt Bakımı"],
            Services = ["Botoks", "Hyalüronik Asit Dolgu", "Lazer Epilasyon", "PRP", "Cilt Gençleştirme", "İplik Askı"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Telefon", ["Uzmanlik"] = "Estetik & Dermatoloji" },
            IsVerified = true, IsFeatured = true
        },
        new()
        {
            Id = 4, Name = "Ankara Göz Merkezi", Slug = "ankara-goz-merkezi",
            CategoryId = 3, CategoryName = "Göz Hastalıkları", City = "Ankara", District = "Çankaya",
            Description = "Lazer göz ameliyatı, katarakt ve retina hastalıklarında Ankara'nın en köklü göz kliniği. 25 yıllık deneyim, 50.000'den fazla başarılı operasyon.",
            Phone = "0312 456 78 90", Email = "info@ankaragoz.com", Website = "https://ankaragoz.com",
            Address = "Tunalı Hilmi Cad. No:72, Çankaya/Ankara",
            Rating = 4.7, ReviewCount = 893,
            ImageUrl = "https://images.unsplash.com/photo-1516069677018-378515003435?w=600&q=80",
            Tags = ["Lazer", "Katarakt", "Retina"],
            Services = ["LASIK", "LASEK", "Katarakt Ameliyatı", "Retina Tedavisi", "Glokom", "Göz Tansiyonu"],
            DynamicFields = new() { ["Klinik Tipi"] = "Hastane", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "SGK & Özel" },
            IsVerified = true, IsFeatured = true
        },
        new()
        {
            Id = 5, Name = "VisionCare Optik & Klinik", Slug = "visioncare-optik-klinik",
            CategoryId = 3, CategoryName = "Göz Hastalıkları", City = "İzmir", District = "Karşıyaka",
            Description = "Göz sağlığında tam kapsamlı hizmet. Rutin kontrol ve reçeteli gözlükten laser ameliyatına kadar her ihtiyacınızda yanınızdayız.",
            Phone = "0232 333 44 55", Email = "randevu@visioncare.com",
            Address = "Girne Bulvarı No:34, Karşıyaka/İzmir",
            Rating = 4.5, ReviewCount = 234,
            ImageUrl = "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&q=80",
            Tags = ["Lazer", "Çocuk Göz", "Kontakt Lens"],
            Services = ["Göz Muayenesi", "LASIK", "Çocuk Göz Sağlığı", "Kontakt Lens Uygulaması"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Telefon", ["Sigorta"] = "Özel Sigorta" },
            IsVerified = false, IsFeatured = false
        },
        new()
        {
            Id = 6, Name = "SağlıkPlus Aile Kliniği", Slug = "saglikplus-aile-klinigi",
            CategoryId = 4, CategoryName = "Genel Sağlık", City = "İstanbul", District = "Ümraniye",
            Description = "Aile hekimliği, dahiliye ve koruyucu sağlık hizmetlerinde kapsamlı çözümler. Tahlil, röntgen, ultrason ve uzman hekim konsültasyonu tek çatı altında.",
            Phone = "0216 777 88 99", Email = "info@saglikplus.com",
            Address = "Site Yolu Sok. No:12, Ümraniye/İstanbul",
            Rating = 4.4, ReviewCount = 156,
            ImageUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
            Tags = ["Aile Hekimi", "Tahlil", "Ultrason"],
            Services = ["Aile Hekimliği", "Dahiliye", "Check-Up", "Tahlil", "Ultrason", "EKG"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "SGK Anlaşmalı" },
            IsVerified = true, IsFeatured = false
        },
        new()
        {
            Id = 7, Name = "Estetika Medikal Merkez", Slug = "estetika-medikal-merkez",
            CategoryId = 2, CategoryName = "Estetik Klinik", City = "Ankara", District = "Kızılay",
            Description = "Yüz estetiği, vücut şekillendirme ve medikal cilt bakımı konularında Ankara'nın tercih edilen kliniği. Uzman plastik cerrah ve dermatoloji ekibi.",
            Phone = "0312 234 56 78", Email = "bilgi@estetika.com", Website = "https://estetika.com",
            Address = "Atatürk Bulvarı No:201, Kızılay/Ankara",
            Rating = 4.7, ReviewCount = 445,
            ImageUrl = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
            Tags = ["Yüz Estetiği", "Vücut Şekillendirme", "Rinoplasti"],
            Services = ["Rinoplasti", "Liposuction", "Karın Germe", "Göz Kapağı Estetiği", "Dolgu", "Botoks"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Telefon", ["Uzmanlik"] = "Plastik Cerrahi" },
            IsVerified = true, IsFeatured = true
        },
        new()
        {
            Id = 8, Name = "İzmir Diş Hastanesi", Slug = "izmir-dis-hastanesi",
            CategoryId = 1, CategoryName = "Diş Kliniği", City = "İzmir", District = "Bornova",
            Description = "İzmir'in en büyük özel diş hastanesi. 15 uzman diş hekimi ve tam donanımlı ameliyathane ile acil dahil tüm diş tedavilerini sunuyoruz.",
            Phone = "0232 888 77 66", Email = "info@izmirdis.com",
            Address = "Ege Üniversitesi Karşısı No:5, Bornova/İzmir",
            Rating = 4.5, ReviewCount = 677,
            ImageUrl = "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80",
            Tags = ["Acil", "İmplant", "Protez"],
            Services = ["İmplant", "Protez", "Cerrahi Çekim", "Kanal Tedavisi", "Pedodonti", "Acil Diş"],
            DynamicFields = new() { ["Klinik Tipi"] = "Hastane", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "SGK & Özel" },
            IsVerified = true, IsFeatured = false
        },
    ];

    public static List<Lead> Leads { get; } = GenerateLeads();

    private static Dictionary<int, ClinicStats> _stats = GenerateStats();

    public static List<DynamicFieldDefinition> DynamicFields { get; } =
    [
        new() { Id = 1, Name = "Klinik Tipi",   Key = "Klinik Tipi",  Type = "select",  Options = ["Özel", "Hastane", "Poliklinik"], CategoryId = null,  IsVisible = true, Order = 1 },
        new() { Id = 2, Name = "Randevu Türü",   Key = "Randevu",      Type = "select",  Options = ["Online", "Telefon", "Online & Telefon"], CategoryId = null, IsVisible = true, Order = 2 },
        new() { Id = 3, Name = "Sigorta",        Key = "Sigorta",      Type = "select",  Options = ["SGK Anlaşmalı", "Özel Sigorta", "SGK & Özel", "Sigortasız"], CategoryId = null, IsVisible = true, Order = 3 },
        new() { Id = 4, Name = "Uzmanlık Alanı", Key = "Uzmanlik",     Type = "text",    CategoryId = 2, IsVisible = true, Order = 4 },
    ];

    public static List<FilterDefinition> Filters { get; } =
    [
        new() { Id = 1, Name = "Şehir",         Key = "city",      Type = "select",      Options = ["İstanbul", "Ankara", "İzmir"], CategoryId = null, IsVisible = true, Order = 1 },
        new() { Id = 2, Name = "Sigorta",        Key = "Sigorta",   Type = "select",      Options = ["SGK Anlaşmalı", "Özel Sigorta", "SGK & Özel"], CategoryId = null, IsVisible = true, Order = 2 },
        new() { Id = 3, Name = "Randevu Türü",   Key = "Randevu",   Type = "select",      Options = ["Online", "Telefon", "Online & Telefon"], CategoryId = null, IsVisible = true, Order = 3 },
        new() { Id = 4, Name = "Sadece Onaylı",  Key = "verified",  Type = "boolean",     CategoryId = null, IsVisible = true, Order = 4 },
        new() { Id = 5, Name = "Öne Çıkan",      Key = "featured",  Type = "boolean",     CategoryId = null, IsVisible = true, Order = 5 },
    ];

    // --- Stats ---

    public static ClinicStats GetStats(int clinicId)
    {
        lock (_lock)
        {
            if (_stats.TryGetValue(clinicId, out var s)) return s;
            var clinic = Clinics.FirstOrDefault(c => c.Id == clinicId);
            var ns = new ClinicStats { ClinicId = clinicId, ClinicName = clinic?.Name ?? "" };
            _stats[clinicId] = ns;
            return ns;
        }
    }

    public static void IncrementView(int clinicId)
    {
        lock (_lock) { GetStats(clinicId).Views++; }
    }

    public static void IncrementClick(int clinicId)
    {
        lock (_lock) { GetStats(clinicId).Clicks++; }
    }

    public static List<ClinicStats> AllStats()
    {
        lock (_lock) { return [.. _stats.Values]; }
    }

    // --- Leads ---

    public static Lead AddLead(CreateLeadRequest req)
    {
        lock (_lock)
        {
            var clinic = Clinics.FirstOrDefault(c => c.Id == req.ClinicId);
            var lead = new Lead
            {
                Id = Leads.Count + 1,
                ClinicId = req.ClinicId,
                ClinicName = clinic?.Name ?? "",
                Name = req.Name,
                Phone = req.Phone,
                Email = req.Email,
                Message = req.Message,
                Source = req.Source,
                CreatedAt = DateTime.UtcNow,
                Status = "new"
            };
            Leads.Add(lead);
            GetStats(req.ClinicId).Leads++;
            return lead;
        }
    }

    public static bool UpdateLeadStatus(int id, string status)
    {
        lock (_lock)
        {
            var lead = Leads.FirstOrDefault(l => l.Id == id);
            if (lead == null) return false;
            lead.Status = status;
            return true;
        }
    }

    // --- Dynamic fields / Filters ---

    public static bool UpdateDynamicField(int id, DynamicFieldDefinition updated)
    {
        var f = DynamicFields.FirstOrDefault(x => x.Id == id);
        if (f == null) return false;
        f.Name = updated.Name;
        f.IsVisible = updated.IsVisible;
        f.Order = updated.Order;
        f.Options = updated.Options;
        return true;
    }

    public static bool UpdateFilter(int id, FilterDefinition updated)
    {
        var f = Filters.FirstOrDefault(x => x.Id == id);
        if (f == null) return false;
        f.Name = updated.Name;
        f.IsVisible = updated.IsVisible;
        f.Order = updated.Order;
        f.Options = updated.Options;
        return true;
    }

    // --- Seed helpers ---

    private static List<Lead> GenerateLeads()
    {
        var now = DateTime.UtcNow;
        return
        [
            new() { Id=1,  ClinicId=1, ClinicName="Beyaz Gülüş Diş Merkezi",       Name="Ayşe Kaya",    Phone="0532 111 22 33", Email="ayse@email.com",   Message="İmplant fiyatı öğrenmek istiyorum.",           Source="detail",  CreatedAt=now.AddHours(-2),  Status="new" },
            new() { Id=2,  ClinicId=3, ClinicName="Güzellik Akademisi İstanbul",    Name="Fatma Demir",  Phone="0533 222 33 44", Email="fatma@email.com",  Message="Botoks için randevu almak istiyorum.",          Source="listing", CreatedAt=now.AddHours(-5),  Status="contacted" },
            new() { Id=3,  ClinicId=4, ClinicName="Ankara Göz Merkezi",            Name="Mehmet Yılmaz",Phone="0534 333 44 55", Email="mehmet@email.com", Message="LASIK ameliyatı hakkında bilgi istiyorum.",     Source="detail",  CreatedAt=now.AddDays(-1),   Status="converted" },
            new() { Id=4,  ClinicId=1, ClinicName="Beyaz Gülüş Diş Merkezi",       Name="Zeynep Arslan",Phone="0535 444 55 66", Email="zeynep@email.com", Message="Ortodonti tedavisi için randevu.",              Source="detail",  CreatedAt=now.AddDays(-1),   Status="new" },
            new() { Id=5,  ClinicId=7, ClinicName="Estetika Medikal Merkez",       Name="Ali Çelik",    Phone="0536 555 66 77", Email="ali@email.com",    Message="Rinoplasti fiyat teklifi istiyorum.",           Source="listing", CreatedAt=now.AddDays(-2),   Status="contacted" },
            new() { Id=6,  ClinicId=6, ClinicName="SağlıkPlus Aile Kliniği",       Name="Emine Şahin",  Phone="0537 666 77 88", Email="emine@email.com",  Message="Check-up paketi hakkında bilgi.",               Source="detail",  CreatedAt=now.AddDays(-2),   Status="new" },
            new() { Id=7,  ClinicId=2, ClinicName="DentaPlus Ortodonti",           Name="Burak Öztürk", Phone="0538 777 88 99", Email="burak@email.com",  Message="Invisalign tedavisi süresi ne kadar?",          Source="detail",  CreatedAt=now.AddDays(-3),   Status="converted" },
            new() { Id=8,  ClinicId=4, ClinicName="Ankara Göz Merkezi",            Name="Selin Kurt",   Phone="0539 888 99 00", Email="selin@email.com",  Message="Katarakt ameliyatı için randevu istiyorum.",    Source="detail",  CreatedAt=now.AddDays(-3),   Status="new" },
            new() { Id=9,  ClinicId=3, ClinicName="Güzellik Akademisi İstanbul",   Name="Hakan Güneş",  Phone="0530 999 00 11", Email="hakan@email.com",  Message="Lazer epilasyon paket fiyatları?",              Source="listing", CreatedAt=now.AddDays(-4),   Status="contacted" },
            new() { Id=10, ClinicId=8, ClinicName="İzmir Diş Hastanesi",           Name="Deniz Aydın",  Phone="0531 000 11 22", Email="deniz@email.com",  Message="Protez diş için fiyat öğrenmek istiyorum.",    Source="detail",  CreatedAt=now.AddDays(-5),   Status="new" },
        ];
    }

    private static Dictionary<int, ClinicStats> GenerateStats()
    {
        return new Dictionary<int, ClinicStats>
        {
            [1] = new() { ClinicId=1, ClinicName="Beyaz Gülüş Diş Merkezi",      Views=1240, Clicks=387, Leads=42 },
            [2] = new() { ClinicId=2, ClinicName="DentaPlus Ortodonti",           Views=890,  Clicks=221, Leads=18 },
            [3] = new() { ClinicId=3, ClinicName="Güzellik Akademisi İstanbul",   Views=2110, Clicks=634, Leads=76 },
            [4] = new() { ClinicId=4, ClinicName="Ankara Göz Merkezi",            Views=1780, Clicks=512, Leads=61 },
            [5] = new() { ClinicId=5, ClinicName="VisionCare Optik & Klinik",     Views=560,  Clicks=134, Leads=12 },
            [6] = new() { ClinicId=6, ClinicName="SağlıkPlus Aile Kliniği",       Views=670,  Clicks=189, Leads=23 },
            [7] = new() { ClinicId=7, ClinicName="Estetika Medikal Merkez",       Views=1450, Clicks=421, Leads=55 },
            [8] = new() { ClinicId=8, ClinicName="İzmir Diş Hastanesi",           Views=980,  Clicks=278, Leads=31 },
        };
    }
}
