using FluentValidation;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Repositories;
using HoursControl.API.Domain.Interfaces.Services;

namespace HoursControl.API.Application.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IValidator<CreateEmployeeRequest> _createEmployeeValidator;

    public EmployeeService(
        IEmployeeRepository employeeRepository,
        IValidator<CreateEmployeeRequest> createEmployeeValidator)
    {
        _employeeRepository = employeeRepository;
        _createEmployeeValidator = createEmployeeValidator;
    }
    
    public async Task<Employee> CreateAsync(
        CreateEmployeeRequest request,
        CancellationToken token = default)
    {
        await _createEmployeeValidator.ValidateAndThrowAsync(request, cancellationToken: token);
        return await _employeeRepository.CreateAsync(request, token);
    }
}