using FluentValidation;
using HoursControl.API;
using HoursControl.API.Application;
using HoursControl.API.Application.Validators.Squad;
using HoursControl.API.Endpoints;
using HoursControl.API.Infrastructure;
using HoursControl.API.Infrastructure.Database;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddOpenApi();

builder.Services.AddValidatorsFromAssemblyContaining<CreateSquadValidator>();

builder.Services.AddInfrastructure();
builder.Services.AddApplication();
builder.Services.AddDatabase(config["ConnectionStrings:DefaultConnection"]!);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseMiddleware<ValidationMiddleware>();

app.MapApiEndpoints();

using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
    await initializer.InitializeDbAsync(); 
}

app.Run();
