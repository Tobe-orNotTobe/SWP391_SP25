using System;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IVaccineRepository Vaccines { get; }

		IComboVaccineRepository ComboVaccines { get; }
		IComboDetailRepository ComboDetails { get; }

		Task<int> CompleteAsync();
    }
}
