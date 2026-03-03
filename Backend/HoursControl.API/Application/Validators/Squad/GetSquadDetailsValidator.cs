using FluentValidation;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Exceptions;

namespace HoursControl.API.Application.Validators.Squad;

public class GetSquadDetailsValidator : AbstractValidator<GetSquadDetailsRequest>
{
    public GetSquadDetailsValidator()
    {
        RuleFor(request => request.Id)
            .GreaterThan(0).WithMessage(ErrorMessages.Validation.InvalidId);

        RuleFor(request => request)
            .Custom((request, context) =>
            {
                bool isEndDateLessThanStartDate = request.StartDate.HasValue && request.EndDate.HasValue && request.EndDate < request.StartDate;
                if (isEndDateLessThanStartDate)
                {
                    context.AddFailure(nameof(request.EndDate), ErrorMessages.Validation.InvalidEndDate);
                }
            });
    }
}
