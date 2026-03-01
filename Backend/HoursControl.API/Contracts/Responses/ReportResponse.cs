namespace HoursControl.API.Contracts.Responses;

public record ReportResponse(
    int Id,
    string Description,
    int SpentHours,
    DateTime CreatedAt,
    int EmployeeId);