using HoursControl.API.Contracts;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Endpoints.Employees;

public static class CreateEmployeeEndpoint
{
    public const string Name = "CreateEmployee";

    public static IEndpointRouteBuilder MapCreateEmployee(this IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsRoutes.Employees.Create, async (
                CreateEmployeeRequest request,
                IEmployeeService employeeService,
                CancellationToken token) =>
            {
                Employee employee = await employeeService.CreateAsync(request, token);
                var response = employee.MapToResponse();
                return TypedResults.Created($"/{EndpointsRoutes.Employees.Create}/{employee.Id}", response);
            })
            .WithName(Name)
            .Produces<EmployeeResponse>(StatusCodes.Status201Created)
            .Produces<ValidationFailureResponse>(StatusCodes.Status400BadRequest);

        return app;
    }
}