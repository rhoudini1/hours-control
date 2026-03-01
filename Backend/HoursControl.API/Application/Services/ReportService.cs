using FluentValidation;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Repositories;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Application.Services;

public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;
    private readonly IValidator<CreateReportRequest> _createReportValidator;

    public ReportService(
        IReportRepository reportRepository,
        IValidator<CreateReportRequest> createReportValidator)
    {
        _reportRepository = reportRepository;
        _createReportValidator = createReportValidator;
    }

    public async Task<Report> CreateAsync(
        CreateReportRequest request,
        CancellationToken token = default)
    {
        await _createReportValidator.ValidateAndThrowAsync(request, cancellationToken: token);
        return await _reportRepository.CreateAsync(request, token);
    }
}