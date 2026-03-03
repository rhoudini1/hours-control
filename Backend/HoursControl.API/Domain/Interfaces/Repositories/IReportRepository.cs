using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;

namespace HoursControl.API.Domain.Interfaces.Repositories;

public interface IReportRepository
{
    Task<Report> CreateAsync(CreateReportRequest request, CancellationToken token = default);
    Task<Report?> GetByIdAsync(int id, CancellationToken token = default);
    Task<IEnumerable<Report>> GetBySquadIdAsync(
        int squadId,
        DateOnly? startDate,
        DateOnly? endDate,
        CancellationToken token = default);
}