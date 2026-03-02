using Dapper;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Repositories;
using HoursControl.API.Infrastructure.Database;

namespace HoursControl.API.Infrastructure.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly IDbConnectionFactory _dbConnectionFactory;
    
    public EmployeeRepository(IDbConnectionFactory dbConnectionFactory)
    {
        _dbConnectionFactory = dbConnectionFactory;
    }


    public async Task<Employee> CreateAsync(
        CreateEmployeeRequest request,
        CancellationToken token = default)
    {
        const string insertSql = """
                                 INSERT INTO Employees (name, estimated_hours, squad_id)
                                 VALUES (@Name, @EstimatedHours, @SquadId)
                                 RETURNING Id;
                                 """;
        
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(token);

        var generatedId = await connection
            .ExecuteScalarAsync<int>(new CommandDefinition(insertSql, request, cancellationToken: token));
        
        return await GetByIdAsync(generatedId, token)
               ?? throw new Exception("Falha ao recuperar Usuário criado.");
    }
    
    public async Task<Employee?> GetByIdAsync(
        int id,
        CancellationToken token = default)
    {
        const string sql = """
                           SELECT
                               e.*,
                               s.name AS SquadName
                           FROM Employees e
                           INNER JOIN Squads s ON e.squad_id = s.id
                           WHERE e.id = @id
                           """;

        using var connection = await _dbConnectionFactory.CreateConnectionAsync(token);
        
        var command = new CommandDefinition(sql, new { id }, cancellationToken: token);

        var employee = await connection.QuerySingleOrDefaultAsync<Employee>(command);
        
        return employee;
    }

    public async Task<IEnumerable<Employee>> GetAllAsync(CancellationToken token = default)
    {
        const string sql = """
                           SELECT
                               e.*,
                               s.name AS SquadName
                           FROM Employees e
                           INNER JOIN Squads s ON e.squad_id = s.id
                           """;

        using var connection = await _dbConnectionFactory.CreateConnectionAsync(token);
        
        var command = new CommandDefinition(sql, cancellationToken: token);

        var employees = await connection.QueryAsync<Employee>(command);
        
        return employees;
    }
}