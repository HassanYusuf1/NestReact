using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using InstagramMVC.DAL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});
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

// Add Identity services for authentication
builder.Services.AddDefaultIdentity<IdentityUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = false; // Sett til true hvis du krever e-postbekreftelse
})
.AddEntityFrameworkStores<MediaDbContext>();

// Register repositories
builder.Services.AddScoped<IPictureRepository, PictureRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<INoteRepository, NoteRepository>();

// Add Razor pages if necessary for authentication
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware ordering: Ensure proper handling of requests
app.UseStaticFiles();
app.UseRouting();
app.UseCors("CorsPolicy"); // Apply CORS policy here
app.UseAuthentication(); // Use Authentication Middleware
app.UseAuthorization(); // Use Authorization Middleware


app.MapRazorPages(); // Legg til Razor Pages-ruter for autentisering

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"); // Default route setup

app.Run();
