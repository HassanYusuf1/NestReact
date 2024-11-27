using Microsoft.EntityFrameworkCore;
using InstagramMVC.DAL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS policy to allow React and Swagger
builder.Services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy",
                builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        });

// Register the database context
builder.Services.AddDbContext<MediaDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("MediaDbContextConnection"));
});

// Register repositories
builder.Services.AddScoped<IPictureRepository, PictureRepository>();
//builder.Services.AddScoped<INoteRepository, NoteRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();


var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware ordering: Ensure proper handling of requests
app.UseRouting();
app.UseCors("CorsPolicy"); // Apply CORS policy here
app.UseAuthorization();
app.UseStaticFiles();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"); // Default route setup

app.Run();
