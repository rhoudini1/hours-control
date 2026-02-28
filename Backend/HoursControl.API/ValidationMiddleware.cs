using FluentValidation;
using HoursControl.API.Contracts.Responses;

namespace HoursControl.API;

public class ValidationMiddleware
{
    private readonly RequestDelegate _next;
    
    public ValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = 400;
            var validationFailureResponse = new ValidationFailureResponse(ex.Errors
                .Select(x => new ValidationResponse(x.PropertyName, x.ErrorMessage)));

            await context.Response.WriteAsJsonAsync(validationFailureResponse);
        }
    }
}