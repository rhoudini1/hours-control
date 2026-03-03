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
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IValidator<CreateSquadRequest> _createSquadValidator;
    private readonly IValidator<GetSquadDetailsRequest> _getSquadDetailsValidator;

    public SquadService(
        ISquadRepository squadRepository,
        IReportRepository reportRepository,
        IEmployeeRepository employeeRepository,
        IValidator<CreateSquadRequest> createSquadValidator,
        IValidator<GetSquadDetailsRequest> getSquadDetailsValidator)
    {
        _squadRepository = squadRepository;
        _reportRepository = reportRepository;
        _employeeRepository = employeeRepository;
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
        var employees = await _employeeRepository.GetBySquadIdAsync(request.Id, token);

        var reportsList = reports.ToList();
        var employeeDictionary = employees.ToDictionary(e => e.Id, e => e.Name);

        var squadReports = reportsList
            .Select(r => new SquadReportResponse(
                Name: employeeDictionary.TryGetValue(r.EmployeeId, out var employeeName) 
                    ? employeeName 
                    : "Unknown",
                Description: r.Description,
                Hours: r.SpentHours,
                CreatedAt: r.CreatedAt
            ))
            .ToList();

        var totalHours = reportsList.Sum(r => r.SpentHours);
        
        double averageHours = 0;
        if (reportsList.Count > 0)
        {
            if (request.StartDate.HasValue && request.EndDate.HasValue)
            {
                var dayCount = (request.EndDate.Value.ToDateTime(TimeOnly.MinValue) - request.StartDate.Value.ToDateTime(TimeOnly.MinValue)).Days + 1;
                averageHours = (double)totalHours / dayCount;
            }
            else
            {
                var distinctDays = reportsList
                    .Select(r => r.CreatedAt.Date)
                    .Distinct()
                    .Count();
                averageHours = distinctDays > 0 ? (double)totalHours / distinctDays : 0;
            }
        }

        return new SquadDetailsResponse(squadReports, totalHours, averageHours);
    }
}