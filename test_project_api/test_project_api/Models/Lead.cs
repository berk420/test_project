namespace test_project_api.Models;

public class Lead
{
    public int Id { get; set; }
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Message { get; set; } = "";
    public string Source { get; set; } = "detail";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "new"; // new | contacted | converted
}

public class CreateLeadRequest
{
    public int ClinicId { get; set; }
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Message { get; set; } = "";
    public string Source { get; set; } = "detail";
}
