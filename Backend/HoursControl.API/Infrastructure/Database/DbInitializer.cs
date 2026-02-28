using Dapper;

namespace HoursControl.API.Infrastructure.Database;

public class DbInitializer
{
    private readonly IDbConnectionFactory _dbConnectionFactory;

    public DbInitializer(IDbConnectionFactory dbConnectionFactory)
    {
        _dbConnectionFactory = dbConnectionFactory;
    }

    public async Task InitializeDbAsync()
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync();

        await connection.ExecuteAsync("""
                                          CREATE TABLE IF NOT EXISTS squads (
                                              id SERIAL PRIMARY KEY,
                                              name TEXT NOT NULL
                                          );
                                      """);
        
        await connection.ExecuteAsync("""
                                          CREATE TABLE IF NOT EXISTS employees (
                                              id SERIAL PRIMARY KEY,
                                              name TEXT NOT NULL,
                                              estimated_hours INTEGER NOT NULL,
                                              squad_id INTEGER NOT NULL,
                                              CONSTRAINT fk_squad FOREIGN KEY(squad_id) REFERENCES squads(id) ON DELETE CASCADE
                                          );
                                      """);
        
        await connection.ExecuteAsync("""
                                          CREATE TABLE IF NOT EXISTS reports (
                                              id SERIAL PRIMARY KEY,
                                              description TEXT NOT NULL,
                                              spent_hours INTEGER NOT NULL,
                                              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                              employee_id INTEGER NOT NULL,
                                              CONSTRAINT fk_employee FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE
                                          );
                                      """);

        await connection.ExecuteAsync("CREATE INDEX IF NOT EXISTS idx_employees_squad_id ON employees(squad_id);");
        await connection.ExecuteAsync("CREATE INDEX IF NOT EXISTS idx_reports_employee_id ON reports(employee_id);");
    }
}