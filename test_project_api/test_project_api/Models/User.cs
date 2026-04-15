namespace test_project_api.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Provider { get; set; } = "email"; // email | google | apple
    public string Role { get; set; } = "user"; // user | clinic | admin | sales | operation
    public string AvatarUrl { get; set; } = "";
    public string Country { get; set; } = "";
    public string Language { get; set; } = "tr";
    public bool IsVerified { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
}

public class RegisterRequest
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Password { get; set; } = "";
}

public class LoginRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}

public class UpdateProfileRequest
{
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Country { get; set; } = "";
    public string Language { get; set; } = "tr";
}
