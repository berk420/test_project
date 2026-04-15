using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;
using test_project_api.Models;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll([FromQuery] int? clinicId, [FromQuery] string? source)
    {
        var query = DataStore.Reviews.Where(r => r.Status == "approved").AsEnumerable();
        if (clinicId.HasValue) query = query.Where(r => r.ClinicId == clinicId.Value);
        if (!string.IsNullOrWhiteSpace(source)) query = query.Where(r => r.Source == source);
        return Ok(query.OrderByDescending(r => r.CreatedAt).ToList());
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateReviewRequest req)
    {
        if (!DataStore.Clinics.Any(c => c.Id == req.ClinicId)) return NotFound();
        var review = new Review
        {
            Id = DataStore.Reviews.Count + 1,
            ClinicId = req.ClinicId, AuthorName = req.AuthorName,
            AuthorCountry = req.AuthorCountry, Rating = req.Rating,
            Comment = req.Comment, TreatmentType = req.TreatmentType,
            Source = "platform", Status = "pending"
        };
        DataStore.Reviews.Add(review);
        return Created("", review);
    }

    [HttpGet("case-photos")]
    public IActionResult GetCasePhotos([FromQuery] int? clinicId, [FromQuery] string? treatment)
    {
        var query = DataStore.CasePhotos.Where(c => c.IsApproved).AsEnumerable();
        if (clinicId.HasValue) query = query.Where(c => c.ClinicId == clinicId.Value);
        if (!string.IsNullOrWhiteSpace(treatment)) query = query.Where(c => c.TreatmentType.Contains(treatment, StringComparison.OrdinalIgnoreCase));
        return Ok(query.ToList());
    }
}
