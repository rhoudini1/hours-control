namespace HoursControl.API.Contracts.Responses;

public record SquadReportResponse(
    string Name,
    string Description,
    int Hours,
    DateTime CreatedAt);
