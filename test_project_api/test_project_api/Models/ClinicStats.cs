namespace test_project_api.Models;

public class ClinicStats
{
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public int Views { get; set; }
    public int Clicks { get; set; }
    public int Leads { get; set; }
}

public class OverallStats
{
    public int TotalClinics { get; set; }
    public int TotalLeads { get; set; }
    public int TotalViews { get; set; }
    public int TotalClicks { get; set; }
    public int NewLeadsToday { get; set; }
    public List<LeadStatusCount> LeadsByStatus { get; set; } = [];
    public List<ClinicStats> TopClinics { get; set; } = [];
}

public class LeadStatusCount
{
    public string Status { get; set; } = "";
    public int Count { get; set; }
}
