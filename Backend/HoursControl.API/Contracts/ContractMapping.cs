using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Entities;

namespace HoursControl.API.Contracts;

public static class ContractMapping
{
    public static SquadResponse MapToResponse(this Squad squad)
    {
        return new SquadResponse(Id: squad.Id, Name: squad.Name);
    }

    public static EmployeeResponse MapToResponse(this Employee employee)
    {
        var squadResponse = new SquadResponse(Id: employee.SquadId, Name: employee.SquadName);
        
        return new EmployeeResponse(
            Id: employee.Id,
            Name: employee.Name,
            EstimatedHours: employee.EstimatedHours,
            Squad: squadResponse
        );
    }
}