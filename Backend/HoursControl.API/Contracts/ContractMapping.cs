using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Entities;

namespace HoursControl.API.Contracts;

public static class ContractMapping
{
    public static SquadResponse MapToResponse(this Squad squad)
    {
        return new SquadResponse(Id: squad.Id, Name: squad.Name);
    }
}