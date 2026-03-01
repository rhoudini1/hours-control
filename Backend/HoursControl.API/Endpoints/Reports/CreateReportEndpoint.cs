using HoursControl.API.Contracts;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Endpoints.Reports;

public static class CreateReportEndpoint
{
    public const string Name = "CreateReport";

    public static IEndpointRouteBuilder MapCreateReport(this IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsRoutes.Reports.Create, async (
                CreateReportRequest request,
                IReportService reportService,
                CancellationToken token) =>
            {
                Report report = await reportService.CreateAsync(request, token);
                var response = report.MapToResponse();
                return TypedResults.Created($"/{EndpointsRoutes.Reports.Create}/{report.Id}", response);
            })
            .WithName(Name)
            .Produces<ReportResponse>(StatusCodes.Status201Created)
            .Produces<ValidationFailureResponse>(StatusCodes.Status400BadRequest);

        return app;
    }
}