using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;
using test_project_api.Models;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/clinic-panel")]
public class ClinicPanelController : ControllerBase
{
    [HttpGet("{clinicId:int}/dashboard")]
    public IActionResult GetDashboard(int clinicId)
    {
        var clinic = DataStore.Clinics.FirstOrDefault(c => c.Id == clinicId);
        if (clinic == null) return NotFound();
        var stats = DataStore.GetStats(clinicId);
        var leads = DataStore.Leads.Where(l => l.AssignedClinicId == clinicId).ToList();
        var perf = DataStore.GetPerformanceScore(clinicId);
        var campaigns = DataStore.Campaigns.Where(c => c.ClinicId == clinicId && c.IsActive).ToList();
        var reviews = DataStore.Reviews.Where(r => r.ClinicId == clinicId).ToList();
        return Ok(new
        {
            clinic, stats, perf,
            leadsByStatus = new
            {
                pending  = leads.Count(l => l.Status == "pending"),
                review   = leads.Count(l => l.Status == "review"),
                assigned = leads.Count(l => l.Status == "assigned"),
                closed   = leads.Count(l => l.Status == "closed"),
            },
            recentLeads = leads.OrderByDescending(l => l.CreatedAt).Take(5).ToList(),
            campaigns,
            reviewCount = reviews.Count,
            avgRating   = reviews.Any() ? Math.Round(reviews.Average(r => r.Rating), 1) : (double)clinic.Rating
        });
    }

    [HttpGet("{clinicId:int}/leads")]
    public IActionResult GetLeads(int clinicId, [FromQuery] string? status)
    {
        var query = DataStore.Leads.Where(l => l.AssignedClinicId == clinicId).AsEnumerable();
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(l => l.Status == status);
        return Ok(query.OrderByDescending(l => l.CreatedAt).ToList());
    }

    [HttpPut("{clinicId:int}/profile")]
    public IActionResult UpdateProfile(int clinicId, [FromBody] Clinic updated)
    {
        var clinic = DataStore.Clinics.FirstOrDefault(c => c.Id == clinicId);
        if (clinic == null) return NotFound();
        clinic.Description = updated.Description; clinic.Phone = updated.Phone;
        clinic.Email = updated.Email; clinic.Website = updated.Website;
        clinic.WhatsApp = updated.WhatsApp; clinic.Address = updated.Address;
        clinic.Services = updated.Services; clinic.Tags = updated.Tags;
        clinic.GalleryUrls = updated.GalleryUrls; clinic.VideoUrl = updated.VideoUrl;
        clinic.MinPrice = updated.MinPrice; clinic.MaxPrice = updated.MaxPrice;
        return Ok(clinic);
    }

    [HttpGet("{clinicId:int}/price-ranges")]
    public IActionResult GetPriceRanges(int clinicId)
        => Ok(DataStore.PriceRanges.Where(p => p.ClinicId == clinicId).ToList());

    [HttpPost("{clinicId:int}/price-ranges")]
    public IActionResult AddPriceRange(int clinicId, [FromBody] ClinicPriceRange range)
    {
        range.Id = DataStore.PriceRanges.Count + 1;
        range.ClinicId = clinicId; range.UpdatedAt = DateTime.UtcNow;
        DataStore.PriceRanges.Add(range);
        return Created("", range);
    }
}
