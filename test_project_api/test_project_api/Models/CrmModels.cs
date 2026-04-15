namespace test_project_api.Models;

// Extended Lead with full lifecycle
public class LeadNote
{
    public int Id { get; set; }
    public int LeadId { get; set; }
    public string AuthorName { get; set; } = "";
    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class LeadTag
{
    public int Id { get; set; }
    public int LeadId { get; set; }
    public string Tag { get; set; } = "";
}

public class LeadReminder
{
    public int Id { get; set; }
    public int LeadId { get; set; }
    public string Message { get; set; } = "";
    public DateTime RemindAt { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class LeadAssignment
{
    public int Id { get; set; }
    public int LeadId { get; set; }
    public int ClinicId { get; set; }
    public string ClinicName { get; set; } = "";
    public string AssignmentType { get; set; } = "manual"; // manual | auto
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public string AssignedBy { get; set; } = "";
}

public class AddNoteRequest
{
    public string AuthorName { get; set; } = "Admin";
    public string Content { get; set; } = "";
}

public class AddReminderRequest
{
    public string Message { get; set; } = "";
    public DateTime RemindAt { get; set; }
}

public class AssignLeadRequest
{
    public int ClinicId { get; set; }
    public string AssignmentType { get; set; } = "manual";
    public string AssignedBy { get; set; } = "Admin";
}

// AI Lead scoring result
public class LeadScore
{
    public int LeadId { get; set; }
    public int Score { get; set; } // 0-100
    public string Tier { get; set; } = "cold"; // hot | warm | cold
    public string Summary { get; set; } = "";
    public List<string> Signals { get; set; } = [];
}
