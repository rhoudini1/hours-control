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
    
    public async Task<Squad> CreateAsync(CreateSquadRequest request, CancellationToken token)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(token);

        var generatedId = await connection.ExecuteScalarAsync<int>(new CommandDefinition("""
            INSERT INTO squads (name)
            VALUES (@Name)
            RETURNING id;
            """, request, cancellationToken: token));
        
        return new Squad { Id = generatedId, Name = request.Name };
    }
}