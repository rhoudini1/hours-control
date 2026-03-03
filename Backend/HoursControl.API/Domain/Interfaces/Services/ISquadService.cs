using HoursControl.API.Contracts.Requests;
using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Entities;

namespace HoursControl.API.Domain.Interfaces.Services;

public interface ISquadService
{
    Task<Squad> CreateAsync(CreateSquadRequest request, CancellationToken token = default);
    Task<IEnumerable<Squad>> ListAsync(CancellationToken token = default);
    Task<SquadDetailsResponse> GetDetailsAsync(GetSquadDetailsRequest request, CancellationToken token = default);
}
