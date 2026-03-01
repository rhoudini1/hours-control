using Dapper;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Repositories;
using HoursControl.API.Infrastructure.Database;

namespace HoursControl.API.Infrastructure.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly IDbConnectionFactory _dbConnectionFactory;

    public ReportRepository(IDbConnectionFactory dbConnectionFactory)
    {
        _dbConnectionFactory = dbConnectionFactory;
    }

    public async Task<Report> CreateAsync(
        CreateReportRequest request,
        CancellationToken token = default)
    {
        const string insertSql = """
                                 INSERT INTO reports (description, spent_hours, employee_id)
                                 VALUES (@Description, @SpentHours, @EmployeeId)
                                 RETURNING id;
                                 """;
        
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(token);

        var generatedId = await connection.ExecuteScalarAsync<int>(
            new CommandDefinition(insertSql, request, cancellationToken: token));
        
        return await GetByIdAsync(generatedId, token)
               ?? throw new Exception("Falha ao recuperar Relatório criado.");
    }

    public async Task<Report?> GetByIdAsync(
        int id,
        CancellationToken token = default)
    {
        const string sql = """
                           SELECT
                               id,
                               description,
                               spent_hours,
                               created_at,
                               employee_id
                           FROM reports
                           WHERE id = @id
                           """;

        using var connection = await _dbConnectionFactory.CreateConnectionAsync(token);
        
        var command = new CommandDefinition(sql, new { id }, cancellationToken: token);

        return await connection.QuerySingleOrDefaultAsync<Report>(command);
    }
}