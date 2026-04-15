namespace test_project_api.Models;

public class Clinic
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = "";
    public string City { get; set; } = "";
    public string District { get; set; } = "";
    public string Description { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Website { get; set; }
    public string Address { get; set; } = "";
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public string ImageUrl { get; set; } = "";
    public List<string> Tags { get; set; } = [];
    public List<string> Services { get; set; } = [];
    public Dictionary<string, string> DynamicFields { get; set; } = [];
    public bool IsVerified { get; set; }
    public bool IsFeatured { get; set; }
}
