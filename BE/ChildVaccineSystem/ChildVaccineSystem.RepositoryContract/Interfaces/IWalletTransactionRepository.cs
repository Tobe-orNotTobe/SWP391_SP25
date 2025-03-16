using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
	public interface IWalletTransactionRepository : IRepository<WalletTransaction>
	{
	}
}
