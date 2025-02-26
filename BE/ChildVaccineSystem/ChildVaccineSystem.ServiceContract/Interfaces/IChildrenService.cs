using ChildVaccineSystem.Data.DTO.Children;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IChildrenService
    {
        Task<List<ChildrenDTO>> GetAllChildrenAsync();
        Task<ChildrenDTO> GetChildByIdAsync(int id);
        Task<List<ChildrenDTO>> GetChildrenByUserIdAsync(string userId);
        Task<ChildrenDTO> CreateChildAsync(CreateChildrenDTO childDto, string userId);
        Task<ChildrenDTO> UpdateChildAsync(int id, UpdateChildrenDTO updatedChildDto);
        Task<bool> DeleteChildAsync(int id);
    }
}
