using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;
using test_project_api.Models;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest req)
    {
        if (DataStore.Users.Any(u => u.Email == req.Email))
            return BadRequest(new { error = "Bu e-posta zaten kullanımda." });

        var user = new User
        {
            Id = DataStore.Users.Count + 1,
            Name = req.Name, Email = req.Email, Phone = req.Phone,
            PasswordHash = req.Password, // in prod: hash
            Role = "user", IsVerified = false, CreatedAt = DateTime.UtcNow
        };
        DataStore.Users.Add(user);
        return Created("", new { user.Id, user.Name, user.Email, user.Role });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        var user = DataStore.Users.FirstOrDefault(u => u.Email == req.Email && u.PasswordHash == req.Password);
        if (user == null) return Unauthorized(new { error = "Geçersiz e-posta veya şifre." });
        user.LastLoginAt = DateTime.UtcNow;
        return Ok(new { user.Id, user.Name, user.Email, user.Role, user.Country, user.Language, token = $"demo-token-{user.Id}" });
    }

    [HttpGet("{id:int}")]
    public IActionResult GetProfile(int id)
    {
        var user = DataStore.Users.FirstOrDefault(u => u.Id == id);
        if (user == null) return NotFound();
        var leads = DataStore.Leads.Where(l => l.Phone == user.Phone || l.Email == user.Email).ToList();
        var favs = DataStore.GetFavorites(id);
        return Ok(new { user.Id, user.Name, user.Email, user.Phone, user.Country, user.Language, user.Role, user.IsVerified, user.CreatedAt, LeadCount = leads.Count, FavoriteCount = favs.Count });
    }

    [HttpPut("{id:int}")]
    public IActionResult UpdateProfile(int id, [FromBody] UpdateProfileRequest req)
    {
        var user = DataStore.Users.FirstOrDefault(u => u.Id == id);
        if (user == null) return NotFound();
        user.Name = req.Name; user.Phone = req.Phone; user.Country = req.Country; user.Language = req.Language;
        return Ok(user);
    }

    // ── Favorites ──
    [HttpGet("{id:int}/favorites")]
    public IActionResult GetFavorites(int id)
    {
        var favs = DataStore.GetFavorites(id);
        var clinics = favs.Select(f => DataStore.Clinics.FirstOrDefault(c => c.Id == f.ClinicId)).Where(c => c != null).ToList();
        return Ok(clinics);
    }

    [HttpPost("{id:int}/favorites/{clinicId:int}")]
    public IActionResult ToggleFavorite(int id, int clinicId)
    {
        var result = DataStore.ToggleFavorite(id, clinicId);
        return Ok(new { added = result != null, favorite = result });
    }

    // ── Price Alerts ──
    [HttpGet("{id:int}/alerts")]
    public IActionResult GetAlerts(int id) => Ok(DataStore.PriceAlerts.Where(a => a.UserId == id));

    [HttpPost("{id:int}/alerts")]
    public IActionResult AddAlert(int id, [FromBody] PriceAlert alert)
    {
        alert.Id = DataStore.PriceAlerts.Count + 1;
        alert.UserId = id;
        DataStore.PriceAlerts.Add(alert);
        return Created("", alert);
    }

    // ── User Leads history ──
    [HttpGet("{id:int}/leads")]
    public IActionResult GetLeadHistory(int id)
    {
        var user = DataStore.Users.FirstOrDefault(u => u.Id == id);
        if (user == null) return NotFound();
        var leads = DataStore.Leads.Where(l => l.Email == user.Email || l.Phone == user.Phone)
            .OrderByDescending(l => l.CreatedAt).ToList();
        return Ok(leads);
    }

    // ── Notifications ──
    [HttpGet("{id:int}/notifications")]
    public IActionResult GetNotifications(int id)
        => Ok(DataStore.Notifications.Where(n => n.UserId == id).OrderByDescending(n => n.CreatedAt));

    [HttpPatch("{id:int}/notifications/{notifId:int}/read")]
    public IActionResult MarkRead(int id, int notifId)
    {
        var n = DataStore.Notifications.FirstOrDefault(n => n.Id == notifId && n.UserId == id);
        if (n == null) return NotFound();
        n.IsRead = true;
        return Ok();
    }
}
