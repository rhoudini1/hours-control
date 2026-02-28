namespace HoursControl.API.Contracts.Responses;

public record EmployeeResponse(
    int Id,
    string Name,
    int EstimatedHours,
    SquadResponse Squad);
