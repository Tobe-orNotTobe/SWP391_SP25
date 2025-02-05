using ChildVaccineSystem.Data.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IComboVaccineService
    {
        Task<IEnumerable<ComboVaccineDTO>> GetAllAsync();
        Task<ComboVaccineDTO> GetByIdAsync(int id);
        Task<ComboVaccineDTO> CreateAsync(ComboVaccineDTO comboDto);
        Task<bool> DeleteAsync(int id);
    }
}
