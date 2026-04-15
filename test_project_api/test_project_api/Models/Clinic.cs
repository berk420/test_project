namespace test_project_api.Models;

public class Clinic
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = "";
    public string City { get; set; } = "";
    public string Country { get; set; } = "Türkiye";
    public string District { get; set; } = "";
    public string Description { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Website { get; set; }
    public string? WhatsApp { get; set; }
    public string Address { get; set; } = "";
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public string ImageUrl { get; set; } = "";
    public List<string> GalleryUrls { get; set; } = [];
    public string? VideoUrl { get; set; }
    public List<string> Tags { get; set; } = [];
    public List<string> Services { get; set; } = [];
    public Dictionary<string, string> DynamicFields { get; set; } = [];
    public bool IsVerified { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsPremium { get; set; }
    public string Badge { get; set; } = ""; // popular | premium | verified | fast-response
    public string AvgResponseTime { get; set; } = "2 saat";
    public int TotalPatients { get; set; }
    public int PatientsLast30Days { get; set; }
    public List<string> PatientCountries { get; set; } = [];
    public double MinPrice { get; set; }
    public double MaxPrice { get; set; }
    public string PriceCurrency { get; set; } = "USD";
    public double Lat { get; set; }
    public double Lng { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
