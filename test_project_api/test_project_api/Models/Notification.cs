namespace test_project_api.Models;

public class Notification
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public int? ClinicId { get; set; }
    public string RecipientType { get; set; } = "user"; // user | clinic | admin
    public string Type { get; set; } = "info"; // info | lead | campaign | price_alert | reminder
    public string Title { get; set; } = "";
    public string Message { get; set; } = "";
    public string Channel { get; set; } = "panel"; // email | sms | panel
    public bool IsRead { get; set; }
    public string? ActionUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class AffiliateLink
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ReferralCode { get; set; } = "";
    public string PartnerName { get; set; } = "";
    public int TotalClicks { get; set; }
    public int TotalLeads { get; set; }
    public double TotalEarnings { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class BillingRecord
{
    public int Id { get; set; }
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public int LeadId { get; set; }
    public double Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Type { get; set; } = "lead_fee"; // lead_fee | commission | subscription
    public string Status { get; set; } = "pending"; // pending | paid | cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
