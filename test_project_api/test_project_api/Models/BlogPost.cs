namespace test_project_api.Models;

public class BlogPost
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Slug { get; set; } = "";
    public string Summary { get; set; } = "";
    public string Content { get; set; } = "";
    public string CoverImageUrl { get; set; } = "";
    public string Author { get; set; } = "";
    public string Category { get; set; } = ""; // treatment | city | guide
    public string TreatmentType { get; set; } = "";
    public string City { get; set; } = "";
    public List<string> Tags { get; set; } = [];
    public int ViewCount { get; set; }
    public bool IsPublished { get; set; } = true;
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class TreatmentPage
{
    public int Id { get; set; }
    public string Treatment { get; set; } = "";
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Content { get; set; } = "";
    public string MinPrice { get; set; } = "";
    public string MaxPrice { get; set; } = "";
    public string Currency { get; set; } = "USD";
    public List<string> RelatedCities { get; set; } = [];
    public bool IsPublished { get; set; } = true;
}

public class CityPage
{
    public int Id { get; set; }
    public string City { get; set; } = "";
    public string Country { get; set; } = "";
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Content { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public int ClinicCount { get; set; }
    public bool IsPublished { get; set; } = true;
}
