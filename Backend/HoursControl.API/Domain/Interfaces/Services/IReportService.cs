using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;

namespace HoursControl.API.Domain.Interfaces.Services;

public interface IReportService
{
    Task<Report> CreateAsync(CreateReportRequest request, CancellationToken token = default);
}