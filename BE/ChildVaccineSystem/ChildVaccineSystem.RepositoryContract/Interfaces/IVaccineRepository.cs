using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IVaccineRepository
    {
        Task<IEnumerable<Vaccine>> GetAllAsync();
        Task<Vaccine?> GetByIdAsync(int id);
        Task<Vaccine> CreateAsync(Vaccine vaccine);
        Task<Vaccine?> UpdateAsync(int id, Vaccine vaccine);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Vaccine>> GetVaccinesByTypeAsync(bool isNecessary);
    }
}
