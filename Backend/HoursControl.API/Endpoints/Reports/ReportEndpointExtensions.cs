namespace HoursControl.API.Endpoints.Reports;

public static class ReportEndpointExtensions
{
    public static IEndpointRouteBuilder MapReportEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCreateReport();
        return app;
    }
}