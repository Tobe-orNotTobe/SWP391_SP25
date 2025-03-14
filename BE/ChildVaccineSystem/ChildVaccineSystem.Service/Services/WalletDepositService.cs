using AutoMapper;
using ChildVaccineSystem.Data.DTO.Wallet;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.Extensions.Configuration;

namespace ChildVaccineSystem.Service.Services
{
	public class WalletDepositService : IWalletDepositService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IVnPaymentService _vnPaymentService;
		private readonly IWalletService _walletService;
		private readonly IMapper _mapper;
		private readonly IConfiguration _configuration;

		public WalletDepositService(
			IUnitOfWork unitOfWork,
			IVnPaymentService vnPaymentService,
			IWalletService walletService,
			IMapper mapper,
			IConfiguration configuration)
		{
			_unitOfWork = unitOfWork;
			_vnPaymentService = vnPaymentService;
			_walletService = walletService;
			_mapper = mapper;
			_configuration = configuration;
		}

		public async Task<WalletDepositResponseDTO> CreateDepositAsync(string userId, WalletDepositDTO depositDto, string ipAddress)
		{
			var deposit = new WalletDeposit
			{
				UserId = userId,
				Amount = depositDto.Amount,
				Status = "Đang chờ xử lý",
				PaymentMethod = "VnPay",
				CreatedAt = DateTime.UtcNow
			};

			await _unitOfWork.WalletDeposits.AddAsync(deposit);
			await _unitOfWork.CompleteAsync();

			try
			{
				string paymentUrl = await CreateVnPayUrl(deposit.DepositId, deposit.Amount, userId, ipAddress);

				return new WalletDepositResponseDTO
				{
					Success = true,
					Message = "Tạo thành công",
					PaymentUrl = paymentUrl
				};
			}
			catch (Exception ex)
			{
				return new WalletDepositResponseDTO
				{
					Success = false,
					Message = $"Tạo thất bại: {ex.Message}"
				};
			}
		}

		public async Task<bool> ProcessDepositAsync(int depositId, string responseCode)
		{
			var deposit = await _unitOfWork.WalletDeposits.GetAsync(w => w.DepositId == depositId);
			if (deposit == null)
			{
				return false;
			}

			if (responseCode == "00")
			{
				await _unitOfWork.WalletDeposits.UpdateStatusAsync(depositId, "Hoàn thành", responseCode);

				await _walletService.AddFundsToUserWalletAsync(deposit.UserId, deposit.Amount, $"Nạp tiền qua VnPay (Ref: {deposit.DepositId})");

				return true;
			}
			else
			{
				await _unitOfWork.WalletDeposits.UpdateStatusAsync(depositId, "Thất bại", responseCode);

				return false;
			}
		}

		public async Task<List<WalletDepositDTO>> GetUserDepositsAsync(string userId)
		{
			var deposits = await _unitOfWork.WalletDeposits.GetUserDepositsAsync(userId);
			return deposits.Select(d => new WalletDepositDTO
			{
				Amount = d.Amount,
			}).ToList();
		}

		private async Task<string> CreateVnPayUrl(int depositId, decimal amount, string userId, string ipAddress)
		{
			var tick = DateTime.Now.Ticks.ToString();
			var txnRef = $"TXN{depositId}_TIME{tick}";

			var vnpay = new Common.Helper.VnPayLibrary();

			vnpay.AddRequestData("vnp_Version", _configuration["VnPay:Version"]);
			vnpay.AddRequestData("vnp_Command", _configuration["VnPay:Command"]);
			vnpay.AddRequestData("vnp_TmnCode", _configuration["VnPay:TmnCode"]);
			vnpay.AddRequestData("vnp_Amount", (Convert.ToInt64(amount) * 100).ToString());
			vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
			vnpay.AddRequestData("vnp_CurrCode", _configuration["VnPay:CurrCode"]);
			vnpay.AddRequestData("vnp_IpAddr", ipAddress);
			vnpay.AddRequestData("vnp_Locale", _configuration["VnPay:Locale"]);
			vnpay.AddRequestData("vnp_OrderInfo", $"Nạp tiền vào ví #{userId}");
			vnpay.AddRequestData("vnp_OrderType", "topup");
			vnpay.AddRequestData("vnp_ReturnUrl", _configuration["VnPay:WalletDepositReturnUrl"]);
			vnpay.AddRequestData("vnp_TxnRef", txnRef);

			var paymentUrl = vnpay.CreateRequestUrl(_configuration["VnPay:BaseUrl"], _configuration["VnPay:HashSecret"]);

			return paymentUrl;
		}
	}
}