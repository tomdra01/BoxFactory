using infrastructure;
using Infrastructure;
using Service;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddNpgsqlDataSource(Utilities.ProperlyFormattedConnectionString,
    dataSourceBuilder => dataSourceBuilder.EnableParameterLogging());
builder.Services.AddSingleton<Repository>();
builder.Services.AddSingleton<IService, Service.Service>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin",
        builder => builder.WithOrigins("http://localhost:4200") 
            .AllowAnyHeader()
            .AllowAnyMethod());
});
var app = builder.Build();
app.UseSwagger();
app.UseCors("AllowMyOrigin");
app.UseSwaggerUI();
app.MapControllers();
app.Run();