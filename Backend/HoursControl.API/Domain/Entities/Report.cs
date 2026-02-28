namespace HoursControl.API.Domain.Entities;

public class Report
{
    public int Id { get; set; }
    
    public string Description { get; set; }
    
    public int SpentHours { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; }
}