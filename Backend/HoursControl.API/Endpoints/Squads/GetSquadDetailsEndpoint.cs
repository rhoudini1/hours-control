using HoursControl.API.Contracts.Requests;
using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Endpoints.Squads;

public static class GetSquadDetailsEndpoint
{
    public const string Name = "GetSquadDetails";

    public static IEndpointRouteBuilder MapGetSquadDetails(this IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsRoutes.Squads.Details, GetSquadDetails)
            .WithName(Name)
            .Produces<SquadDetailsResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

        return app;
    }

    private static async Task<IResult> GetSquadDetails(
        int id,
        [AsParameters] SquadDetailsQueryParameters parameters,
        ISquadService squadService,
        CancellationToken token)
    {
        var request = new GetSquadDetailsRequest(id, parameters.StartDate, parameters.EndDate);
        var response = await squadService.GetDetailsAsync(request, token);
        return TypedResults.Ok(response);
    }
}

public record SquadDetailsQueryParameters(DateOnly? StartDate, DateOnly? EndDate);
