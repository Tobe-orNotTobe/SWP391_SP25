using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.DTO.ComboVaccine;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IComboVaccineService
    {
        Task<IEnumerable<ComboVaccineDTO>> GetAllAsync();
        Task<ComboVaccineDTO> GetByIdAsync(int id);
        Task<ComboVaccineDTO> CreateAsync(CreateComboVaccineDTO comboDto);
        Task<ComboVaccineDTO> UpdateAsync(int id, UpdateComboVaccineDTO comboDto);
        Task<bool> DeleteAsync(int id);
    }
}
