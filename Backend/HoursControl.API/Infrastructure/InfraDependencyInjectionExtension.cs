using HoursControl.API.Domain.Interfaces.Repositories;
using HoursControl.API.Infrastructure.Database;
using HoursControl.API.Infrastructure.Repositories;

namespace HoursControl.API.Infrastructure;

public static class InfraDependencyInjectionExtension
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddInfrastructure()
        {
            services.AddScoped<ISquadRepository, SquadRepository>();
        
            return services;
        }

        public IServiceCollection AddDatabase(string connectionString)
        {
            services.AddScoped<IDbConnectionFactory>(_ => 
                new NpgsqlConnectionFactory(connectionString));
            services.AddScoped<DbInitializer>();
            return services;
        }
    }
}