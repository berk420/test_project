using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;
using test_project_api.Models;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClinicsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll(
        [FromQuery] string? search,
        [FromQuery] int? categoryId,
        [FromQuery] string? city,
        [FromQuery] string? sigorta,
        [FromQuery] string? randevu,
        [FromQuery] bool? verified,
        [FromQuery] bool? featured,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 9)
    {
        var query = DataStore.Clinics.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c =>
                c.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                c.Description.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                c.Tags.Any(t => t.Contains(search, StringComparison.OrdinalIgnoreCase)));

        if (categoryId.HasValue)
            query = query.Where(c => c.CategoryId == categoryId.Value);

        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(c => c.City == city);

        if (!string.IsNullOrWhiteSpace(sigorta))
            query = query.Where(c => c.DynamicFields.TryGetValue("Sigorta", out var v) && v == sigorta);

        if (!string.IsNullOrWhiteSpace(randevu))
            query = query.Where(c => c.DynamicFields.TryGetValue("Randevu", out var v) && v == randevu);

        if (verified.HasValue)
            query = query.Where(c => c.IsVerified == verified.Value);

        if (featured.HasValue)
            query = query.Where(c => c.IsFeatured == featured.Value);

        var ordered = query.OrderByDescending(c => c.IsFeatured).ThenByDescending(c => c.Rating).ToList();
        var total = ordered.Count;
        var items = ordered.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("{slug}")]
    public IActionResult GetBySlug(string slug)
    {
        var clinic = DataStore.Clinics.FirstOrDefault(c => c.Slug == slug);
        if (clinic == null) return NotFound();
        DataStore.IncrementView(clinic.Id);
        return Ok(clinic);
    }

    [HttpPost("{id:int}/click")]
    public IActionResult TrackClick(int id)
    {
        if (!DataStore.Clinics.Any(c => c.Id == id)) return NotFound();
        DataStore.IncrementClick(id);
        return Ok();
    }
}
