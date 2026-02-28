using HoursControl.API.Contracts;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Contracts.Responses;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Endpoints.Squads;

public static class CreateSquadEndpoint
{
    public const string Name = "CreateSquad";

    public static IEndpointRouteBuilder MapCreateSquad(this IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsRoutes.Squads.Create, async (
            CreateSquadRequest request,
            ISquadService squadService,
            CancellationToken token) =>
        {
            Squad squad = await squadService.CreateAsync(request, token);
            var response = squad.MapToResponse();
            return TypedResults.Created($"/${EndpointsRoutes.Squads.Create}/{squad.Id}", response);
        })
        .WithName(Name)
        .Produces<SquadResponse>(StatusCodes.Status201Created)
        .Produces<ValidationFailureResponse>(StatusCodes.Status400BadRequest);

        return app;
    }
}