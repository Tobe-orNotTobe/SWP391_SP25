using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IComboVaccineRepository
    {
        Task<IEnumerable<ComboVaccine>> GetAllAsync();
        Task<ComboVaccine?> GetByIdAsync(int id);
    }
}
