using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;

namespace ChildVaccineSystem.Repository.Repositories
{
	public class TransactionRepository : Repository<Transaction>, ITransactionRepository
	{
		private readonly ChildVaccineSystemDBContext _context;

		public TransactionRepository(ChildVaccineSystemDBContext context) : base(context) => _context = context;
	}
}
