using HoursControl.API.Contracts;
using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Endpoints.Employees;

public static class ListEmployeesEndpoint
{
    public const string Name = "ListEmployees";

    public static IEndpointRouteBuilder MapListEmployees(this IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsRoutes.Employees.List, async (
            IEmployeeService employeeService,
            CancellationToken token) =>
        {
            IEnumerable<Employee> employees = await employeeService.ListAsync(token);
            var response = employees.Select(e => e.MapToResponse());
            return TypedResults.Ok(response);
        })
        .WithName(Name)
        .Produces<IEnumerable<EmployeeResponse>>(StatusCodes.Status200OK);

        return app;
    }
}
