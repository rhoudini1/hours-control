using HoursControl.API.Contracts;
using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Endpoints.Squads;

public static class ListSquadsEndpoint
{
    public const string Name = "ListSquads";

    public static IEndpointRouteBuilder MapListSquads(this IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsRoutes.Squads.List, async (
            ISquadService squadService,
            CancellationToken token) =>
        {
            IEnumerable<Squad> squads = await squadService.ListAsync(token);
            var response = squads.Select(s => s.MapToResponse());
            return TypedResults.Ok(response);
        })
        .WithName(Name)
        .Produces<IEnumerable<SquadResponse>>(StatusCodes.Status200OK);

        return app;
    }
}
