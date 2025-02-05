using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IComboVaccineRepository
    {
        Task<IEnumerable<ComboVaccine>> GetAllAsync();
        Task<ComboVaccine?> GetByIdAsync(int id);
        Task<ComboVaccine> CreateAsync(ComboVaccine combo, IEnumerable<int> vaccineIds);
        Task<bool> DeleteAsync(int id);
    }
}
