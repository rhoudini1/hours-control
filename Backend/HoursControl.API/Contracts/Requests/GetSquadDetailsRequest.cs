namespace HoursControl.API.Contracts.Requests;

public record GetSquadDetailsRequest(
    int Id,
    DateOnly? StartDate,
    DateOnly? EndDate);
