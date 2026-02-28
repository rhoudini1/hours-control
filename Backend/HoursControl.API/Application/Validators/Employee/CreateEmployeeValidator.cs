using FluentValidation;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Exceptions;
using HoursControl.API.Domain.Interfaces.Repositories;

namespace HoursControl.API.Application.Validators.Employee;

public class CreateEmployeeValidator : AbstractValidator<CreateEmployeeRequest>
{
    private readonly ISquadRepository _squadRepository;
    
    public CreateEmployeeValidator(ISquadRepository squadRepository)
    {
        _squadRepository = squadRepository;
        
        RuleFor(request => request.Name).
            NotEmpty().WithMessage(ErrorMessages.Validation.NamePropRequired)
            .MinimumLength(3).WithMessage(ErrorMessages.Validation.NameTooShort)
            .MaximumLength(100).WithMessage(ErrorMessages.Validation.NameTooLong);

        RuleFor(request => request.EstimatedHours)
            .InclusiveBetween(1, 12)
            .WithMessage(ErrorMessages.Validation.EstimatedHours);
        
        RuleFor(request => request.SquadId)
            .GreaterThan(0).WithMessage(ErrorMessages.Validation.SquadIdInvalid)
            .MustAsync(ValidateSquad).WithMessage(ErrorMessages.Validation.SquadIdInvalid);
    }

    private async Task<bool> ValidateSquad(
        int squadId,
        CancellationToken cancellationToken = default)
    {
        var existingSquad = await _squadRepository.GetByIdAsync(squadId, cancellationToken);
        return existingSquad is not null;
    }
}