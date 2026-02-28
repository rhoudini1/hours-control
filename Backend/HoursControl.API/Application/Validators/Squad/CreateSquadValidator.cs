using FluentValidation;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Exceptions;

namespace HoursControl.API.Application.Validators.Squad;

public class CreateSquadValidator : AbstractValidator<CreateSquadRequest>
{
    public CreateSquadValidator()
    {
        RuleFor(squad => squad.Name)
            .NotEmpty().WithMessage(ErrorMessages.Validation.NamePropRequired)
            .MinimumLength(3).WithMessage(ErrorMessages.Validation.NameTooShort)
            .MaximumLength(100).WithMessage(ErrorMessages.Validation.NameTooLong);
    }
}