namespace test_project_api.Models;

public class DynamicFieldDefinition
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Key { get; set; } = "";
    public string Type { get; set; } = "text"; // text | number | select | boolean
    public List<string>? Options { get; set; }
    public int? CategoryId { get; set; } // null = all categories
    public bool IsVisible { get; set; } = true;
    public int Order { get; set; }
}

public class FilterDefinition
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Key { get; set; } = "";
    public string Type { get; set; } = "select"; // select | multiselect | boolean
    public List<string>? Options { get; set; }
    public int? CategoryId { get; set; }
    public bool IsVisible { get; set; } = true;
    public int Order { get; set; }
}
