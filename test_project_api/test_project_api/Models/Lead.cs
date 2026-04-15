namespace test_project_api.Models;

public class Lead
{
    public int Id { get; set; }
    public int? AssignedClinicId { get; set; }
    public string AssignedClinicName { get; set; } = "";
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Country { get; set; } = "";
    public string TreatmentType { get; set; } = "";
    public string Message { get; set; } = "";
    public string Source { get; set; } = "detail"; // detail | listing | whatsapp | chat | call | form | affiliate
    public string? ReferralCode { get; set; }
    public string Status { get; set; } = "pending"; // pending | review | approved | assigned | closed
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public List<string> Tags { get; set; } = [];
    public int? LeadScore { get; set; }
    public string? LeadTier { get; set; } // hot | warm | cold
}

public class CreateLeadRequest
{
    public int? ClinicId { get; set; }
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Country { get; set; } = "";
    public string TreatmentType { get; set; } = "";
    public string Message { get; set; } = "";
    public string Source { get; set; } = "detail";
    public string? ReferralCode { get; set; }
}
