namespace test_project_api.Models;

public class ClinicPerformanceScore
{
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public double ConversionRate { get; set; }     // lead -> converted %
    public double AvgResponseMinutes { get; set; } // avg response time in minutes
    public double UserSatisfaction { get; set; }   // 0-5 avg rating
    public double LeadCloseRate { get; set; }      // closed / assigned %
    public int TotalLeads { get; set; }
    public int TotalPatients { get; set; }
    public int OverallScore { get; set; }          // 0-100 composite
    public string Tier { get; set; } = "standard"; // premium | standard | low
    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;
}

public class TrustBoostData
{
    public int ClinicId { get; set; }
    public int PatientsLast30Days { get; set; }
    public List<string> PatientCountries { get; set; } = [];
    public bool IsPlatformVerified { get; set; }
    public string AvgResponseTime { get; set; } = "";
    public int TotalPatients { get; set; }
}

public class CasePhoto
{
    public int Id { get; set; }
    public int ClinicId { get; set; }
    public string TreatmentType { get; set; } = "";
    public string BeforeUrl { get; set; } = "";
    public string AfterUrl { get; set; } = "";
    public string Description { get; set; } = "";
    public bool IsApproved { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
