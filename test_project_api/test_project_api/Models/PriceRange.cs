namespace test_project_api.Models;

public class ClinicPriceRange
{
    public int Id { get; set; }
    public int ClinicId { get; set; }
    public string TreatmentType { get; set; } = "";
    public double MinPrice { get; set; }
    public double MaxPrice { get; set; }
    public string Currency { get; set; } = "USD";
    public bool IsActive { get; set; } = true;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class PriceEstimationRequest
{
    public string TreatmentType { get; set; } = "";
    public string City { get; set; } = "";
    public string Country { get; set; } = "";
    public double? Budget { get; set; }
    public string Currency { get; set; } = "USD";
}

public class PriceEstimationResult
{
    public string TreatmentType { get; set; } = "";
    public double EstimatedMin { get; set; }
    public double EstimatedMax { get; set; }
    public string Currency { get; set; } = "USD";
    public string Note { get; set; } = "";
    public List<ClinicPriceMatch> MatchingClinics { get; set; } = [];
}

public class ClinicPriceMatch
{
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public string City { get; set; } = "";
    public double MinPrice { get; set; }
    public double MaxPrice { get; set; }
    public string Currency { get; set; } = "USD";
}
