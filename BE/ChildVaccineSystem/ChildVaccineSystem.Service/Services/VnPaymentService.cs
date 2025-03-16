using ChildVaccineSystem.Common.Helper;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Enum;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace ChildVaccineSystem.Service.Services
{
	public class VnPaymentService : IVnPaymentService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IConfiguration _config;

		public VnPaymentService(IConfiguration config, IUnitOfWork unitOfWork)
		{
			_config = config;
			_unitOfWork = unitOfWork;
		}

		public async Task<string> CreatePaymentUrl(int bookingId, string clientIpAddress)
		{
			var booking = await _unitOfWork.Bookings.GetAsync(b => b.BookingId == bookingId);

			if (booking == null)
			{
				throw new KeyNotFoundException($"Không tìm thấy lịch hẹn!");
			}

			if (booking.Status != BookingStatus.Pending)
			{
				throw new InvalidOperationException($"Thanh toán chỉ có thể được xử lý đối với các lịch hẹn có trạng thái 'Đang chờ xử lý'. Trạng thái hiện tại: {booking.Status}");
			}

			var transaction = await CreateTransactionAsync(booking);

			var tick = DateTime.Now.Ticks.ToString();
			var txnRef = $"TXN{transaction.TransactionId}_TIME{tick}";

			var vnpay = new VnPayLibrary();

			vnpay.AddRequestData("vnp_Version", _config["VnPay:Version"]);
			vnpay.AddRequestData("vnp_Command", _config["VnPay:Command"]);
			vnpay.AddRequestData("vnp_TmnCode", _config["VnPay:TmnCode"]);
			vnpay.AddRequestData("vnp_Amount", (Convert.ToInt64(booking.TotalPrice) * 100).ToString());
			vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
			vnpay.AddRequestData("vnp_CurrCode", _config["VnPay:CurrCode"]);
			vnpay.AddRequestData("vnp_IpAddr", clientIpAddress);
			vnpay.AddRequestData("vnp_Locale", _config["VnPay:Locale"]);
			vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toán cho đơn hàng #{bookingId}");
			vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other
			vnpay.AddRequestData("vnp_ReturnUrl", _config["VnPay:PaymentBackReturnUrl"]);
			vnpay.AddRequestData("vnp_TxnRef", txnRef);

			var paymentUrl = vnpay.CreateRequestUrl(_config["VnPay:BaseUrl"], _config["VnPay:HashSecret"]);

			return paymentUrl;
		}

		public async Task<string> CreateWalletDepositUrl(int walletTransactionId, decimal amount, string userId, string clientIpAddress)
		{
			var walletTransaction = await _unitOfWork.WalletTransactions.GetAsync(t => t.WalletTransactionId == walletTransactionId);
			if (walletTransaction == null)
			{
				throw new ArgumentException($"Không tìm thấy giao dịch!");
			}

			var tick = DateTime.Now.Ticks.ToString();
			var txnRef = $"TXN{walletTransaction.WalletTransactionId}_TIME{tick}";

			var vnpay = new VnPayLibrary();

			vnpay.AddRequestData("vnp_Version", _config["VnPay:Version"]);
			vnpay.AddRequestData("vnp_Command", _config["VnPay:Command"]);
			vnpay.AddRequestData("vnp_TmnCode", _config["VnPay:TmnCode"]);
			vnpay.AddRequestData("vnp_Amount", (Convert.ToInt64(amount) * 100).ToString());
			vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
			vnpay.AddRequestData("vnp_CurrCode", _config["VnPay:CurrCode"]);
			vnpay.AddRequestData("vnp_IpAddr", clientIpAddress);
			vnpay.AddRequestData("vnp_Locale", _config["VnPay:Locale"]);
			vnpay.AddRequestData("vnp_OrderInfo", $"Nạp tiền vào ví #{userId}");
			vnpay.AddRequestData("vnp_OrderType", "topup");
			vnpay.AddRequestData("vnp_ReturnUrl", _config["VnPay:WalletDepositReturnUrl"]);
			vnpay.AddRequestData("vnp_TxnRef", txnRef);

			var paymentUrl = vnpay.CreateRequestUrl(_config["VnPay:BaseUrl"], _config["VnPay:HashSecret"]);

			return paymentUrl;
		}

		public async Task<bool> PaymentExecute(IDictionary<string, string> vnpayParams)
		{
			var vnpHashSecret = _config["VNPay:HashSecret"];

			if (string.IsNullOrEmpty(vnpHashSecret))
			{
				throw new Exception("Cài đặt VNPay không được cấu hình đúng!");
			}

			string vnpSecureHash = vnpayParams["vnp_SecureHash"];

			var signParams = new SortedList<string, string>();
			foreach (var param in vnpayParams)
			{
				if (!param.Key.Equals("vnp_SecureHash"))
				{
					signParams.Add(param.Key, param.Value);
				}
			}

			var signData = new StringBuilder();
			foreach (var param in signParams)
			{
				signData.Append(WebUtility.UrlEncode(param.Key) + "=" + WebUtility.UrlEncode(param.Value) + "&");
			}

			if (signData.Length > 0)
			{
				signData.Remove(signData.Length - 1, 1);
			}

			var hmacSha512 = new HMACSHA512(Encoding.UTF8.GetBytes(vnpHashSecret));
			var hash = hmacSha512.ComputeHash(Encoding.UTF8.GetBytes(signData.ToString()));
			var calculatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

			if (calculatedSignature != vnpSecureHash.ToLower())
			{
				return false;
			}

			var match = Regex.Match(vnpayParams["vnp_TxnRef"], @"TXN(\d+)_TIME");
			int transactionId = int.Parse(match.Groups[1].Value);

			if (!vnpayParams.TryGetValue("vnp_ResponseCode", out string responseCode) || responseCode != "00")
			{
				await UpdateTransactionStatusAsync(transactionId, "Failed", vnpayParams["vnp_ResponseCode"] ?? "Unknown error");
				return false;
			}

			await UpdateTransactionStatusAsync(transactionId, "Hoàn thành", responseCode);

			if (vnpayParams.TryGetValue("vnp_OrderType", out string orderType) && orderType == "topup")
			{
				return true;
			}
			else
			{
				var transaction = await _unitOfWork.Transactions.GetAsync(t => t.TransactionId == transactionId, includeProperties: "Booking");
				if (transaction != null && transaction.Booking != null)
				{
					transaction.Booking.Status = BookingStatus.Confirmed;
					await _unitOfWork.CompleteAsync();
				}
			}

			return true;
		}

		private async Task<Transaction> CreateTransactionAsync(Booking booking)
		{
			var transaction = new Transaction
			{
				BookingId = booking.BookingId,
				UserId = booking.UserId,
				CreatedAt = DateTime.UtcNow,
				PaymentMethod = "VnPay",
				Status = "Đang chờ xử lý",
				Amount = booking.TotalPrice
			};

			await _unitOfWork.Transactions.AddAsync(transaction);
			await _unitOfWork.CompleteAsync();

			return transaction;
		}

		private async Task UpdateTransactionStatusAsync(int transactionId, string status, string responseCode)
		{
			var transaction = await _unitOfWork.Transactions.GetAsync(t => t.TransactionId == transactionId);
			if (transaction != null)
			{
				transaction.Status = status;
				transaction.UpdatedAt = DateTime.UtcNow;
				await _unitOfWork.Transactions.UpdateAsync(transaction);
				await _unitOfWork.CompleteAsync();
			}
		}
	}
}