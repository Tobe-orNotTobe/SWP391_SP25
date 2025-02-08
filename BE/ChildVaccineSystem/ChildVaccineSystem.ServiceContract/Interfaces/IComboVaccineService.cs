using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.DTO;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IComboVaccineService
    {
        Task<IEnumerable<ComboVaccineDTO>> GetAllAsync();
        Task<ComboVaccineDTO> GetByIdAsync(int id);
        Task<ComboVaccineDTO> CreateAsync(ComboVaccineDTO comboDto);
        Task<ComboVaccineDTO> UpdateAsync(int id, ComboVaccineDTO comboDto);
        Task<bool> DeleteAsync(int id);
    }
}
