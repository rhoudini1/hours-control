using System.ComponentModel.DataAnnotations;

namespace HoursControl.API.Domain.Entities;

public class Employee
{
    public int Id { get; init; }
    
    public required string Name { get; set; }
    
    public int EstimatedHours { get; set; }
    
    public int SquadId { get; set; }
    
    public required string SquadName { get; set; }
}