using System.ComponentModel.DataAnnotations;

namespace HoursControl.API.Domain.Entities;

public class Employee
{
    public int Id { get; set; }
    
    public string Name { get; set; }
    
    [Range(1, 12)]
    public int EstimatedHours { get; set; }
    
    public int SquadId { get; set; }
    public Squad Squad { get; set; }
}