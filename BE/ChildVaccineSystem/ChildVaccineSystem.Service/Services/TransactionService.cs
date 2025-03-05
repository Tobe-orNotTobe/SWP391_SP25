using AutoMapper;
using ChildVaccineSystem.Data.DTO.Transaction;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;

namespace ChildVaccineSystem.Service.Services
{
	public class TransactionService : ITransactionService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IMapper _mapper;

		public TransactionService(IUnitOfWork unitOfWork, IMapper mapper)
		{
			_unitOfWork = unitOfWork;
			_mapper = mapper;
		}

		public async Task<TransactionDTO> GetTransactionByIdAsync(int transactionId)
		{
			var transaction = await _unitOfWork.Transactions.GetAsync(
				t => t.TransactionId == transactionId,
				includeProperties: "Booking,User");

			return _mapper.Map<TransactionDTO>(transaction);
		}

		public async Task<IEnumerable<TransactionDTO>> GetTransactionsByUserAsync(string userId)
		{
			var transactions = await _unitOfWork.Transactions.GetAllAsync(t => t.UserId == userId);
			return _mapper.Map<List<TransactionDTO>>(transactions);
		}

		public async Task<IEnumerable<TransactionDTO>> GetTransactionsByBookingAsync(int bookingId)
		{
			var transactions = await _unitOfWork.Transactions.GetAllAsync(t => t.BookingId == bookingId);
			return _mapper.Map<IEnumerable<TransactionDTO>>(transactions);
		}

		public async Task<TransactionDTO> CreateTransactionAsync(CreateTransactionDTO transactionDto)
		{
			var transaction = _mapper.Map<Transaction>(transactionDto);
			transaction.CreatedAt = DateTime.UtcNow;
			transaction.Status = "Pending";

			await _unitOfWork.Transactions.AddAsync(transaction);
			await _unitOfWork.CompleteAsync();

			return _mapper.Map<TransactionDTO>(transaction);
		}

		public async Task<TransactionDTO> UpdateTransactionStatusAsync(int transactionId, string status)
		{
			var transaction = await _unitOfWork.Transactions.GetAsync(t => t.TransactionId == transactionId);

			if (transaction == null)
				throw new ArgumentException($"Transaction with ID {transactionId} not found");

			transaction.Status = status;
			transaction.UpdatedAt = DateTime.UtcNow;

			await _unitOfWork.Transactions.UpdateAsync(transaction);
			await _unitOfWork.CompleteAsync();

			return _mapper.Map<TransactionDTO>(transaction);
		}
        public async Task<decimal> GetTotalRevenueByDateAsync(DateTime date)
        {
            // Lọc tất cả các giao dịch trong ngày từ cơ sở dữ liệu
            var transactions = await _unitOfWork.Transactions.GetAllAsync(
                t => t.CreatedAt.Date == date.Date,  // Sử dụng CreatedAt thay vì TransactionDate
                includeProperties: "Booking"
            );

            // Tính tổng số tiền thu được trong ngày từ các giao dịch
            return transactions.Sum(t => t.Amount);  // Sử dụng thuộc tính Amount từ Transaction
        }

    }
}
