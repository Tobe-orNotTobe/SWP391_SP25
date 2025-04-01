namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IVnPaymentService
	{
		Task<string> CreatePaymentUrl(int bookingId, string clientIpAddress);
		Task<bool> PaymentExecute(IDictionary<string, string> vnpayParams);
		Task<string> CreateWalletDepositUrl(int walletTransactionId, decimal amount, string userId, string clientIpAddress);
	}
}
