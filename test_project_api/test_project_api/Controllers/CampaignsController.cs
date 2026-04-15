using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/campaigns")]
public class CampaignsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetActive()
    {
        var now = DateTime.UtcNow;
        var active = DataStore.Campaigns
            .Where(c => c.IsActive && c.StartDate <= now && c.EndDate >= now)
            .OrderByDescending(c => c.StartDate)
            .ToList();
        return Ok(active);
    }

    [HttpGet("clinic/{clinicId:int}")]
    public IActionResult GetByClinic(int clinicId)
        => Ok(DataStore.Campaigns.Where(c => c.ClinicId == clinicId && c.IsActive).ToList());
}
