using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;

namespace HoursControl.API.Domain.Interfaces.Services;

public interface IEmployeeService
{
    Task<Employee> CreateAsync(CreateEmployeeRequest request, CancellationToken token = default);
}