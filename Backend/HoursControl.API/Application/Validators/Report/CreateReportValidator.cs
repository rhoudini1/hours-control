using FluentValidation;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Exceptions;
using HoursControl.API.Domain.Interfaces.Repositories;

namespace HoursControl.API.Application.Validators.Report;

public class CreateReportValidator : AbstractValidator<CreateReportRequest>
{
    private readonly IEmployeeRepository _employeeRepository;

    public CreateReportValidator(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage(ErrorMessages.Validation.DescriptionRequired);

        RuleFor(x => x.SpentHours)
            .GreaterThan(0).WithMessage(ErrorMessages.Validation.SpentHoursInvalid);

        RuleFor(x => x.EmployeeId)
            .GreaterThan(0).WithMessage(ErrorMessages.Validation.EmployeeIdInvalid)
            .MustAsync(ValidateEmployee).WithMessage(ErrorMessages.Validation.EmployeeIdInvalid);
    }

    private async Task<bool> ValidateEmployee(
        int employeeId,
        CancellationToken cancellationToken = default)
    {
        var existingEmployee = await _employeeRepository.GetByIdAsync(employeeId, cancellationToken);
        return existingEmployee is not null;
    }
}