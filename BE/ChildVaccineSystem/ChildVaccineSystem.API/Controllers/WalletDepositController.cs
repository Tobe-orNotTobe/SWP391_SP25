using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.DTO.Wallet;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace ChildVaccineSystem.API.Controllers
{
	[Route("api/wallet/deposit")]
	[ApiController]
	public class WalletDepositController : ControllerBase
	{
		private readonly IWalletDepositService _walletDepositService;
		private readonly APIResponse _response;
		private readonly IConfiguration _configuration;

		public WalletDepositController(
			IWalletDepositService walletDepositService,
			APIResponse response,
			IConfiguration configuration)
		{
			_walletDepositService = walletDepositService;
			_response = response;
			_configuration = configuration;
		}

		/// <summary>
		/// Initiates a deposit to the user's wallet by creating a VnPay payment URL
		/// </summary>
		[HttpPost("create")]
		[Authorize]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> CreateDeposit([FromBody] WalletDepositDTO depositDto)
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

				var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (string.IsNullOrEmpty(userId))
				{
					_response.StatusCode = HttpStatusCode.Unauthorized;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add("User ID not found in token");
					return Unauthorized(_response);
				}

				string ipAddress = Utils.GetIpAddress(HttpContext);

				var result = await _walletDepositService.CreateDepositAsync(userId, depositDto, ipAddress);

				if (result.Success)
				{
					_response.Result = result;
					_response.StatusCode = HttpStatusCode.OK;
					_response.IsSuccess = true;
					return Ok(_response);
				}
				else
				{
					_response.StatusCode = HttpStatusCode.BadRequest;
					_response.IsSuccess = false;
					_response.ErrorMessages.Add(result.Message);
					return BadRequest(_response);
				}
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error creating deposit: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}

		/// <summary>
		/// Handles the return from VnPay payment for wallet deposits
		/// </summary>
		[HttpGet("payment-return")]
		[AllowAnonymous]
		public async Task<IActionResult> DepositReturn([FromQuery] Dictionary<string, string> vnpayParams)
		{
			var frontendUrl = _configuration.GetValue<string>("AppSettings:FrontendUrl");
			var successUrl = $"{frontendUrl}/wallet/deposit-success";
			var failureUrl = $"{frontendUrl}/wallet/deposit-failure";

			try
			{
				var match = Regex.Match(vnpayParams["vnp_TxnRef"], @"TXN(\d+)_TIME");
				int depositId = int.Parse(match.Groups[1].Value);

				if (!vnpayParams.TryGetValue("vnp_ResponseCode", out string responseCode))
				{
					return Redirect($"{failureUrl}?errorCode=missing_response_code");
				}

				var vnpSecureHash = vnpayParams["vnp_SecureHash"];
				var vnpHashSecret = _configuration["VnPay:HashSecret"];

				if (string.IsNullOrEmpty(vnpHashSecret))
				{
					return Redirect($"{failureUrl}?errorCode=system_configuration_error");
				}

				var signParams = vnpayParams
					.Where(p => p.Key != "vnp_SecureHash" && p.Key != "vnp_SecureHashType")
					.OrderBy(p => p.Key, StringComparer.InvariantCulture)
					.ToDictionary(p => p.Key, p => p.Value);

				var signData = string.Join("&", signParams.Select(p => $"{p.Key}={WebUtility.UrlEncode(p.Value)}"));
				var hmacSha512 = new System.Security.Cryptography.HMACSHA512(Encoding.UTF8.GetBytes(vnpHashSecret));
				var hash = hmacSha512.ComputeHash(Encoding.UTF8.GetBytes(signData));
				var calculatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

				if (calculatedSignature != vnpSecureHash.ToLower())
				{
					return Redirect($"{failureUrl}?errorCode=invalid_signature");
				}

				bool processResult = await _walletDepositService.ProcessDepositAsync(depositId, responseCode);

				if (processResult && responseCode == "00")
				{
					if (vnpayParams.TryGetValue("vnp_Amount", out string amountString) &&
						long.TryParse(amountString, out long amountInVnd))
					{
						decimal amount = amountInVnd / 100m;
						return Redirect($"{successUrl}?amount={amount}");
					}
					return Redirect(successUrl);
				}
				else
				{
					return Redirect($"{failureUrl}?errorCode={responseCode}");
				}
			}
			catch (Exception ex)
			{
				return Redirect($"{failureUrl}?errorCode=system_error&message={WebUtility.UrlEncode(ex.Message)}");
			}
		}

		/// <summary>
		/// Gets the deposit history for the current user
		/// </summary>
		[HttpGet("history")]
		[Authorize]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<APIResponse>> GetDepositHistory()
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

				var deposits = await _walletDepositService.GetUserDepositsAsync(userId);

				_response.Result = deposits;
				_response.StatusCode = HttpStatusCode.OK;
				_response.IsSuccess = true;
				return Ok(_response);
			}
			catch (Exception ex)
			{
				_response.StatusCode = HttpStatusCode.InternalServerError;
				_response.IsSuccess = false;
				_response.ErrorMessages.Add($"Error retrieving deposit history: {ex.Message}");
				return StatusCode((int)HttpStatusCode.InternalServerError, _response);
			}
		}
	}
}