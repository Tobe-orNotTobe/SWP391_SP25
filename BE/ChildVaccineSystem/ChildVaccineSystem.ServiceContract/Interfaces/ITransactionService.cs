using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.DTO.Transaction;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface ITransactionService
	{
		Task<TransactionDTO> GetTransactionByIdAsync(int transactionId);
		Task<IEnumerable<TransactionDTO>> GetTransactionsByUserAsync(string userId);
		Task<IEnumerable<TransactionDTO>> GetTransactionsByBookingAsync(int bookingId);
		Task<TransactionDTO> CreateTransactionAsync(CreateTransactionDTO transactionDto);
		Task<TransactionDTO> UpdateTransactionStatusAsync(int transactionId, string statusl);
        Task<decimal> GetTotalRevenueAsync();  // Calculate total revenue for all transactions

        Task<IEnumerable<RevenueByDateDTO>> GetTotalRevenueLast10DaysAsync();  // Calculate revenue per day for the last 10 days

        Task<RevenueByDateDTO> GetTotalRevenueByDateAsync(DateTime date);
    }
}
