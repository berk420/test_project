using test_project_api.Models;

namespace test_project_api.Data;

public static class DataStore
{
    private static readonly Lock _lock = new();

    // ──────────────────────────── CATEGORIES ────────────────────────────
    public static List<Category> Categories { get; } =
    [
        new() { Id = 1, Name = "Diş Kliniği",       Slug = "dis-klinigi",       Icon = "🦷", Color = "#3b82f6" },
        new() { Id = 2, Name = "Estetik Klinik",     Slug = "estetik-klinik",    Icon = "✨", Color = "#a855f7" },
        new() { Id = 3, Name = "Göz Hastalıkları",   Slug = "goz-hastaliklari",  Icon = "👁️", Color = "#06b6d4" },
        new() { Id = 4, Name = "Genel Sağlık",       Slug = "genel-saglik",      Icon = "🏥", Color = "#22c55e" },
        new() { Id = 5, Name = "Saç Ekimi",          Slug = "sac-ekimi",         Icon = "💈", Color = "#f59e0b" },
        new() { Id = 6, Name = "Ortopedi",           Slug = "ortopedi",          Icon = "🦴", Color = "#ef4444" },
    ];

    // ──────────────────────────── CLINICS ────────────────────────────
    public static List<Clinic> Clinics { get; } =
    [
        new()
        {
            Id = 1, Name = "Beyaz Gülüş Diş Merkezi", Slug = "beyaz-gulus-dis-merkezi",
            CategoryId = 1, CategoryName = "Diş Kliniği", City = "İstanbul", District = "Kadıköy", Country = "Türkiye",
            Description = "20 yılı aşkın deneyimimizle implant, ortodonti ve estetik diş tedavilerinde İstanbul'un önde gelen diş kliniğiyiz.",
            Phone = "+90 212 555 10 20", WhatsApp = "+90 532 555 10 20", Email = "info@beyazgulus.com", Website = "https://beyazgulus.com",
            Address = "Moda Cad. No:45, Kadıköy/İstanbul",
            Rating = 4.8, ReviewCount = 312,
            ImageUrl = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80",
            GalleryUrls = [
                "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80",
                "https://images.unsplash.com/photo-1588776814546-1ffbb45bf7b6?w=400&q=80"
            ],
            Tags = ["İmplant", "Ortodonti", "Estetik"],
            Services = ["İmplant", "Ortodonti", "Diş Beyazlatma", "Porselen Kaplama", "Kanal Tedavisi"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "SGK Anlaşmalı" },
            IsVerified = true, IsFeatured = true, IsPremium = true, Badge = "premium",
            AvgResponseTime = "45 dakika", TotalPatients = 8500, PatientsLast30Days = 142,
            PatientCountries = ["Almanya", "İngiltere", "Hollanda", "Türkiye"],
            MinPrice = 500, MaxPrice = 3500, PriceCurrency = "USD", Lat = 40.9813, Lng = 29.0315
        },
        new()
        {
            Id = 2, Name = "DentaPlus Ortodonti", Slug = "dentaplus-ortodonti",
            CategoryId = 1, CategoryName = "Diş Kliniği", City = "İstanbul", District = "Beşiktaş", Country = "Türkiye",
            Description = "Çocuk ve yetişkin ortodonti tedavisinde uzmanlaşmış klinikimiz, şeffaf plak ve metal braket uygulamalarıyla gülüşünüzü mükemmelleştiriyor.",
            Phone = "+90 212 444 30 30", WhatsApp = "+90 533 444 30 30", Email = "randevu@dentaplus.com",
            Address = "Barbaros Bulvarı No:88, Beşiktaş/İstanbul",
            Rating = 4.6, ReviewCount = 178,
            ImageUrl = "https://images.unsplash.com/photo-1588776814546-1ffbb45bf7b6?w=600&q=80",
            GalleryUrls = [],
            Tags = ["Ortodonti", "Şeffaf Plak", "Çocuk Diş"],
            Services = ["Metal Braket", "Şeffaf Plak (Invisalign)", "Çocuk Ortodontisi", "Retainer"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Online", ["Sigorta"] = "Özel Sigorta" },
            IsVerified = true, IsFeatured = false, IsPremium = false, Badge = "verified",
            AvgResponseTime = "2 saat", TotalPatients = 3200, PatientsLast30Days = 67,
            PatientCountries = ["Türkiye", "Avustralya"],
            MinPrice = 800, MaxPrice = 4000, PriceCurrency = "USD", Lat = 41.0434, Lng = 29.0077
        },
        new()
        {
            Id = 3, Name = "Güzellik Akademisi İstanbul", Slug = "guzellik-akademisi-istanbul",
            CategoryId = 2, CategoryName = "Estetik Klinik", City = "İstanbul", District = "Şişli", Country = "Türkiye",
            Description = "Botoks, dolgu, lazer epilasyon ve cilt yenileme alanında uzman ekibimizle doğal güzelliğinizi ön plana çıkarıyoruz.",
            Phone = "+90 212 666 20 10", WhatsApp = "+90 534 666 20 10", Email = "info@guzellikakademisi.com", Website = "https://guzellikakademisi.com",
            Address = "Halaskargazi Cad. No:155, Şişli/İstanbul",
            Rating = 4.9, ReviewCount = 521,
            ImageUrl = "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
            GalleryUrls = [
                "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80",
                "https://images.unsplash.com/photo-1516069677018-378515003435?w=400&q=80"
            ],
            Tags = ["Botoks", "Dolgu", "Lazer", "Cilt Bakımı"],
            Services = ["Botoks", "Hyalüronik Asit Dolgu", "Lazer Epilasyon", "PRP", "Cilt Gençleştirme", "İplik Askı"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Telefon", ["Uzmanlik"] = "Estetik & Dermatoloji" },
            IsVerified = true, IsFeatured = true, IsPremium = true, Badge = "popular",
            AvgResponseTime = "30 dakika", TotalPatients = 12000, PatientsLast30Days = 243,
            PatientCountries = ["İngiltere", "Almanya", "BAE", "Türkiye", "Fransa"],
            MinPrice = 200, MaxPrice = 2000, PriceCurrency = "USD", Lat = 41.0537, Lng = 28.9939
        },
        new()
        {
            Id = 4, Name = "Ankara Göz Merkezi", Slug = "ankara-goz-merkezi",
            CategoryId = 3, CategoryName = "Göz Hastalıkları", City = "Ankara", District = "Çankaya", Country = "Türkiye",
            Description = "Lazer göz ameliyatı, katarakt ve retina hastalıklarında Ankara'nın en köklü göz kliniği. 25 yıllık deneyim, 50.000+ başarılı operasyon.",
            Phone = "+90 312 456 78 90", WhatsApp = "+90 535 456 78 90", Email = "info@ankaragoz.com", Website = "https://ankaragoz.com",
            Address = "Tunalı Hilmi Cad. No:72, Çankaya/Ankara",
            Rating = 4.7, ReviewCount = 893,
            ImageUrl = "https://images.unsplash.com/photo-1516069677018-378515003435?w=600&q=80",
            GalleryUrls = [],
            Tags = ["Lazer", "Katarakt", "Retina"],
            Services = ["LASIK", "LASEK", "Katarakt Ameliyatı", "Retina Tedavisi", "Glokom"],
            DynamicFields = new() { ["Klinik Tipi"] = "Hastane", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "SGK & Özel" },
            IsVerified = true, IsFeatured = true, IsPremium = false, Badge = "verified",
            AvgResponseTime = "1 saat", TotalPatients = 22000, PatientsLast30Days = 310,
            PatientCountries = ["Türkiye", "Azerbaycan", "Irak"],
            MinPrice = 600, MaxPrice = 2500, PriceCurrency = "USD", Lat = 39.9032, Lng = 32.8597
        },
        new()
        {
            Id = 5, Name = "VisionCare Optik & Klinik", Slug = "visioncare-optik-klinik",
            CategoryId = 3, CategoryName = "Göz Hastalıkları", City = "İzmir", District = "Karşıyaka", Country = "Türkiye",
            Description = "Göz sağlığında tam kapsamlı hizmet. Rutin kontrol ve reçeteli gözlükten laser ameliyatına kadar.",
            Phone = "+90 232 333 44 55", Email = "randevu@visioncare.com",
            Address = "Girne Bulvarı No:34, Karşıyaka/İzmir",
            Rating = 4.5, ReviewCount = 234,
            ImageUrl = "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&q=80",
            GalleryUrls = [],
            Tags = ["Lazer", "Çocuk Göz", "Kontakt Lens"],
            Services = ["Göz Muayenesi", "LASIK", "Çocuk Göz Sağlığı", "Kontakt Lens Uygulaması"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Telefon", ["Sigorta"] = "Özel Sigorta" },
            IsVerified = false, IsFeatured = false, IsPremium = false, Badge = "",
            AvgResponseTime = "3 saat", TotalPatients = 5600, PatientsLast30Days = 48,
            PatientCountries = ["Türkiye"],
            MinPrice = 400, MaxPrice = 1800, PriceCurrency = "USD", Lat = 38.4567, Lng = 27.1189
        },
        new()
        {
            Id = 6, Name = "SağlıkPlus Aile Kliniği", Slug = "saglikplus-aile-klinigi",
            CategoryId = 4, CategoryName = "Genel Sağlık", City = "İstanbul", District = "Ümraniye", Country = "Türkiye",
            Description = "Aile hekimliği, dahiliye ve koruyucu sağlık hizmetlerinde kapsamlı çözümler.",
            Phone = "+90 216 777 88 99", Email = "info@saglikplus.com",
            Address = "Site Yolu Sok. No:12, Ümraniye/İstanbul",
            Rating = 4.4, ReviewCount = 156,
            ImageUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
            GalleryUrls = [],
            Tags = ["Aile Hekimi", "Tahlil", "Ultrason"],
            Services = ["Aile Hekimliği", "Dahiliye", "Check-Up", "Tahlil", "Ultrason", "EKG"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "SGK Anlaşmalı" },
            IsVerified = true, IsFeatured = false, IsPremium = false, Badge = "",
            AvgResponseTime = "2 saat", TotalPatients = 4200, PatientsLast30Days = 89,
            PatientCountries = ["Türkiye"],
            MinPrice = 50, MaxPrice = 500, PriceCurrency = "USD", Lat = 41.0147, Lng = 29.1023
        },
        new()
        {
            Id = 7, Name = "Estetika Medikal Merkez", Slug = "estetika-medikal-merkez",
            CategoryId = 2, CategoryName = "Estetik Klinik", City = "Ankara", District = "Kızılay", Country = "Türkiye",
            Description = "Yüz estetiği, vücut şekillendirme ve medikal cilt bakımı konularında Ankara'nın tercih edilen kliniği.",
            Phone = "+90 312 234 56 78", WhatsApp = "+90 536 234 56 78", Email = "bilgi@estetika.com", Website = "https://estetika.com",
            Address = "Atatürk Bulvarı No:201, Kızılay/Ankara",
            Rating = 4.7, ReviewCount = 445,
            ImageUrl = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
            GalleryUrls = [],
            Tags = ["Yüz Estetiği", "Vücut Şekillendirme", "Rinoplasti"],
            Services = ["Rinoplasti", "Liposuction", "Karın Germe", "Göz Kapağı Estetiği", "Dolgu", "Botoks"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Telefon", ["Uzmanlik"] = "Plastik Cerrahi" },
            IsVerified = true, IsFeatured = true, IsPremium = false, Badge = "fast-response",
            AvgResponseTime = "20 dakika", TotalPatients = 9800, PatientsLast30Days = 178,
            PatientCountries = ["Türkiye", "Almanya", "Avusturya"],
            MinPrice = 1500, MaxPrice = 8000, PriceCurrency = "USD", Lat = 39.9196, Lng = 32.8541
        },
        new()
        {
            Id = 8, Name = "İzmir Diş Hastanesi", Slug = "izmir-dis-hastanesi",
            CategoryId = 1, CategoryName = "Diş Kliniği", City = "İzmir", District = "Bornova", Country = "Türkiye",
            Description = "İzmir'in en büyük özel diş hastanesi. 15 uzman diş hekimi ile acil dahil tüm diş tedavilerini sunuyoruz.",
            Phone = "+90 232 888 77 66", Email = "info@izmirdis.com",
            Address = "Ege Üniversitesi Karşısı No:5, Bornova/İzmir",
            Rating = 4.5, ReviewCount = 677,
            ImageUrl = "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80",
            GalleryUrls = [],
            Tags = ["Acil", "İmplant", "Protez"],
            Services = ["İmplant", "Protez", "Cerrahi Çekim", "Kanal Tedavisi", "Pedodonti", "Acil Diş"],
            DynamicFields = new() { ["Klinik Tipi"] = "Hastane", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "SGK & Özel" },
            IsVerified = true, IsFeatured = false, IsPremium = false, Badge = "",
            AvgResponseTime = "1 saat", TotalPatients = 15000, PatientsLast30Days = 220,
            PatientCountries = ["Türkiye", "Yunanistan"],
            MinPrice = 300, MaxPrice = 3000, PriceCurrency = "USD", Lat = 38.4626, Lng = 27.2205
        },
        new()
        {
            Id = 9, Name = "HairTurkey Saç Ekimi Merkezi", Slug = "hairturkey-sac-ekimi",
            CategoryId = 5, CategoryName = "Saç Ekimi", City = "İstanbul", District = "Gayrettepe", Country = "Türkiye",
            Description = "DHI ve FUE saç ekimi tekniklerinde Türkiye'nin lider merkezi. Avrupa'dan gelen hastalara özel VIP paketler.",
            Phone = "+90 212 999 00 11", WhatsApp = "+90 537 999 00 11", Email = "info@hairturkey.com", Website = "https://hairturkey.com",
            Address = "Büyükdere Cad. No:78, Gayrettepe/İstanbul",
            Rating = 4.8, ReviewCount = 1240,
            ImageUrl = "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&q=80",
            GalleryUrls = [],
            Tags = ["DHI", "FUE", "Saç Ekimi", "VIP"],
            Services = ["FUE Saç Ekimi", "DHI Saç Ekimi", "Sakal Ekimi", "Kaş Ekimi", "PRP", "VIP Paket"],
            DynamicFields = new() { ["Klinik Tipi"] = "Özel", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "Özel Sigorta" },
            IsVerified = true, IsFeatured = true, IsPremium = true, Badge = "popular",
            AvgResponseTime = "15 dakika", TotalPatients = 25000, PatientsLast30Days = 380,
            PatientCountries = ["İngiltere", "Almanya", "Hollanda", "İsveç", "Norveç", "Fransa"],
            MinPrice = 1200, MaxPrice = 4000, PriceCurrency = "USD", Lat = 41.0738, Lng = 28.9937
        },
        new()
        {
            Id = 10, Name = "Anatolia Ortopedi Hastanesi", Slug = "anatolia-ortopedi",
            CategoryId = 6, CategoryName = "Ortopedi", City = "Antalya", District = "Lara", Country = "Türkiye",
            Description = "Diz ve kalça protezi, spor yaralanmaları ve omurga cerrahisinde uluslararası standartlarda hizmet.",
            Phone = "+90 242 111 22 33", WhatsApp = "+90 538 111 22 33", Email = "info@anatoliaortopedi.com",
            Address = "Lara Cad. No:210, Antalya",
            Rating = 4.9, ReviewCount = 567,
            ImageUrl = "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80",
            GalleryUrls = [],
            Tags = ["Diz Protezi", "Kalça Protezi", "Spor Cerrahisi"],
            Services = ["Diz Protezi", "Kalça Protezi", "Artroskopi", "Omurga Cerrahisi", "Spor Yaralanmaları"],
            DynamicFields = new() { ["Klinik Tipi"] = "Hastane", ["Randevu"] = "Online & Telefon", ["Sigorta"] = "Özel Sigorta" },
            IsVerified = true, IsFeatured = true, IsPremium = true, Badge = "premium",
            AvgResponseTime = "30 dakika", TotalPatients = 18000, PatientsLast30Days = 290,
            PatientCountries = ["Almanya", "İsviçre", "Avusturya", "İngiltere", "Rusya"],
            MinPrice = 3000, MaxPrice = 12000, PriceCurrency = "USD", Lat = 36.8738, Lng = 30.7232
        },
    ];

    // ──────────────────────────── LEADS ────────────────────────────
    public static List<Lead> Leads { get; } = GenerateLeads();

    // ──────────────────────────── STATS ────────────────────────────
    private static Dictionary<int, ClinicStats> _stats = GenerateStats();

    // ──────────────────────────── DYNAMIC FIELDS / FILTERS ────────────────────────────
    public static List<DynamicFieldDefinition> DynamicFields { get; } =
    [
        new() { Id = 1, Name = "Klinik Tipi",   Key = "Klinik Tipi", Type = "select", Options = ["Özel", "Hastane", "Poliklinik"], CategoryId = null, IsVisible = true, Order = 1 },
        new() { Id = 2, Name = "Randevu Türü",   Key = "Randevu",     Type = "select", Options = ["Online", "Telefon", "Online & Telefon"], CategoryId = null, IsVisible = true, Order = 2 },
        new() { Id = 3, Name = "Sigorta",        Key = "Sigorta",     Type = "select", Options = ["SGK Anlaşmalı", "Özel Sigorta", "SGK & Özel", "Sigortasız"], CategoryId = null, IsVisible = true, Order = 3 },
        new() { Id = 4, Name = "Uzmanlık Alanı", Key = "Uzmanlik",    Type = "text",   CategoryId = 2, IsVisible = true, Order = 4 },
    ];

    public static List<FilterDefinition> Filters { get; } =
    [
        new() { Id = 1, Name = "Şehir",        Key = "city",     Type = "select",  Options = ["İstanbul", "Ankara", "İzmir", "Antalya"], CategoryId = null, IsVisible = true, Order = 1 },
        new() { Id = 2, Name = "Sigorta",       Key = "Sigorta",  Type = "select",  Options = ["SGK Anlaşmalı", "Özel Sigorta", "SGK & Özel"], CategoryId = null, IsVisible = true, Order = 2 },
        new() { Id = 3, Name = "Randevu Türü",  Key = "Randevu",  Type = "select",  Options = ["Online", "Telefon", "Online & Telefon"], CategoryId = null, IsVisible = true, Order = 3 },
        new() { Id = 4, Name = "Sadece Onaylı", Key = "verified", Type = "boolean", CategoryId = null, IsVisible = true, Order = 4 },
        new() { Id = 5, Name = "Öne Çıkan",     Key = "featured", Type = "boolean", CategoryId = null, IsVisible = true, Order = 5 },
    ];

    // ──────────────────────────── USERS ────────────────────────────
    public static List<User> Users { get; } =
    [
        new() { Id = 1, Name = "Demo Kullanıcı", Email = "demo@medtravio.com", Phone = "+90 530 000 00 01", PasswordHash = "demo123", Role = "user",  Country = "Türkiye", IsVerified = true },
        new() { Id = 2, Name = "Admin",           Email = "admin@medtravio.com", Phone = "+90 530 000 00 00", PasswordHash = "admin123", Role = "admin", Country = "Türkiye", IsVerified = true },
    ];

    // ──────────────────────────── FAVORITES / ALERTS ────────────────────────────
    public static List<Favorite>   Favorites   { get; } = [];
    public static List<PriceAlert> PriceAlerts { get; } = [];

    // ──────────────────────────── REVIEWS ────────────────────────────
    public static List<Review> Reviews { get; } = GenerateReviews();

    // ──────────────────────────── CRM ────────────────────────────
    public static List<LeadNote>       LeadNotes       { get; } = [];
    public static List<LeadTag>        LeadTags        { get; } = [];
    public static List<LeadReminder>   LeadReminders   { get; } = [];
    public static List<LeadAssignment> LeadAssignments { get; } = [];

    // ──────────────────────────── CAMPAIGNS ────────────────────────────
    public static List<Campaign> Campaigns { get; } = GenerateCampaigns();

    // ──────────────────────────── BLOG ────────────────────────────
    public static List<BlogPost>      BlogPosts      { get; } = GenerateBlogPosts();
    public static List<TreatmentPage> TreatmentPages { get; } = GenerateTreatmentPages();
    public static List<CityPage>      CityPages      { get; } = GenerateCityPages();

    // ──────────────────────────── PRICE RANGES ────────────────────────────
    public static List<ClinicPriceRange> PriceRanges { get; } = GeneratePriceRanges();

    // ──────────────────────────── CASE PHOTOS ────────────────────────────
    public static List<CasePhoto> CasePhotos { get; } = GenerateCasePhotos();

    // ──────────────────────────── NOTIFICATIONS ────────────────────────────
    public static List<Notification> Notifications { get; } = [];

    // ──────────────────────────── BILLING / AFFILIATE ────────────────────────────
    public static List<BillingRecord>  BillingRecords  { get; } = [];
    public static List<AffiliateLink>  AffiliateLinks  { get; } = [];

    // ────────────────────────────────────────────────────────────────
    //  STATS
    // ────────────────────────────────────────────────────────────────
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
    public static void IncrementView(int clinicId)  { lock (_lock) { GetStats(clinicId).Views++;  } }
    public static void IncrementClick(int clinicId) { lock (_lock) { GetStats(clinicId).Clicks++; } }
    public static List<ClinicStats> AllStats()      { lock (_lock) { return [.. _stats.Values];   } }

    // ────────────────────────────────────────────────────────────────
    //  LEADS
    // ────────────────────────────────────────────────────────────────
    public static Lead AddLead(CreateLeadRequest req)
    {
        lock (_lock)
        {
            var clinic = req.ClinicId.HasValue ? Clinics.FirstOrDefault(c => c.Id == req.ClinicId.Value) : null;
            var lead = new Lead
            {
                Id = Leads.Count + 1,
                AssignedClinicId = req.ClinicId,
                AssignedClinicName = clinic?.Name ?? "",
                Name = req.Name, Phone = req.Phone, Email = req.Email,
                Country = req.Country, TreatmentType = req.TreatmentType,
                Message = req.Message, Source = req.Source, ReferralCode = req.ReferralCode,
                Status = "pending", CreatedAt = DateTime.UtcNow
            };
            lead.LeadScore = CalculateLeadScore(lead);
            lead.LeadTier = lead.LeadScore >= 70 ? "hot" : lead.LeadScore >= 40 ? "warm" : "cold";
            Leads.Add(lead);

            if (req.ClinicId.HasValue) GetStats(req.ClinicId.Value).Leads++;

            if (clinic != null)
                BillingRecords.Add(new BillingRecord { Id = BillingRecords.Count + 1, ClinicId = clinic.Id, ClinicName = clinic.Name, LeadId = lead.Id, Amount = 15.00, Currency = "USD", Type = "lead_fee", Status = "pending" });

            if (!string.IsNullOrWhiteSpace(req.ReferralCode))
            {
                var aff = AffiliateLinks.FirstOrDefault(a => a.ReferralCode == req.ReferralCode);
                if (aff != null) aff.TotalLeads++;
            }
            return lead;
        }
    }

    private static int CalculateLeadScore(Lead lead)
    {
        int score = 30;
        if (!string.IsNullOrWhiteSpace(lead.Email))          score += 20;
        if (!string.IsNullOrWhiteSpace(lead.Country))        score += 10;
        if (!string.IsNullOrWhiteSpace(lead.TreatmentType))  score += 15;
        if (lead.Message.Length > 50)                         score += 15;
        if (lead.Source is "whatsapp" or "call")              score += 10;
        return Math.Min(score, 100);
    }

    public static bool UpdateLeadStatus(int id, string status)
    {
        lock (_lock)
        {
            var lead = Leads.FirstOrDefault(l => l.Id == id);
            if (lead == null) return false;
            lead.Status = status;
            lead.UpdatedAt = DateTime.UtcNow;
            return true;
        }
    }

    public static LeadNote AddLeadNote(int leadId, AddNoteRequest req)
    {
        lock (_lock)
        {
            var note = new LeadNote { Id = LeadNotes.Count + 1, LeadId = leadId, AuthorName = req.AuthorName, Content = req.Content };
            LeadNotes.Add(note);
            return note;
        }
    }

    public static LeadReminder AddLeadReminder(int leadId, AddReminderRequest req)
    {
        lock (_lock)
        {
            var rem = new LeadReminder { Id = LeadReminders.Count + 1, LeadId = leadId, Message = req.Message, RemindAt = req.RemindAt };
            LeadReminders.Add(rem);
            return rem;
        }
    }

    public static bool AssignLead(int leadId, AssignLeadRequest req)
    {
        lock (_lock)
        {
            var lead = Leads.FirstOrDefault(l => l.Id == leadId);
            var clinic = Clinics.FirstOrDefault(c => c.Id == req.ClinicId);
            if (lead == null || clinic == null) return false;
            lead.AssignedClinicId = req.ClinicId;
            lead.AssignedClinicName = clinic.Name;
            lead.Status = "assigned";
            lead.UpdatedAt = DateTime.UtcNow;
            LeadAssignments.Add(new LeadAssignment { Id = LeadAssignments.Count + 1, LeadId = leadId, ClinicId = req.ClinicId, ClinicName = clinic.Name, AssignmentType = req.AssignmentType, AssignedBy = req.AssignedBy });
            return true;
        }
    }

    // ────────────────────────────────────────────────────────────────
    //  FAVORITES
    // ────────────────────────────────────────────────────────────────
    public static Favorite? ToggleFavorite(int userId, int clinicId)
    {
        lock (_lock)
        {
            var existing = Favorites.FirstOrDefault(f => f.UserId == userId && f.ClinicId == clinicId);
            if (existing != null) { Favorites.Remove(existing); return null; }
            var clinic = Clinics.FirstOrDefault(c => c.Id == clinicId);
            var fav = new Favorite { Id = Favorites.Count + 1, UserId = userId, ClinicId = clinicId, ClinicName = clinic?.Name ?? "" };
            Favorites.Add(fav);
            return fav;
        }
    }
    public static List<Favorite> GetFavorites(int userId) { lock (_lock) { return Favorites.Where(f => f.UserId == userId).ToList(); } }

    // ────────────────────────────────────────────────────────────────
    //  DYNAMIC FIELDS / FILTERS
    // ────────────────────────────────────────────────────────────────
    public static bool UpdateDynamicField(int id, DynamicFieldDefinition updated)
    {
        var f = DynamicFields.FirstOrDefault(x => x.Id == id);
        if (f == null) return false;
        f.Name = updated.Name; f.IsVisible = updated.IsVisible; f.Order = updated.Order; f.Options = updated.Options;
        return true;
    }
    public static bool UpdateFilter(int id, FilterDefinition updated)
    {
        var f = Filters.FirstOrDefault(x => x.Id == id);
        if (f == null) return false;
        f.Name = updated.Name; f.IsVisible = updated.IsVisible; f.Order = updated.Order; f.Options = updated.Options;
        return true;
    }

    // ────────────────────────────────────────────────────────────────
    //  PERFORMANCE SCORING
    // ────────────────────────────────────────────────────────────────
    public static ClinicPerformanceScore GetPerformanceScore(int clinicId)
    {
        var clinic = Clinics.FirstOrDefault(c => c.Id == clinicId);
        var clinicLeads = Leads.Where(l => l.AssignedClinicId == clinicId).ToList();
        var reviews = Reviews.Where(r => r.ClinicId == clinicId).ToList();

        int total = clinicLeads.Count;
        int converted = clinicLeads.Count(l => l.Status == "closed");
        double convRate = total > 0 ? Math.Round((double)converted / total * 100, 1) : 0;
        double satisfaction = reviews.Any() ? Math.Round(reviews.Average(r => r.Rating), 1) : (clinic?.Rating ?? 4.0);
        double closeRate = total > 0 ? Math.Round((double)clinicLeads.Count(l => l.Status is "assigned" or "closed") / total * 100, 1) : 0;
        double avgResponseMin = 60;
        if (clinic?.AvgResponseTime.Contains("dakika") == true && double.TryParse(clinic.AvgResponseTime.Split(' ')[0], out var m)) avgResponseMin = m;
        else if (clinic?.AvgResponseTime.Contains("saat") == true && double.TryParse(clinic.AvgResponseTime.Split(' ')[0], out var h)) avgResponseMin = h * 60;

        int overall = (int)(convRate * 0.3 + satisfaction * 10 + closeRate * 0.2 + Math.Max(0, 100 - avgResponseMin / 6) * 0.2);
        overall = Math.Clamp(overall, 0, 100);

        return new ClinicPerformanceScore
        {
            ClinicId = clinicId, ClinicName = clinic?.Name ?? "",
            ConversionRate = convRate, AvgResponseMinutes = avgResponseMin,
            UserSatisfaction = satisfaction, LeadCloseRate = closeRate,
            TotalLeads = total, TotalPatients = clinic?.TotalPatients ?? 0,
            OverallScore = overall,
            Tier = overall >= 75 ? "premium" : overall >= 50 ? "standard" : "low"
        };
    }

    // ──────────────────────────────────────────────────────────────────
    //  SEED HELPERS
    // ──────────────────────────────────────────────────────────────────
    private static List<Lead> GenerateLeads()
    {
        var now = DateTime.UtcNow;
        return
        [
            new() { Id=1,  AssignedClinicId=1,  AssignedClinicName="Beyaz Gülüş Diş Merkezi",     Name="Ayşe Kaya",     Phone="+49 160 111 2233", Email="ayse@email.com",   Country="Almanya",    TreatmentType="İmplant",         Message="İmplant fiyatı öğrenmek istiyorum. 3 adet diş.", Source="detail",   CreatedAt=now.AddHours(-2),  Status="pending",  LeadScore=85, LeadTier="hot"  },
            new() { Id=2,  AssignedClinicId=3,  AssignedClinicName="Güzellik Akademisi İstanbul",  Name="Fatma Demir",   Phone="+44 7911 222333",  Email="fatma@email.com",  Country="İngiltere",  TreatmentType="Botoks",          Message="Botoks için randevu almak istiyorum.",           Source="listing",  CreatedAt=now.AddHours(-5),  Status="review",   LeadScore=72, LeadTier="hot"  },
            new() { Id=3,  AssignedClinicId=4,  AssignedClinicName="Ankara Göz Merkezi",           Name="Mehmet Yılmaz", Phone="+90 534 333 4455", Email="mehmet@email.com", Country="Türkiye",    TreatmentType="LASIK",           Message="LASIK ameliyatı hakkında bilgi istiyorum.",      Source="detail",   CreatedAt=now.AddDays(-1),   Status="assigned", LeadScore=60, LeadTier="warm" },
            new() { Id=4,  AssignedClinicId=1,  AssignedClinicName="Beyaz Gülüş Diş Merkezi",     Name="Zeynep Arslan", Phone="+31 6 44 555666",  Email="zeynep@email.com", Country="Hollanda",   TreatmentType="Ortodonti",       Message="Invisalign tedavisi için fiyat teklifi.",        Source="detail",   CreatedAt=now.AddDays(-1),   Status="pending",  LeadScore=78, LeadTier="hot"  },
            new() { Id=5,  AssignedClinicId=7,  AssignedClinicName="Estetika Medikal Merkez",     Name="Ali Çelik",     Phone="+43 664 555 6677", Email="ali@email.com",    Country="Avusturya",  TreatmentType="Rinoplasti",      Message="Rinoplasti fiyat teklifi istiyorum.",            Source="listing",  CreatedAt=now.AddDays(-2),   Status="review",   LeadScore=65, LeadTier="warm" },
            new() { Id=6,  AssignedClinicId=6,  AssignedClinicName="SağlıkPlus Aile Kliniği",    Name="Emine Şahin",   Phone="+90 537 666 7788", Email="emine@email.com",  Country="Türkiye",    TreatmentType="Check-Up",        Message="Check-up paketi hakkında bilgi.",                Source="detail",   CreatedAt=now.AddDays(-2),   Status="pending",  LeadScore=40, LeadTier="cold" },
            new() { Id=7,  AssignedClinicId=2,  AssignedClinicName="DentaPlus Ortodonti",         Name="Burak Öztürk",  Phone="+61 4 1234 5678",  Email="burak@email.com",  Country="Avustralya", TreatmentType="Ortodonti",       Message="Invisalign tedavisi süresi ne kadar?",           Source="detail",   CreatedAt=now.AddDays(-3),   Status="closed",   LeadScore=88, LeadTier="hot"  },
            new() { Id=8,  AssignedClinicId=4,  AssignedClinicName="Ankara Göz Merkezi",           Name="Selin Kurt",    Phone="+90 539 888 9900", Email="selin@email.com",  Country="Türkiye",    TreatmentType="Katarakt",        Message="Katarakt ameliyatı için randevu istiyorum.",     Source="detail",   CreatedAt=now.AddDays(-3),   Status="pending",  LeadScore=55, LeadTier="warm" },
            new() { Id=9,  AssignedClinicId=3,  AssignedClinicName="Güzellik Akademisi İstanbul", Name="Hakan Güneş",   Phone="+33 6 12 34 5678", Email="hakan@email.com",  Country="Fransa",     TreatmentType="Lazer Epilasyon", Message="Lazer epilasyon paket fiyatları?",               Source="listing",  CreatedAt=now.AddDays(-4),   Status="review",   LeadScore=68, LeadTier="warm" },
            new() { Id=10, AssignedClinicId=8,  AssignedClinicName="İzmir Diş Hastanesi",          Name="Deniz Aydın",   Phone="+30 210 123 4567", Email="deniz@email.com",  Country="Yunanistan", TreatmentType="Protez",          Message="Protez diş için fiyat öğrenmek istiyorum.",     Source="detail",   CreatedAt=now.AddDays(-5),   Status="pending",  LeadScore=62, LeadTier="warm" },
            new() { Id=11, AssignedClinicId=9,  AssignedClinicName="HairTurkey Saç Ekimi",         Name="James Wilson",  Phone="+44 7712 345678",  Email="james@email.com",  Country="İngiltere",  TreatmentType="FUE Saç Ekimi",   Message="I want to get a hair transplant quote.",         Source="whatsapp", CreatedAt=now.AddDays(-1),   Status="assigned", LeadScore=92, LeadTier="hot"  },
            new() { Id=12, AssignedClinicId=10, AssignedClinicName="Anatolia Ortopedi",            Name="Hans Mueller",  Phone="+49 170 234 5678", Email="hans@email.com",   Country="Almanya",    TreatmentType="Diz Protezi",     Message="Knieprothese - bitte um Angebot.",               Source="form",     CreatedAt=now.AddHours(-8),  Status="review",   LeadScore=80, LeadTier="hot"  },
        ];
    }

    private static Dictionary<int, ClinicStats> GenerateStats() => new()
    {
        [1]  = new() { ClinicId=1,  ClinicName="Beyaz Gülüş Diş Merkezi",     Views=1240, Clicks=387, Leads=42  },
        [2]  = new() { ClinicId=2,  ClinicName="DentaPlus Ortodonti",          Views=890,  Clicks=221, Leads=18  },
        [3]  = new() { ClinicId=3,  ClinicName="Güzellik Akademisi İstanbul",  Views=2110, Clicks=634, Leads=76  },
        [4]  = new() { ClinicId=4,  ClinicName="Ankara Göz Merkezi",           Views=1780, Clicks=512, Leads=61  },
        [5]  = new() { ClinicId=5,  ClinicName="VisionCare Optik & Klinik",    Views=560,  Clicks=134, Leads=12  },
        [6]  = new() { ClinicId=6,  ClinicName="SağlıkPlus Aile Kliniği",      Views=670,  Clicks=189, Leads=23  },
        [7]  = new() { ClinicId=7,  ClinicName="Estetika Medikal Merkez",      Views=1450, Clicks=421, Leads=55  },
        [8]  = new() { ClinicId=8,  ClinicName="İzmir Diş Hastanesi",          Views=980,  Clicks=278, Leads=31  },
        [9]  = new() { ClinicId=9,  ClinicName="HairTurkey Saç Ekimi",         Views=3400, Clicks=1120,Leads=198 },
        [10] = new() { ClinicId=10, ClinicName="Anatolia Ortopedi Hastanesi",  Views=2200, Clicks=680, Leads=87  },
    };

    private static List<Review> GenerateReviews()
    {
        var now = DateTime.UtcNow;
        return
        [
            new() { Id=1,  ClinicId=1,  AuthorName="Maria S.",  AuthorCountry="Almanya",    Rating=5.0, Comment="Harika bir deneyimdi! İmplant işlemim mükemmel geçti.",         TreatmentType="İmplant",       IsVerified=true, Source="platform", CreatedAt=now.AddDays(-10) },
            new() { Id=2,  ClinicId=1,  AuthorName="John D.",   AuthorCountry="İngiltere",  Rating=4.5, Comment="Professional and affordable. Very happy with the results.",      TreatmentType="Diş Beyazlatma",IsVerified=true, Source="google",   CreatedAt=now.AddDays(-20) },
            new() { Id=3,  ClinicId=3,  AuthorName="Sophie L.", AuthorCountry="Fransa",     Rating=5.0, Comment="Best botox I've had. Natural results and very professional.",    TreatmentType="Botoks",        IsVerified=true, Source="platform", CreatedAt=now.AddDays(-5)  },
            new() { Id=4,  ClinicId=3,  AuthorName="Emma W.",   AuthorCountry="İngiltere",  Rating=4.8, Comment="Amazing clinic, staff spoke English fluently. Recommended!",     TreatmentType="Dolgu",         IsVerified=true, Source="google",   CreatedAt=now.AddDays(-15) },
            new() { Id=5,  ClinicId=4,  AuthorName="Ahmet K.",  AuthorCountry="Türkiye",    Rating=4.7, Comment="LASIK ameliyatı çok başarılı oldu. Artık gözlük kullanmıyorum.", TreatmentType="LASIK",         IsVerified=true, Source="platform", CreatedAt=now.AddDays(-8)  },
            new() { Id=6,  ClinicId=9,  AuthorName="Peter M.",  AuthorCountry="İngiltere",  Rating=5.0, Comment="Absolutely incredible. 4000 grafts, natural hairline. Life changing!", TreatmentType="FUE",    IsVerified=true, Source="platform", CreatedAt=now.AddDays(-3)  },
            new() { Id=7,  ClinicId=9,  AuthorName="Lars N.",   AuthorCountry="Norveç",     Rating=4.9, Comment="Very professional team. The result exceeded my expectations.",   TreatmentType="DHI",           IsVerified=true, Source="google",   CreatedAt=now.AddDays(-12) },
            new() { Id=8,  ClinicId=10, AuthorName="Klaus B.",  AuthorCountry="Almanya",    Rating=5.0, Comment="Knieoperation perfekt durchgeführt. Sehr empfehlenswert!",       TreatmentType="Diz Protezi",   IsVerified=true, Source="platform", CreatedAt=now.AddDays(-7)  },
            new() { Id=9,  ClinicId=7,  AuthorName="Leila A.",  AuthorCountry="BAE",        Rating=4.6, Comment="Rhinoplasty results are perfect. The clinic is very luxurious.", TreatmentType="Rinoplasti",    IsVerified=true, Source="platform", CreatedAt=now.AddDays(-18) },
            new() { Id=10, ClinicId=2,  AuthorName="Burak Ö.",  AuthorCountry="Avustralya", Rating=4.5, Comment="Ortodonti tedavisi çok profesyonelce yapıldı.",                  TreatmentType="Ortodonti",     IsVerified=true, Source="platform", CreatedAt=now.AddDays(-30) },
        ];
    }

    private static List<Campaign> GenerateCampaigns()
    {
        var now = DateTime.UtcNow;
        return
        [
            new() { Id=1, ClinicId=1,  ClinicName="Beyaz Gülüş Diş Merkezi",    Title="Bahar İmplant Kampanyası",  Description="Tüm implant tedavilerinde %20 indirim",      DiscountType="percent", DiscountValue=20,  TreatmentType="İmplant",       BadgeText="%20 İndirim", StartDate=now.AddDays(-5), EndDate=now.AddDays(25), IsActive=true },
            new() { Id=2, ClinicId=3,  ClinicName="Güzellik Akademisi İstanbul", Title="Combo Güzellik Paketi",     Description="Botoks + Dolgu birlikte %25 indirimli",      DiscountType="percent", DiscountValue=25,  TreatmentType="Botoks",        BadgeText="Combo -25%",  StartDate=now.AddDays(-2), EndDate=now.AddDays(28), IsActive=true },
            new() { Id=3, ClinicId=9,  ClinicName="HairTurkey Saç Ekimi",        Title="VIP Saç Paketi Haziran",    Description="Uçak + Otel + Operasyon all-inclusive",      DiscountType="fixed",   DiscountValue=300, TreatmentType="FUE Saç Ekimi", BadgeText="-$300",       StartDate=now.AddDays(-1), EndDate=now.AddDays(30), IsActive=true },
            new() { Id=4, ClinicId=10, ClinicName="Anatolia Ortopedi",           Title="Yaz Sağlık Turu Paketi",    Description="Diz protezi + konaklama + transfer paketi",  DiscountType="percent", DiscountValue=15,  TreatmentType="Diz Protezi",   BadgeText="%15 İndirim", StartDate=now,             EndDate=now.AddDays(45), IsActive=true },
        ];
    }

    private static List<BlogPost> GenerateBlogPosts()
    {
        var now = DateTime.UtcNow;
        return
        [
            new() { Id=1, Title="Türkiye'de Diş Tedavisi: Kapsamlı Rehber 2024",   Slug="turkiye-dis-tedavisi-rehber",  Summary="Türkiye'de diş tedavisi yaptırmak için bilmeniz gereken her şey.",  Content="Türkiye, diş tedavisi için Avrupa'nın en popüler destinasyonlarından biri...", CoverImageUrl="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",  Author="Dr. Medtravio Ekibi", Category="treatment", TreatmentType="Diş Tedavisi", Tags=["İmplant","Ortodonti","Türkiye"], ViewCount=4520, IsPublished=true, PublishedAt=now.AddDays(-30) },
            new() { Id=2, Title="İstanbul'da Saç Ekimi: En İyi Klinikler",          Slug="istanbul-sac-ekimi-klinikler", Summary="İstanbul'daki en iyi saç ekimi kliniklerini karşılaştırıyoruz.",      Content="İstanbul, dünya genelinde saç ekimi turizmi için merkez konumuna gelmiştir...", CoverImageUrl="https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80", Author="Medtravio Editör",    Category="city",      City="İstanbul",      TreatmentType="Saç Ekimi",   Tags=["FUE","DHI","İstanbul"],         ViewCount=8930, IsPublished=true, PublishedAt=now.AddDays(-15) },
            new() { Id=3, Title="Medikal Turizm Nedir? Türkiye'yi Seçmenin 7 Nedeni",Slug="medikal-turizm-turkiye",      Summary="Medikal turizm nedir ve neden Türkiye tercih ediliyor?",              Content="Medikal turizm, sağlık hizmeti almak amacıyla ülke dışına seyahat etmek demektir...", CoverImageUrl="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80", Author="Medtravio Ekibi", Category="guide",                           Tags=["Medikal Turizm","Türkiye"],     ViewCount=12450,IsPublished=true, PublishedAt=now.AddDays(-45) },
            new() { Id=4, Title="FUE vs DHI Saç Ekimi: Farklar Neler?",             Slug="fue-dhi-sac-ekimi-fark",       Summary="FUE ve DHI tekniklerini karşılaştırdık.",                             Content="Saç ekimi yöntemleri arasındaki en büyük fark uygulama tekniğindedir...",     CoverImageUrl="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",  Author="Dr. Ahmet Kaya",      Category="treatment", TreatmentType="Saç Ekimi",   Tags=["FUE","DHI","Teknik"],           ViewCount=6720, IsPublished=true, PublishedAt=now.AddDays(-20) },
            new() { Id=5, Title="Antalya'da Diz Protezi: Sağlık Tatili Rehberi",    Slug="antalya-diz-protezi-tatil",    Summary="Diz ameliyatı + tatil kombinasyonu için Antalya rehberi.",           Content="Antalya, hem dünyaca ünlü sahilleri hem de gelişmiş sağlık altyapısıyla...", CoverImageUrl="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",  Author="Medtravio Editör",    Category="city",      City="Antalya",       TreatmentType="Ortopedi",    Tags=["Antalya","Ortopedi"],           ViewCount=3210, IsPublished=true, PublishedAt=now.AddDays(-10) },
        ];
    }

    private static List<TreatmentPage> GenerateTreatmentPages() =>
    [
        new() { Id=1, Treatment="İmplant",     Slug="implant",    Title="Türkiye'de İmplant Tedavisi",          Description="Türkiye'de implant fiyatları ve en iyi klinikler",            Content="İmplant tedavisi...", MinPrice="500",  MaxPrice="1500", Currency="USD", RelatedCities=["İstanbul","Ankara","İzmir"],  IsPublished=true },
        new() { Id=2, Treatment="Saç Ekimi",   Slug="sac-ekimi",  Title="Türkiye'de Saç Ekimi",                  Description="FUE DHI saç ekimi Türkiye fiyatları",                         Content="Saç ekimi...",        MinPrice="1200", MaxPrice="4000", Currency="USD", RelatedCities=["İstanbul"],                  IsPublished=true },
        new() { Id=3, Treatment="Rinoplasti",  Slug="rinoplasti", Title="Türkiye'de Burun Estetiği",             Description="Rinoplasti operasyonu Türkiye fiyatları ve klinikler",        Content="Rinoplasti...",       MinPrice="2000", MaxPrice="6000", Currency="USD", RelatedCities=["İstanbul","Ankara"],         IsPublished=true },
        new() { Id=4, Treatment="LASIK",       Slug="lasik",      Title="Türkiye'de Lazer Göz Ameliyatı",        Description="LASIK LASEK göz ameliyatı Türkiye fiyatları",                 Content="LASIK ameliyatı...",  MinPrice="600",  MaxPrice="2000", Currency="USD", RelatedCities=["Ankara","İstanbul","İzmir"], IsPublished=true },
    ];

    private static List<CityPage> GenerateCityPages() =>
    [
        new() { Id=1, City="İstanbul", Country="Türkiye", Slug="istanbul", Title="İstanbul'da Medikal Turizm",     Description="İstanbul klinik rehberi", Content="İstanbul...", ImageUrl="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80", ClinicCount=4, IsPublished=true },
        new() { Id=2, City="Ankara",   Country="Türkiye", Slug="ankara",   Title="Ankara'da Sağlık Hizmetleri",    Description="Ankara klinik rehberi",   Content="Ankara...",   ImageUrl="https://images.unsplash.com/photo-1553025934-296397db4010?w=800&q=80",  ClinicCount=3, IsPublished=true },
        new() { Id=3, City="İzmir",    Country="Türkiye", Slug="izmir",    Title="İzmir Klinik Rehberi",            Description="İzmir klinik rehberi",    Content="İzmir...",    ImageUrl="https://images.unsplash.com/photo-1547832782-c67d69f5a503?w=800&q=80",  ClinicCount=2, IsPublished=true },
        new() { Id=4, City="Antalya",  Country="Türkiye", Slug="antalya",  Title="Antalya Sağlık Tatili",           Description="Antalya klinik rehberi",  Content="Antalya...",  ImageUrl="https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80",  ClinicCount=1, IsPublished=true },
    ];

    private static List<ClinicPriceRange> GeneratePriceRanges() =>
    [
        new() { Id=1,  ClinicId=1,  TreatmentType="İmplant",          MinPrice=600,  MaxPrice=1800, Currency="USD" },
        new() { Id=2,  ClinicId=1,  TreatmentType="Ortodonti",         MinPrice=800,  MaxPrice=3500, Currency="USD" },
        new() { Id=3,  ClinicId=1,  TreatmentType="Diş Beyazlatma",    MinPrice=200,  MaxPrice=500,  Currency="USD" },
        new() { Id=4,  ClinicId=3,  TreatmentType="Botoks",            MinPrice=200,  MaxPrice=600,  Currency="USD" },
        new() { Id=5,  ClinicId=3,  TreatmentType="Dolgu",             MinPrice=300,  MaxPrice=800,  Currency="USD" },
        new() { Id=6,  ClinicId=3,  TreatmentType="Lazer Epilasyon",   MinPrice=400,  MaxPrice=1200, Currency="USD" },
        new() { Id=7,  ClinicId=4,  TreatmentType="LASIK",             MinPrice=800,  MaxPrice=2200, Currency="USD" },
        new() { Id=8,  ClinicId=4,  TreatmentType="Katarakt",          MinPrice=1000, MaxPrice=2500, Currency="USD" },
        new() { Id=9,  ClinicId=7,  TreatmentType="Rinoplasti",        MinPrice=2500, MaxPrice=6000, Currency="USD" },
        new() { Id=10, ClinicId=7,  TreatmentType="Liposuction",       MinPrice=1500, MaxPrice=4000, Currency="USD" },
        new() { Id=11, ClinicId=9,  TreatmentType="FUE Saç Ekimi",     MinPrice=1400, MaxPrice=3500, Currency="USD" },
        new() { Id=12, ClinicId=9,  TreatmentType="DHI Saç Ekimi",     MinPrice=1800, MaxPrice=4000, Currency="USD" },
        new() { Id=13, ClinicId=10, TreatmentType="Diz Protezi",       MinPrice=4000, MaxPrice=8000, Currency="USD" },
        new() { Id=14, ClinicId=10, TreatmentType="Kalça Protezi",     MinPrice=4500, MaxPrice=9000, Currency="USD" },
    ];

    private static List<CasePhoto> GenerateCasePhotos() =>
    [
        new() { Id=1, ClinicId=9, TreatmentType="FUE Saç Ekimi", BeforeUrl="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80", AfterUrl="https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=400&q=80", Description="3200 greft FUE, 12. ay sonuç" },
        new() { Id=2, ClinicId=1, TreatmentType="İmplant",       BeforeUrl="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80", AfterUrl="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&q=80", Description="4 adet implant, 6. ay sonuç"   },
        new() { Id=3, ClinicId=7, TreatmentType="Rinoplasti",    BeforeUrl="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80", AfterUrl="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80", Description="Rinoplasti, 3. ay sonuç"       },
    ];
}
