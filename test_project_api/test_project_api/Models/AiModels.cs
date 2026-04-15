namespace test_project_api.Models;

public class AiMatchRequest
{
    public string Complaint { get; set; } = "";
    public string? Budget { get; set; }
    public string? Country { get; set; }
    public string? PreferredCity { get; set; }
    public string? TreatmentType { get; set; }
    public List<string> Answers { get; set; } = [];
}

public class AiMatchResult
{
    public string DetectedCategory { get; set; } = "";
    public string SuggestedTreatment { get; set; } = "";
    public string PriceRange { get; set; } = "";
    public string Note { get; set; } = "";
    public List<ClinicMatchItem> MatchedClinics { get; set; } = [];
    public List<string> DynamicQuestions { get; set; } = [];
}

public class ClinicMatchItem
{
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public string City { get; set; } = "";
    public double Rating { get; set; }
    public string ImageUrl { get; set; } = "";
    public int MatchScore { get; set; } // 0-100
    public string MatchReason { get; set; } = "";
    public string Slug { get; set; } = "";
}

public class SmartMatchScore
{
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public int Score { get; set; } // 0-100
    public string ScoreLabel { get; set; } = ""; // e.g. "Bu klinik sizin için %87 uygun"
    public List<string> MatchFactors { get; set; } = [];
}

public class OnboardingData
{
    public string TreatmentType { get; set; } = "";
    public string Budget { get; set; } = "";
    public string Country { get; set; } = "";
    public string TimeFrame { get; set; } = ""; // asap | 1month | 3months | flexible
    public string PreferredCity { get; set; } = "";
    public string Language { get; set; } = "tr";
}

public class SecondOpinionRequest
{
    public int SelectedClinicId { get; set; }
    public string TreatmentType { get; set; } = "";
    public string? Country { get; set; }
    public string? Budget { get; set; }
}

public class SecondOpinionResult
{
    public string Message { get; set; } = "Alternatif görüş almak ister misiniz?";
    public List<ClinicMatchItem> AlternativeClinics { get; set; } = [];
}
