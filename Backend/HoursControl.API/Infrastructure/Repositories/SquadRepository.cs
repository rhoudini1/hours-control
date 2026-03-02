using Dapper;
using HoursControl.API.Contracts.Requests;
using HoursControl.API.Domain.Entities;
using HoursControl.API.Domain.Interfaces.Repositories;
using HoursControl.API.Infrastructure.Database;

namespace HoursControl.API.Infrastructure.Repositories;

public class SquadRepository : ISquadRepository
{
    private readonly IDbConnectionFactory _dbConnectionFactory;

    public SquadRepository(IDbConnectionFactory dbConnectionFactory)
    {
        _dbConnectionFactory = dbConnectionFactory;
    }
    
    public async Task<Squad> CreateAsync(CreateSquadRequest request, CancellationToken token = default)
    {
        const string insertSql = """
                                 INSERT INTO squads (name)
                                 VALUES (@Name)
                                 RETURNING id;
                                 """;
        
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(token);

        var generatedId = await connection
            .ExecuteScalarAsync<int>(new CommandDefinition(insertSql, request, cancellationToken: token));
        
        return new Squad { Id = generatedId, Name = request.Name };
    }

    public async Task<Squad?> GetByIdAsync(int id, CancellationToken token = default)
    {
        const string sql = "SELECT id, name FROM squads WHERE id = @id";

        using var connection = await _dbConnectionFactory.CreateConnectionAsync(token);
        
        var command = new CommandDefinition(sql, new { id }, cancellationToken: token);

        var squad = await connection.QuerySingleOrDefaultAsync<Squad>(command);
        
        return squad;
    }

    public async Task<IEnumerable<Squad>> GetAllAsync(CancellationToken token = default)
    {
        const string sql = "SELECT id, name FROM squads";

        using var connection = await _dbConnectionFactory.CreateConnectionAsync(token);

        var command = new CommandDefinition(sql, cancellationToken: token);

        var squads = await connection.QueryAsync<Squad>(command);

        return squads;
    }
}