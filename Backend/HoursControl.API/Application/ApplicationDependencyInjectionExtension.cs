using HoursControl.API.Application.Services;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Application;

public static class ApplicationDependencyInjectionExtension
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ISquadService, SquadService>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IReportService, ReportService>();
        
        return services;
    }
}