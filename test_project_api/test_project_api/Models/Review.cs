namespace test_project_api.Models;

public class Review
{
    public int Id { get; set; }
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public int? UserId { get; set; }
    public string AuthorName { get; set; } = "";
    public string AuthorCountry { get; set; } = "";
    public double Rating { get; set; }
    public string Comment { get; set; } = "";
    public string TreatmentType { get; set; } = "";
    public bool IsVerified { get; set; }
    public string Source { get; set; } = "platform"; // platform | google
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "approved"; // pending | approved | rejected
}

public class CreateReviewRequest
{
    public int ClinicId { get; set; }
    public string AuthorName { get; set; } = "";
    public string AuthorCountry { get; set; } = "";
    public double Rating { get; set; }
    public string Comment { get; set; } = "";
    public string TreatmentType { get; set; } = "";
}
