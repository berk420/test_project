using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/blog")]
public class BlogController : ControllerBase
{
    [HttpGet]
    public IActionResult GetPosts(
        [FromQuery] string? category,
        [FromQuery] string? tag,
        [FromQuery] string? city,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 9)
    {
        var query = DataStore.BlogPosts.Where(p => p.IsPublished).AsEnumerable();
        if (!string.IsNullOrWhiteSpace(category)) query = query.Where(p => p.Category == category);
        if (!string.IsNullOrWhiteSpace(tag))      query = query.Where(p => p.Tags.Any(t => t.Contains(tag, StringComparison.OrdinalIgnoreCase)));
        if (!string.IsNullOrWhiteSpace(city))     query = query.Where(p => p.City == city);

        var ordered = query.OrderByDescending(p => p.PublishedAt).ToList();
        var total = ordered.Count;
        var items = ordered.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("{slug}")]
    public IActionResult GetPost(string slug)
    {
        var post = DataStore.BlogPosts.FirstOrDefault(p => p.Slug == slug && p.IsPublished);
        if (post == null) return NotFound();
        post.ViewCount++;
        return Ok(post);
    }

    [HttpGet("treatments")]
    public IActionResult GetTreatmentPages() => Ok(DataStore.TreatmentPages.Where(t => t.IsPublished));

    [HttpGet("treatments/{slug}")]
    public IActionResult GetTreatmentPage(string slug)
    {
        var page = DataStore.TreatmentPages.FirstOrDefault(t => t.Slug == slug && t.IsPublished);
        if (page == null) return NotFound();
        return Ok(page);
    }

    [HttpGet("cities")]
    public IActionResult GetCityPages() => Ok(DataStore.CityPages.Where(c => c.IsPublished));

    [HttpGet("cities/{slug}")]
    public IActionResult GetCityPage(string slug)
    {
        var page = DataStore.CityPages.FirstOrDefault(c => c.Slug == slug && c.IsPublished);
        if (page == null) return NotFound();
        return Ok(page);
    }
}
