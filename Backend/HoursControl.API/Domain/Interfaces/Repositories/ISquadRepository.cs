using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;

namespace HoursControl.API.Domain.Interfaces.Repositories;

public interface ISquadRepository
{
    Task<Squad> CreateAsync(CreateSquadRequest request, CancellationToken token = default);
    Task<Squad?> GetByIdAsync(int id, CancellationToken token = default);
}
