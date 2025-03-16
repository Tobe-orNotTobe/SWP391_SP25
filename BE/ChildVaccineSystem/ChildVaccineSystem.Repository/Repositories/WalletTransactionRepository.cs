using ChildVaccineSystem.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;

namespace ChildVaccineSystem.Repository.Repositories
{
	internal class WalletTransactionRepository : Repository<WalletTransaction>, IWalletTransactionRepository
	{
		private readonly ChildVaccineSystemDBContext _context;

		public WalletTransactionRepository(ChildVaccineSystemDBContext context) : base(context)
		{
			_context = context;
		}

	}
}
