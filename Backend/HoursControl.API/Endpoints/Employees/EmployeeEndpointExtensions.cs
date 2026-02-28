namespace HoursControl.API.Endpoints.Employees;

public static class EmployeeEndpointExtensions
{
    public static IEndpointRouteBuilder MapEmployeeEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCreateEmployee();
        
        return app;
    }
}