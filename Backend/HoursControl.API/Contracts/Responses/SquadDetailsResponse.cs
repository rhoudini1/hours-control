namespace HoursControl.API.Contracts.Responses;

public record SquadDetailsResponse(
    List<SquadReportResponse> Reports,
    int TotalHours,
    double AverageHours);
