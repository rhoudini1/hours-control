namespace HoursControl.API.Contracts.Requests;

public record CreateEmployeeRequest(
    string Name,
    int EstimatedHours,
    int SquadId);