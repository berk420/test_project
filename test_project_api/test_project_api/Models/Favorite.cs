namespace test_project_api.Models;

public class Favorite
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class PriceAlert
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public string TreatmentType { get; set; } = "";
    public string AlertType { get; set; } = "price_change"; // price_change | campaign
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
