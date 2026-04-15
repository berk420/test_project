using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;
using test_project_api.Models;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    // ── Dashboard Stats ──
    [HttpGet("stats")]
    public IActionResult GetOverallStats()
    {
        var allStats = DataStore.AllStats();
        var today = DateTime.UtcNow.Date;

        var result = new OverallStats
        {
            TotalClinics  = DataStore.Clinics.Count,
            TotalLeads    = DataStore.Leads.Count,
            TotalViews    = allStats.Sum(s => s.Views),
            TotalClicks   = allStats.Sum(s => s.Clicks),
            NewLeadsToday = DataStore.Leads.Count(l => l.CreatedAt.Date == today),
            LeadsByStatus =
            [
                new() { Status = "pending",  Count = DataStore.Leads.Count(l => l.Status == "pending")  },
                new() { Status = "review",   Count = DataStore.Leads.Count(l => l.Status == "review")   },
                new() { Status = "approved", Count = DataStore.Leads.Count(l => l.Status == "approved") },
                new() { Status = "assigned", Count = DataStore.Leads.Count(l => l.Status == "assigned") },
                new() { Status = "closed",   Count = DataStore.Leads.Count(l => l.Status == "closed")   },
            ],
            TopClinics = allStats.OrderByDescending(s => s.Leads).Take(5).ToList()
        };

        return Ok(result);
    }

    // ── Clinics ──
    [HttpGet("clinics")]
    public IActionResult GetClinicsWithStats()
    {
        var result = DataStore.Clinics.Select(c =>
        {
            var s = DataStore.GetStats(c.Id);
            var perf = DataStore.GetPerformanceScore(c.Id);
            return new
            {
                c.Id, c.Name, c.CategoryName, c.City, c.IsVerified, c.IsFeatured, c.IsPremium, c.Badge, c.Rating,
                s.Views, s.Clicks, s.Leads,
                perf.OverallScore, perf.Tier
            };
        }).OrderByDescending(x => x.Leads);
        return Ok(result);
    }

    [HttpPost("clinics")]
    public IActionResult AddClinic([FromBody] Clinic clinic)
    {
        clinic.Id = DataStore.Clinics.Count + 1;
        clinic.CreatedAt = DateTime.UtcNow;
        DataStore.Clinics.Add(clinic);
        return Created($"/api/admin/clinics/{clinic.Id}", clinic);
    }

    [HttpPut("clinics/{id:int}")]
    public IActionResult UpdateClinic(int id, [FromBody] Clinic updated)
    {
        var clinic = DataStore.Clinics.FirstOrDefault(c => c.Id == id);
        if (clinic == null) return NotFound();
        clinic.Name = updated.Name; clinic.Description = updated.Description;
        clinic.IsVerified = updated.IsVerified; clinic.IsFeatured = updated.IsFeatured;
        clinic.IsPremium = updated.IsPremium; clinic.Badge = updated.Badge;
        clinic.Phone = updated.Phone; clinic.Email = updated.Email;
        clinic.MinPrice = updated.MinPrice; clinic.MaxPrice = updated.MaxPrice;
        return Ok(clinic);
    }

    // ── Leads ──
    [HttpGet("leads")]
    public IActionResult GetLeads(
        [FromQuery] string? status,
        [FromQuery] int? clinicId,
        [FromQuery] string? tier,
        [FromQuery] string? country,
        [FromQuery] string? treatmentType)
    {
        var query = DataStore.Leads.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(status))        query = query.Where(l => l.Status == status);
        if (clinicId.HasValue)                          query = query.Where(l => l.AssignedClinicId == clinicId.Value);
        if (!string.IsNullOrWhiteSpace(tier))           query = query.Where(l => l.LeadTier == tier);
        if (!string.IsNullOrWhiteSpace(country))        query = query.Where(l => l.Country == country);
        if (!string.IsNullOrWhiteSpace(treatmentType))  query = query.Where(l => l.TreatmentType == treatmentType);

        var results = query.OrderByDescending(l => l.CreatedAt).Select(l => new
        {
            l.Id, l.Name, l.Phone, l.Email, l.Country, l.TreatmentType, l.Message, l.Source,
            l.Status, l.LeadScore, l.LeadTier, l.Tags, l.CreatedAt, l.UpdatedAt,
            l.AssignedClinicId, l.AssignedClinicName,
            Notes = DataStore.LeadNotes.Where(n => n.LeadId == l.Id).ToList(),
            Reminders = DataStore.LeadReminders.Where(r => r.LeadId == l.Id).ToList(),
        }).ToList();
        return Ok(results);
    }

    [HttpPatch("leads/{id:int}/status")]
    public IActionResult UpdateLeadStatus(int id, [FromBody] UpdateStatusRequest req)
    {
        if (!DataStore.UpdateLeadStatus(id, req.Status)) return NotFound();
        return Ok();
    }

    [HttpPost("leads/{id:int}/assign")]
    public IActionResult AssignLead(int id, [FromBody] AssignLeadRequest req)
    {
        if (!DataStore.AssignLead(id, req)) return NotFound(new { error = "Lead veya klinik bulunamadı." });
        return Ok();
    }

    [HttpPost("leads/{id:int}/notes")]
    public IActionResult AddNote(int id, [FromBody] AddNoteRequest req)
    {
        var lead = DataStore.Leads.FirstOrDefault(l => l.Id == id);
        if (lead == null) return NotFound();
        var note = DataStore.AddLeadNote(id, req);
        return Ok(note);
    }

    [HttpGet("leads/{id:int}/notes")]
    public IActionResult GetNotes(int id) => Ok(DataStore.LeadNotes.Where(n => n.LeadId == id).OrderByDescending(n => n.CreatedAt));

    [HttpPost("leads/{id:int}/reminders")]
    public IActionResult AddReminder(int id, [FromBody] AddReminderRequest req)
    {
        var lead = DataStore.Leads.FirstOrDefault(l => l.Id == id);
        if (lead == null) return NotFound();
        var rem = DataStore.AddLeadReminder(id, req);
        return Ok(rem);
    }

    [HttpPatch("leads/{id:int}/tags")]
    public IActionResult UpdateTags(int id, [FromBody] UpdateTagsRequest req)
    {
        var lead = DataStore.Leads.FirstOrDefault(l => l.Id == id);
        if (lead == null) return NotFound();
        lead.Tags = req.Tags;
        return Ok(lead);
    }

    // ── Dynamic Fields / Filters ──
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

    // ── Performance ──
    [HttpGet("performance")]
    public IActionResult GetAllPerformance()
    {
        var result = DataStore.Clinics.Select(c => DataStore.GetPerformanceScore(c.Id)).OrderByDescending(p => p.OverallScore);
        return Ok(result);
    }

    [HttpGet("performance/{clinicId:int}")]
    public IActionResult GetPerformance(int clinicId) => Ok(DataStore.GetPerformanceScore(clinicId));

    // ── Billing ──
    [HttpGet("billing")]
    public IActionResult GetBilling([FromQuery] string? status, [FromQuery] int? clinicId)
    {
        var query = DataStore.BillingRecords.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(b => b.Status == status);
        if (clinicId.HasValue) query = query.Where(b => b.ClinicId == clinicId.Value);
        return Ok(query.OrderByDescending(b => b.CreatedAt).ToList());
    }

    [HttpPatch("billing/{id:int}/status")]
    public IActionResult UpdateBillingStatus(int id, [FromBody] UpdateStatusRequest req)
    {
        var record = DataStore.BillingRecords.FirstOrDefault(b => b.Id == id);
        if (record == null) return NotFound();
        record.Status = req.Status;
        return Ok(record);
    }

    // ── Campaigns ──
    [HttpGet("campaigns")]
    public IActionResult GetCampaigns() => Ok(DataStore.Campaigns.OrderByDescending(c => c.StartDate));

    [HttpPost("campaigns")]
    public IActionResult CreateCampaign([FromBody] CreateCampaignRequest req)
    {
        var clinic = DataStore.Clinics.FirstOrDefault(c => c.Id == req.ClinicId);
        var campaign = new Campaign
        {
            Id = DataStore.Campaigns.Count + 1,
            ClinicId = req.ClinicId, ClinicName = clinic?.Name ?? "",
            Title = req.Title, Description = req.Description,
            DiscountType = req.DiscountType, DiscountValue = req.DiscountValue,
            TreatmentType = req.TreatmentType, BadgeText = req.BadgeText,
            StartDate = req.StartDate, EndDate = req.EndDate, IsActive = true
        };
        DataStore.Campaigns.Add(campaign);
        return Created($"/api/admin/campaigns/{campaign.Id}", campaign);
    }

    // ── Affiliate ──
    [HttpGet("affiliates")]
    public IActionResult GetAffiliates() => Ok(DataStore.AffiliateLinks);

    [HttpPost("affiliates")]
    public IActionResult CreateAffiliate([FromBody] CreateAffiliateRequest req)
    {
        var link = new AffiliateLink
        {
            Id = DataStore.AffiliateLinks.Count + 1,
            UserId = req.UserId, ReferralCode = req.ReferralCode, PartnerName = req.PartnerName
        };
        DataStore.AffiliateLinks.Add(link);
        return Created("", link);
    }
}

public class UpdateStatusRequest   { public string Status { get; set; } = ""; }
public class UpdateTagsRequest     { public List<string> Tags { get; set; } = []; }
public class CreateAffiliateRequest { public int UserId { get; set; } public string ReferralCode { get; set; } = ""; public string PartnerName { get; set; } = ""; }
