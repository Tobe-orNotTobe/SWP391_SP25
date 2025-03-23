using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Text.RegularExpressions;

public class NotificationHub : Hub
{
	private readonly ILogger<NotificationHub> _logger;

	public NotificationHub(ILogger<NotificationHub> logger)
	{
		_logger = logger;
	}

	public override async Task OnConnectedAsync()
	{
		var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
		if (!string.IsNullOrEmpty(userId))
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, userId);
			_logger.LogInformation("User {UserId} connected to notification hub", userId);
		}

		await base.OnConnectedAsync();
	}

	public override async Task OnDisconnectedAsync(Exception exception)
	{
		var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
		if (!string.IsNullOrEmpty(userId))
		{
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
			_logger.LogInformation("User {UserId} disconnected from notification hub", userId);
		}

		await base.OnDisconnectedAsync(exception);
	}
}