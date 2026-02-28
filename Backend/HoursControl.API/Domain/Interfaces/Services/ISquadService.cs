using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;

namespace HoursControl.API.Domain.Interfaces.Services;

public interface ISquadService
{
    Task<Squad> CreateAsync(CreateSquadRequest request, CancellationToken token = default);
}
