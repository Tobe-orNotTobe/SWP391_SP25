using ChildVaccineSystem.Data.DTO.VaccineInventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IVaccineInventoryService
    {
        Task<VaccineInventoryDTO> AddVaccineInventoryAsync(CreateVaccineInventoryDTO dto);
        Task<IEnumerable<VaccineInventoryDTO>> GetVaccineInventoryAsync();
        Task<IEnumerable<VaccineInventoryDTO>> SearchVaccineStockAsync(string keyword);
        Task ExportVaccineAsync(int vaccineId, int quantity);
        Task ReturnVaccineAsync(int id, int quantity);
        Task<IEnumerable<VaccineInventoryDTO>> GetExportVaccinesAsync();
        Task<IEnumerable<ReturnedVaccineDTO>> GetReturnedVaccinesAsync();
        Task<IEnumerable<VaccineInventoryDTO>> GetExpiringVaccinesAsync(int daysThreshold);
        Task<IEnumerable<VaccineInventoryDTO>> GetLowStockVaccinesAsync(int threshold);
        Task SendExpiryAlertsAsync(int daysThreshold);
        Task<IEnumerable<VaccineInventoryDTO>> GetVaccineInventoryByIdAsync(int vaccineId);
        Task<VaccineInventoryDTO> UpdateVaccineInventoryAsync(int id, UpdateVaccineInventoryDTO dto);
        Task<string> SoftDeleteVaccineInventoryAsync(int id);
        Task<IEnumerable<VaccineInventoryDTO>> GetVaccineInventoryByVaccineInventoryIdAsync(int vaccineInventoryId);
        Task<int> GetAvailableInventoryForVaccineAsync(int vaccineId);


	}
}
