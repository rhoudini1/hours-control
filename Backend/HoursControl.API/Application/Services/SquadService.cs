using FluentValidation;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Repositories;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Application.Services;

public class SquadService : ISquadService
{
    private readonly ISquadRepository _squadRepository;
    private readonly IValidator<CreateSquadRequest> _createSquadValidator;

    public SquadService(ISquadRepository squadRepository, IValidator<CreateSquadRequest> createSquadValidator)
    {
        _squadRepository = squadRepository;
        _createSquadValidator = createSquadValidator;
    }
    
    public async Task<Squad> CreateAsync(CreateSquadRequest request, CancellationToken token = default)
    {
        await _createSquadValidator.ValidateAndThrowAsync(request, cancellationToken: token);
        return await _squadRepository.CreateAsync(request, token);
    }
}