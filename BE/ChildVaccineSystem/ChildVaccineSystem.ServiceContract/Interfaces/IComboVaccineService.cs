using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.DTO;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IComboVaccineService
    {
        Task<List<ComboVaccineDTO>> GetAllAsync();
        Task<ComboVaccineDTO?> GetByIdAsync(int id);
    }
}
