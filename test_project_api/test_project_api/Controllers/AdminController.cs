using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;
using test_project_api.Models;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    [HttpGet("stats")]
    public IActionResult GetOverallStats()
    {
        var allStats = DataStore.AllStats();
        var today = DateTime.UtcNow.Date;

        var result = new OverallStats
        {
            TotalClinics = DataStore.Clinics.Count,
            TotalLeads   = DataStore.Leads.Count,
            TotalViews   = allStats.Sum(s => s.Views),
            TotalClicks  = allStats.Sum(s => s.Clicks),
            NewLeadsToday = DataStore.Leads.Count(l => l.CreatedAt.Date == today),
            LeadsByStatus =
            [
                new() { Status = "new",       Count = DataStore.Leads.Count(l => l.Status == "new") },
                new() { Status = "contacted", Count = DataStore.Leads.Count(l => l.Status == "contacted") },
                new() { Status = "converted", Count = DataStore.Leads.Count(l => l.Status == "converted") },
            ],
            TopClinics = allStats.OrderByDescending(s => s.Leads).Take(5).ToList()
        };

        return Ok(result);
    }

    [HttpGet("clinics")]
    public IActionResult GetClinicsWithStats()
    {
        var result = DataStore.Clinics.Select(c =>
        {
            var s = DataStore.GetStats(c.Id);
            return new
            {
                c.Id, c.Name, c.CategoryName, c.City, c.IsVerified, c.IsFeatured, c.Rating,
                s.Views, s.Clicks, s.Leads
            };
        }).OrderByDescending(x => x.Leads);

        return Ok(result);
    }

    [HttpGet("leads")]
    public IActionResult GetLeads([FromQuery] string? status, [FromQuery] int? clinicId)
    {
        var query = DataStore.Leads.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(l => l.Status == status);
        if (clinicId.HasValue) query = query.Where(l => l.ClinicId == clinicId.Value);
        return Ok(query.OrderByDescending(l => l.CreatedAt).ToList());
    }

    [HttpPatch("leads/{id:int}/status")]
    public IActionResult UpdateLeadStatus(int id, [FromBody] UpdateStatusRequest req)
    {
        if (!DataStore.UpdateLeadStatus(id, req.Status))
            return NotFound();
        return Ok();
    }

    [HttpGet("dynamic-fields")]
    public IActionResult GetDynamicFields() => Ok(DataStore.DynamicFields.OrderBy(f => f.Order));

    [HttpPut("dynamic-fields/{id:int}")]
    public IActionResult UpdateDynamicField(int id, [FromBody] DynamicFieldDefinition updated)
    {
        if (!DataStore.UpdateDynamicField(id, updated)) return NotFound();
        return Ok();
    }

    [HttpGet("filters")]
    public IActionResult GetFilters() => Ok(DataStore.Filters.OrderBy(f => f.Order));

    [HttpPut("filters/{id:int}")]
    public IActionResult UpdateFilter(int id, [FromBody] FilterDefinition updated)
    {
        if (!DataStore.UpdateFilter(id, updated)) return NotFound();
        return Ok();
    }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = "";
}
