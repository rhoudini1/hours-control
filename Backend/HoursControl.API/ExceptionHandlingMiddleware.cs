using HoursControl.API.Contracts.Responses;

namespace HoursControl.API;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred while processing the request.");
            
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            var errorResponse = new ErrorResponse("An error occurred while processing your request. Please try again later.");

            await context.Response.WriteAsJsonAsync(errorResponse);
        }
    }
}
