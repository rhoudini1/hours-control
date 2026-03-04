using FluentValidation;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Repositories;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Application.Services;

public class SquadService : ISquadService
{
    private readonly ISquadRepository _squadRepository;
    private readonly IReportRepository _reportRepository;
    private readonly IValidator<CreateSquadRequest> _createSquadValidator;
    private readonly IValidator<GetSquadDetailsRequest> _getSquadDetailsValidator;

    public SquadService(
        ISquadRepository squadRepository,
        IReportRepository reportRepository,
        IValidator<CreateSquadRequest> createSquadValidator,
        IValidator<GetSquadDetailsRequest> getSquadDetailsValidator)
    {
        _squadRepository = squadRepository;
        _reportRepository = reportRepository;
        _createSquadValidator = createSquadValidator;
        _getSquadDetailsValidator = getSquadDetailsValidator;
    }
    
    public async Task<Squad> CreateAsync(CreateSquadRequest request, CancellationToken token = default)
    {
        await _createSquadValidator.ValidateAndThrowAsync(request, cancellationToken: token);
        return await _squadRepository.CreateAsync(request, token);
    }

    public async Task<IEnumerable<Squad>> ListAsync(CancellationToken token = default)
    {
        return await _squadRepository.GetAllAsync(token);
    }

    public async Task<SquadDetailsResponse> GetDetailsAsync(
        GetSquadDetailsRequest request,
        CancellationToken token = default)
    {
        await _getSquadDetailsValidator.ValidateAndThrowAsync(request, cancellationToken: token);

        var reports = await _reportRepository.GetBySquadIdAsync(request.Id, request.StartDate, request.EndDate, token);

        var reportsList = reports.ToList();

        var squadReports = reportsList
            .Select(r => new SquadReportResponse(
                Name: r.EmployeeName ?? "Unknown",
                Description: r.Description,
                Hours: r.SpentHours,
                CreatedAt: r.CreatedAt
            ))
            .ToList();

        var totalHours = reportsList.Sum(r => r.SpentHours);
        
        double averageHours = 0;
        if (reportsList.Any())
        {
            int dayCount = request.StartDate.HasValue && request.EndDate.HasValue
                            ? (request.EndDate.Value.ToDateTime(TimeOnly.MinValue) -
                               request.StartDate.Value.ToDateTime(TimeOnly.MinValue)).Days + 1
                            : reportsList
                                .Select(r => r.CreatedAt.Date)
                                .Distinct()
                                .Count();

            if (dayCount > 0)
                averageHours = Math.Round((double)totalHours / dayCount, 1);
        }

        return new SquadDetailsResponse(squadReports, totalHours, averageHours);
    }
}