namespace HoursControl.API.Endpoints.Squads;

public static class SquadEndpointExtensions
{
    public static IEndpointRouteBuilder MapSquadEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCreateSquad();
        app.MapListSquads();
        
        return app;
    }
}