using HoursControl.API.Domain.Interfaces.Repositories;
using HoursControl.API.Infrastructure.Database;
using HoursControl.API.Infrastructure.Repositories;

namespace HoursControl.API.Infrastructure;

public static class InfraDependencyInjectionExtension
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<ISquadRepository, SquadRepository>();
        services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        services.AddScoped<IReportRepository, ReportRepository>();
        
        return services;
    }

    public static IServiceCollection AddDatabase(this IServiceCollection services, string connectionString)
    {
        services.AddScoped<IDbConnectionFactory>(_ => 
            new NpgsqlConnectionFactory(connectionString));
        services.AddScoped<DbInitializer>();
        return services;
    }
}