namespace test_project_api.Models;

public class Campaign
{
    public int Id { get; set; }
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string DiscountType { get; set; } = "percent"; // percent | fixed
    public double DiscountValue { get; set; }
    public string TreatmentType { get; set; } = "";
    public string BadgeText { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    public string BannerUrl { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateCampaignRequest
{
    public int ClinicId { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string DiscountType { get; set; } = "percent";
    public double DiscountValue { get; set; }
    public string TreatmentType { get; set; } = "";
    public string BadgeText { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
