using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;

namespace HoursControl.API.Domain.Interfaces.Repositories;

public interface IEmployeeRepository
{
    Task<Employee> CreateAsync(CreateEmployeeRequest request, CancellationToken token);
    Task<Employee?> GetByIdAsync(int id, CancellationToken token);
}
