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
	}
}
