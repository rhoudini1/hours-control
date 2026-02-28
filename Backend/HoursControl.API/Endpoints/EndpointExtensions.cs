using HoursControl.API.Endpoints.Squads;

namespace HoursControl.API.Endpoints;

public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapApiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapSquadEndpoints();
        return app;
    }
}