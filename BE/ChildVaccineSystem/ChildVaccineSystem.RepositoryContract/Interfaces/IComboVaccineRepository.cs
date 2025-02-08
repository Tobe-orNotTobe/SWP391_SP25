using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IComboVaccineRepository
    {
        Task<IEnumerable<ComboVaccine>> GetAllAsync();
        Task<ComboVaccine> GetByIdAsync(int id);
        Task<ComboVaccine> CreateAsync(ComboVaccine combo);
        Task<ComboVaccine> UpdateAsync(ComboVaccine combo);
        Task<bool> DeleteAsync(int id);
    }
}
