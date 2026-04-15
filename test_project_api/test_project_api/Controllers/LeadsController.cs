using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;
using test_project_api.Models;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    [HttpPost]
    public IActionResult Create([FromBody] CreateLeadRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.Phone))
            return BadRequest(new { error = "Ad ve telefon zorunludur." });

        if (req.ClinicId.HasValue && !DataStore.Clinics.Any(c => c.Id == req.ClinicId.Value))
            return NotFound(new { error = "Klinik bulunamadı." });

        var lead = DataStore.AddLead(req);
        return Created($"/api/leads/{lead.Id}", lead);
    }
}
