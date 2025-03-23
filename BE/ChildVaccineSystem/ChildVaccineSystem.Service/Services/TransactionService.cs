using AutoMapper;
using ChildVaccineSystem.Data.DTO;
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
			transaction.Status = "Đang chờ xử lý";

			await _unitOfWork.Transactions.AddAsync(transaction);
			await _unitOfWork.CompleteAsync();

			return _mapper.Map<TransactionDTO>(transaction);
		}

		public async Task<TransactionDTO> UpdateTransactionStatusAsync(int transactionId, string status)
		{
			var transaction = await _unitOfWork.Transactions.GetAsync(t => t.TransactionId == transactionId);

			if (transaction == null)
				throw new ArgumentException($"Không tìm thấy giao dịch!");

			transaction.Status = status;
			transaction.UpdatedAt = DateTime.UtcNow;

			await _unitOfWork.Transactions.UpdateAsync(transaction);
			await _unitOfWork.CompleteAsync();

			return _mapper.Map<TransactionDTO>(transaction);
		}
        public async Task<decimal> GetTotalRevenueAsync()
        {
            // Get all transactions from the database
            var transactions = await _unitOfWork.Transactions.GetAllAsync(includeProperties: "Booking");

            // Calculate the total revenue for all transactions
            return transactions.Sum(t => t.Amount);
        }

        public async Task<IEnumerable<RevenueByDateDTO>> GetTotalRevenueLast10DaysAsync()
        {
            var transactions = await _unitOfWork.Transactions.GetAllAsync(includeProperties: "Booking");
            var currentDate = DateTime.UtcNow.Date;

            var last10DaysRevenue = Enumerable.Range(0, 10)
                .Select(i => currentDate.AddDays(-i))  // Get the last 10 days
                .Select(date => new RevenueByDateDTO
                {
                    Date = date,
                    TotalRevenue = transactions
                        .Where(t => t.CreatedAt.Date == date)  // Filter by transaction date
                        .Sum(t => t.Amount)  // Calculate total revenue for that date
                }).ToList();

            return last10DaysRevenue;
        }

        public async Task<RevenueByDateDTO> GetTotalRevenueByDateAsync(DateTime date)
        {
            // Get all transactions for a specific date
            var transactions = await _unitOfWork.Transactions.GetAllAsync(
                t => t.CreatedAt.Date == date.Date,
                includeProperties: "Booking"
            );

            // Create the result with date and total revenue
            var result = new RevenueByDateDTO
            {
                Date = date.Date,
                TotalRevenue = transactions.Sum(t => t.Amount)
            };

            return result;
        }

    }
}
