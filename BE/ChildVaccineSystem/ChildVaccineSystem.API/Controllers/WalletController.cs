using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Wallet;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace ChildVaccineSystem.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class WalletController : ControllerBase
	{
		private readonly IWalletService _walletService;
		private readonly APIResponse _response;

		public WalletController(IWalletService walletService, APIResponse response)
		{
			_walletService = walletService;
			_response = response;
		}

		[HttpGet("user")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetUserWallet()
		{
			try
			{
				var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(userId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("User ID not found in token");
					return Unauthorized(_response);
				}

				var wallet = await _walletService.GetUserWalletAsync(userId);

				_response.Result = wallet;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error retrieving wallet: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpGet("user/{userId}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetUserWalletById(string userId)
		{
			try
			{
				var wallet = await _walletService.GetUserWalletAsync(userId);

				_response.Result = wallet;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error retrieving wallet: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpPost("create-admin-wallet")]
		[Authorize(Roles = "Admin")]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<ActionResult<APIResponse>> CreateAdminWallet()
		{
			try
			{
				var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(adminId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("Admin ID not found in token");
					return Unauthorized(_response);
				}

				var wallet = await _walletService.CreateWalletAsync(adminId, isAdminWallet: true);

				_response.Result = wallet;
				_response.StatusCode = HttpStatusCode.Created;
				_response.IsSuccess = true;
				return StatusCode((int)HttpStatusCode.Created, _response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.BadRequest;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add(ex.Message);
				return BadRequest(_response);
			}
		}

		[HttpGet("admin")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetAdminWallet()
		{
			try
			{
				var wallet = await _walletService.GetAdminWalletAsync();

				_response.Result = wallet;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error retrieving admin wallet: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpPost("admin/add-funds")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> AddFundsToAdminWallet([FromBody] AddFundsDTO addFundsDto)
		{
			try
			{
				if (!ModelState.IsValid)
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages = ModelState.Values
						.SelectMany(v => v.Errors)
						.Select(e => e.ErrorMessage)
						.ToList();
					return BadRequest(_response);
				}

				var updatedWallet = await _walletService.AddFundsToAdminWalletAsync(addFundsDto);

				_response.Result = updatedWallet;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				_response.ErrorMessages.Add($"Successfully added {addFundsDto.Amount:C} to admin wallet.");
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error adding funds: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		[HttpPost("create/{userId}")]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> CreateWallet(string userId, [FromQuery] bool isAdminWallet = false)
		{
			try
			{
				var wallet = await _walletService.CreateWalletAsync(userId, isAdminWallet);

				_response.Result = wallet;
				_response.StatusCode = HttpStatusCode.Created;
				_response.IsSuccess = true;
				return CreatedAtAction(nameof(GetUserWalletById), new { userId = userId }, _response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error creating wallet: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
	}
}