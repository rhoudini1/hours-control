using HoursControl.API.Endpoints.Employees;
using HoursControl.API.Endpoints.Reports;
using HoursControl.API.Endpoints.Squads;

namespace HoursControl.API.Endpoints;

public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapApiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapSquadEndpoints();
        app.MapEmployeeEndpoints();
        app.MapReportEndpoints();
        return app;
    }
}