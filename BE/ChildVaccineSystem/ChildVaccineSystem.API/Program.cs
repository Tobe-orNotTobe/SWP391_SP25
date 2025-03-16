using ChildVaccineSystem.Common.Config;
using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.Service;
using ChildVaccineSystem.ServiceContract.Interfaces;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using ChildVaccineSystem.API.Jobs;
using Quartz;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddQuartz(q =>
{
	// Register the job
	q.AddJob<AppointmentReminderJob>(opts => opts.WithIdentity("AppointmentReminderJob"));

	// Create a trigger for the job that runs daily at 8:00 AM
	q.AddTrigger(opts => opts
		.ForJob("AppointmentReminderJob")
		.WithIdentity("AppointmentReminderTrigger")
		.WithCronSchedule("0 50 14 * * ?"));  // Daily at 8:00 AM
});

builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

builder.Services.AddSignalR();

// Load cấu hình Firebase từ appsettings.json
var firebaseSettings = builder.Configuration.GetSection("Firebase").Get<FirebaseSettings>();

// Khởi tạo Firebase Admin SDK nếu chưa có
if (FirebaseApp.DefaultInstance == null)
{
    FirebaseApp.Create(new AppOptions
    {
        Credential = GoogleCredential.FromFile(firebaseSettings.ServiceAccountPath)
    });
}

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Add Swagger with Authentication support
builder.Services.AddSwaggerGen(options =>
{
	options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
	{
		Name = "Authorization",
		Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
		Scheme = "Bearer",
		BearerFormat = "JWT",
		In = Microsoft.OpenApi.Models.ParameterLocation.Header,
		Description = "Enter 'Bearer' [space] and then your token."
	});
	options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
	{
		{
			new Microsoft.OpenApi.Models.OpenApiSecurityScheme
			{
				Reference = new Microsoft.OpenApi.Models.OpenApiReference
				{
					Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
					Id = "Bearer"
				}
			},
			Array.Empty<string>()
		}
	});

	var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
	var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
	options.IncludeXmlComments(xmlPath);
});
builder.Services.Configure<EmailSetting>(builder.Configuration.GetSection("EmailSettings"));

// Add AddServices
builder.Services.AddServices(builder.Configuration);

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add JWT Configuration
var jwtSecret = builder.Configuration["JWT:Key"];
if (string.IsNullOrEmpty(jwtSecret))
{
	throw new ArgumentNullException(nameof(jwtSecret), "JWT Secret cannot be null or empty.");
}

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
	options.SaveToken = true;
	options.RequireHttpsMetadata = false;
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = false,
		ValidateAudience = false,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
		ValidAudience = builder.Configuration["JWT:ValidAudience"],
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
	};
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer("Firebase", options =>
    {
        options.Authority = $"https://securetoken.google.com/{firebaseSettings.ProjectId}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://securetoken.google.com/{firebaseSettings.ProjectId}",
            ValidateAudience = true,
            ValidAudience = firebaseSettings.ProjectId,
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization(options =>
{
	options.AddPolicy("AdminOnly", policy => policy.RequireAuthenticatedUser().RequireRole("Admin"));
	options.AddPolicy("AdminOnly", policy => policy.RequireAuthenticatedUser().RequireRole("Customer"));
	options.AddPolicy("AdminOnly", policy => policy.RequireAuthenticatedUser().RequireRole("Staff"));
	options.AddPolicy("AdminOnly", policy => policy.RequireAuthenticatedUser().RequireRole("Manager"));
	options.AddPolicy("AdminOnly", policy => policy.RequireAuthenticatedUser().RequireRole("Doctor"));
});

// Add CORS Configuration
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", policy =>
	{
		policy.WithOrigins("http://localhost:7979") // URL Font-end
			  .AllowAnyHeader()
			  .AllowAnyMethod()
			  .AllowCredentials();
	});
});


// Add UserManager and SignInManager for dependency injection
builder.Services.AddScoped<UserManager<User>>();
builder.Services.AddScoped<SignInManager<User>>();

//child
builder.Services
	.AddControllers()
	.AddJsonOptions(options =>
	{
		options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
	});

var app = builder.Build();

// Create default roles and admin user
using (var scope = app.Services.CreateScope())
{
	var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
	var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
	var walletService = scope.ServiceProvider.GetRequiredService<IWalletService>();

	// Define default roles
	var roles = new[] { "Admin", "Staff", "Manager", "Customer", "Doctor" };
	foreach (var role in roles)
	{
		if (!await roleManager.RoleExistsAsync(role))
		{
			await roleManager.CreateAsync(new IdentityRole(role));
		}
	}

	// Create default admin user
	var adminEmail = "admin@gmail.com";
	var adminUser = await userManager.FindByEmailAsync(adminEmail);
	if (adminUser == null)
	{
		var newUser = new User
		{
			UserName = "admin",
			Email = adminEmail,
			EmailConfirmed = true
		};

		var result = await userManager.CreateAsync(newUser, "Admin12345@");
		if (result.Succeeded)
		{
			adminUser = await userManager.FindByEmailAsync(adminEmail);

			await userManager.AddToRoleAsync(newUser, "Admin");

			await walletService.CreateAdminWalletAsync(adminUser.Id);
		}
	}
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
	app.UseDeveloperExceptionPage(); // Development-specific error handling
	app.UseSwagger();
	app.UseSwaggerUI();
}
else
{
	app.UseExceptionHandler("/Home/Error");
	app.UseHsts();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend"); // Enable CORS Policy

app.UseAuthentication(); // Ensure Authentication

app.UseAuthorization();  // Ensure Authorization

app.MapControllers();

app.MapHub<NotificationHub>("/notificationHub");

app.Run();
