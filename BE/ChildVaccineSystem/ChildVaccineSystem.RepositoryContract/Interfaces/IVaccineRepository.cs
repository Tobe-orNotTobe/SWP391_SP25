using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IVaccineRepository : IRepository<Vaccine>
    {
        Task<IEnumerable<Vaccine>> GetVaccinesByTypeAsync(bool isNecessary);
        Task<Vaccine?> GetByIdAsync(int id);

    }
}
