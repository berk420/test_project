using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;
using test_project_api.Models;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    // ── Smart Matching Engine ──
    [HttpPost("match")]
    public IActionResult Match([FromBody] AiMatchRequest req)
    {
        var complaint = req.Complaint.ToLower();

        // Category detection
        string category = DetectCategory(complaint, req.TreatmentType);
        string treatment = req.TreatmentType ?? DetectTreatment(complaint, category);

        // Dynamic questions based on category
        var questions = GetDynamicQuestions(category, req.Answers.Count);

        // If not enough info yet, return questions first
        if (req.Answers.Count < 2 && questions.Any())
        {
            return Ok(new AiMatchResult
            {
                DetectedCategory = category,
                SuggestedTreatment = treatment,
                DynamicQuestions = questions,
                Note = "AI teşhis koymaz. Yönlendirme amaçlıdır.",
                MatchedClinics = []
            });
        }

        // Filter and rank clinics
        var clinics = DataStore.Clinics.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(req.PreferredCity))
            clinics = clinics.Where(c => c.City == req.PreferredCity);

        // Match to category
        var catId = DataStore.Categories.FirstOrDefault(c =>
            c.Name.Contains(category, StringComparison.OrdinalIgnoreCase) ||
            category.Contains(c.Name, StringComparison.OrdinalIgnoreCase))?.Id;
        if (catId.HasValue)
            clinics = clinics.Where(c => c.CategoryId == catId.Value);

        var matched = clinics.Select(c => new ClinicMatchItem
        {
            ClinicId = c.Id,
            ClinicName = c.Name,
            City = c.City,
            Rating = c.Rating,
            ImageUrl = c.ImageUrl,
            Slug = c.Slug,
            MatchScore = CalculateMatchScore(c, req),
            MatchReason = GetMatchReason(c, req)
        })
        .OrderByDescending(m => m.MatchScore)
        .Take(5)
        .ToList();

        // Price estimation
        var ranges = DataStore.PriceRanges.Where(p =>
            p.TreatmentType.Contains(treatment, StringComparison.OrdinalIgnoreCase) ||
            treatment.Contains(p.TreatmentType, StringComparison.OrdinalIgnoreCase)).ToList();
        string priceRange = ranges.Any()
            ? $"{ranges.Min(r => r.MinPrice):0} – {ranges.Max(r => r.MaxPrice):0} USD"
            : "Fiyat bilgisi için klinikle iletişime geçin";

        return Ok(new AiMatchResult
        {
            DetectedCategory = category,
            SuggestedTreatment = treatment,
            PriceRange = priceRange,
            Note = "AI teşhis koymaz. Sonuçlar yönlendirme amaçlıdır.",
            MatchedClinics = matched,
            DynamicQuestions = []
        });
    }

    // ── Smart Match Score for single clinic ──
    [HttpPost("match-score")]
    public IActionResult GetMatchScore([FromBody] OnboardingData onboarding)
    {
        var scores = DataStore.Clinics.Select(c => new SmartMatchScore
        {
            ClinicId = c.Id,
            ClinicName = c.Name,
            Score = CalculateOnboardingScore(c, onboarding),
            MatchFactors = GetMatchFactors(c, onboarding)
        })
        .OrderByDescending(s => s.Score)
        .ToList();

        foreach (var s in scores)
            s.ScoreLabel = $"Bu klinik sizin için %{s.Score} uygun";

        return Ok(scores);
    }

    // ── Price Estimation ──
    [HttpPost("price-estimate")]
    public IActionResult EstimatePrice([FromBody] PriceEstimationRequest req)
    {
        var ranges = DataStore.PriceRanges.Where(p =>
            p.TreatmentType.Contains(req.TreatmentType, StringComparison.OrdinalIgnoreCase) ||
            req.TreatmentType.Contains(p.TreatmentType, StringComparison.OrdinalIgnoreCase)).ToList();

        if (!ranges.Any())
            return Ok(new PriceEstimationResult { TreatmentType = req.TreatmentType, Note = "Bu tedavi için fiyat bilgisi bulunamadı.", Currency = "USD" });

        var clinics = DataStore.Clinics;
        var matches = ranges.Select(r =>
        {
            var clinic = clinics.FirstOrDefault(c => c.Id == r.ClinicId);
            return new ClinicPriceMatch
            {
                ClinicId = r.ClinicId, ClinicName = clinic?.Name ?? "",
                City = clinic?.City ?? "", MinPrice = r.MinPrice, MaxPrice = r.MaxPrice, Currency = r.Currency
            };
        }).ToList();

        if (!string.IsNullOrWhiteSpace(req.City))
            matches = matches.Where(m => m.City == req.City).ToList();

        return Ok(new PriceEstimationResult
        {
            TreatmentType = req.TreatmentType,
            EstimatedMin = matches.Any() ? matches.Min(m => m.MinPrice) : 0,
            EstimatedMax = matches.Any() ? matches.Max(m => m.MaxPrice) : 0,
            Currency = "USD",
            Note = "Tahmini fiyat aralığıdır. Kesin fiyat için klinikle iletişime geçin.",
            MatchingClinics = matches
        });
    }

    // ── Second Opinion ──
    [HttpPost("second-opinion")]
    public IActionResult SecondOpinion([FromBody] SecondOpinionRequest req)
    {
        var selectedClinic = DataStore.Clinics.FirstOrDefault(c => c.Id == req.SelectedClinicId);
        if (selectedClinic == null) return NotFound();

        var alternatives = DataStore.Clinics
            .Where(c => c.Id != req.SelectedClinicId && c.CategoryId == selectedClinic.CategoryId)
            .Select(c => new ClinicMatchItem
            {
                ClinicId = c.Id,
                ClinicName = c.Name,
                City = c.City,
                Rating = c.Rating,
                ImageUrl = c.ImageUrl,
                Slug = c.Slug,
                MatchScore = new Random().Next(72, 96),
                MatchReason = $"Benzer hizmetler, {c.City}'de konumlu"
            })
            .OrderByDescending(c => c.MatchScore)
            .Take(3)
            .ToList();

        return Ok(new SecondOpinionResult
        {
            Message = "Alternatif görüş almak ister misiniz?",
            AlternativeClinics = alternatives
        });
    }

    // ── Onboarding flow ──
    [HttpPost("onboarding")]
    public IActionResult ProcessOnboarding([FromBody] OnboardingData data)
    {
        var result = DataStore.Clinics.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(data.PreferredCity))
            result = result.Where(c => c.City == data.PreferredCity);

        if (!string.IsNullOrWhiteSpace(data.TreatmentType))
        {
            var lower = data.TreatmentType.ToLower();
            result = result.Where(c =>
                c.Services.Any(s => s.Contains(data.TreatmentType, StringComparison.OrdinalIgnoreCase)) ||
                c.Tags.Any(t => t.Contains(data.TreatmentType, StringComparison.OrdinalIgnoreCase)) ||
                c.CategoryName.Contains(data.TreatmentType, StringComparison.OrdinalIgnoreCase));
        }

        var ranked = result.Select(c => new ClinicMatchItem
        {
            ClinicId = c.Id, ClinicName = c.Name, City = c.City,
            Rating = c.Rating, ImageUrl = c.ImageUrl, Slug = c.Slug,
            MatchScore = CalculateOnboardingScore(c, data),
            MatchReason = GetMatchFactors(c, data).FirstOrDefault() ?? ""
        })
        .OrderByDescending(c => c.MatchScore)
        .Take(9)
        .ToList();

        return Ok(new { clinics = ranked, total = ranked.Count });
    }

    // ── Helpers ──
    private static string DetectCategory(string text, string? given)
    {
        if (!string.IsNullOrWhiteSpace(given)) return given;
        if (text.Contains("diş") || text.Contains("implant") || text.Contains("ortodonti")) return "Diş";
        if (text.Contains("saç") || text.Contains("hair") || text.Contains("fue") || text.Contains("dhi")) return "Saç Ekimi";
        if (text.Contains("göz") || text.Contains("lasik") || text.Contains("katarakt")) return "Göz";
        if (text.Contains("estetik") || text.Contains("botoks") || text.Contains("dolgu") || text.Contains("rinoplasti")) return "Estetik";
        if (text.Contains("diz") || text.Contains("kalça") || text.Contains("ortopedi") || text.Contains("protez")) return "Ortopedi";
        return "Genel Sağlık";
    }

    private static string DetectTreatment(string text, string category)
    {
        if (text.Contains("implant")) return "İmplant";
        if (text.Contains("ortodonti") || text.Contains("invisalign")) return "Ortodonti";
        if (text.Contains("saç ekimi") || text.Contains("fue")) return "FUE Saç Ekimi";
        if (text.Contains("dhi")) return "DHI Saç Ekimi";
        if (text.Contains("lasik")) return "LASIK";
        if (text.Contains("botoks")) return "Botoks";
        if (text.Contains("rinoplasti") || text.Contains("burun")) return "Rinoplasti";
        if (text.Contains("diz")) return "Diz Protezi";
        return category;
    }

    private static List<string> GetDynamicQuestions(string category, int answered)
    {
        var all = category switch
        {
            "Saç Ekimi" => new List<string> { "Saç dökülmenin ne kadar süredir devam ediyor?", "Daha önce saç ekimi yaptırdınız mı?", "Bütçeniz nedir?", "Ne zaman gelmek istiyorsunuz?" },
            "Diş"       => new List<string> { "Hangi diş problemini yaşıyorsunuz?", "Daha önce diş tedavisi gördünüz mü?", "Bütçeniz nedir?", "Hangi şehri tercih edersiniz?" },
            "Estetik"   => new List<string> { "Hangi bölgede işlem yaptırmak istiyorsunuz?", "Ameliyat mı yoksa non-cerrahi mi tercih edersiniz?", "Bütçeniz nedir?", "Ne zaman gelmek istiyorsunuz?" },
            "Göz"       => new List<string> { "Gözlük veya lens kullanıyor musunuz?", "Göz numaranız nedir?", "Hangi tedaviyi düşünüyorsunuz?" },
            _           => new List<string> { "Şikayetinizi daha ayrıntılı anlatabilir misiniz?", "Ne zamandır bu şikayeti yaşıyorsunuz?", "Bütçeniz nedir?" }
        };
        return all.Skip(answered).Take(2).ToList();
    }

    private static int CalculateMatchScore(Clinic c, AiMatchRequest req)
    {
        int score = 50;
        if (c.IsVerified) score += 10;
        if (c.IsPremium) score += 10;
        if (c.Rating >= 4.7) score += 15;
        else if (c.Rating >= 4.5) score += 10;
        if (!string.IsNullOrWhiteSpace(req.Country) && c.PatientCountries.Any(p => p.Contains(req.Country, StringComparison.OrdinalIgnoreCase))) score += 10;
        if (!string.IsNullOrWhiteSpace(req.PreferredCity) && c.City == req.PreferredCity) score += 5;
        return Math.Min(score, 99);
    }

    private static int CalculateOnboardingScore(Clinic c, OnboardingData d)
    {
        int score = 50;
        if (c.IsVerified) score += 8;
        if (c.IsPremium) score += 10;
        if (c.Rating >= 4.7) score += 12;
        else if (c.Rating >= 4.5) score += 8;
        if (!string.IsNullOrWhiteSpace(d.PreferredCity) && c.City == d.PreferredCity) score += 10;
        if (!string.IsNullOrWhiteSpace(d.Country) && c.PatientCountries.Any(p => p.Contains(d.Country, StringComparison.OrdinalIgnoreCase))) score += 8;
        if (!string.IsNullOrWhiteSpace(d.TreatmentType) && c.Services.Any(s => s.Contains(d.TreatmentType, StringComparison.OrdinalIgnoreCase))) score += 12;
        return Math.Min(score, 99);
    }

    private static List<string> GetMatchFactors(Clinic c, OnboardingData d)
    {
        var factors = new List<string>();
        if (c.IsVerified) factors.Add("Platform tarafından doğrulandı");
        if (c.IsPremium) factors.Add("Premium klinik");
        if (c.Rating >= 4.7) factors.Add($"{c.Rating} yıldız – yüksek puan");
        if (!string.IsNullOrWhiteSpace(d.Country) && c.PatientCountries.Any(p => p.Contains(d.Country, StringComparison.OrdinalIgnoreCase)))
            factors.Add($"{d.Country}'den hastaları var");
        if (!string.IsNullOrWhiteSpace(d.PreferredCity) && c.City == d.PreferredCity)
            factors.Add($"{d.PreferredCity}'de konumlu");
        return factors;
    }

    private static string GetMatchReason(Clinic c, AiMatchRequest req) =>
        c.IsVerified ? "Doğrulanmış klinik" : c.Rating >= 4.7 ? "Yüksek puan" : "İstediğiniz tedaviyi sunuyor";
}
