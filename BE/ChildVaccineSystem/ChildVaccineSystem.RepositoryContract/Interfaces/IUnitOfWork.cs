using System;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IVaccineRepository Vaccines { get; }
        Task<int> CompleteAsync();
    }
}
