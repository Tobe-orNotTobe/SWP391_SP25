using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IComboVaccineRepository : IRepository<ComboVaccine>
    {
        Task<bool> ValidateScheduleIdAsync(int scheduleId);
        Task<IEnumerable<ComboVaccine>> GetAll();

        Task<ComboVaccine> GetById(int id);
        Task<List<int>> GetVaccineIdsFromComboAsync(int comboVaccineId);
    }
}
