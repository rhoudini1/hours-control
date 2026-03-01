namespace HoursControl.API.Contracts.Requests;

public record CreateReportRequest(string Description, int SpentHours, int EmployeeId);