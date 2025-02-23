using ChildVaccineSystem.Data.DTO.Vaccine;
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
        Task<IEnumerable<VaccineInventoryDTO>> GetVaccineStockReportAsync();
        Task<IEnumerable<VaccineInventoryDTO>> SearchVaccineStockAsync(string keyword);
        Task IssueVaccineAsync(int id, int quantity);
        Task ReturnVaccineAsync(int id, int quantity);
        Task<IEnumerable<VaccineInventoryDTO>> GetIssuedVaccinesAsync();
        Task<IEnumerable<VaccineInventoryDTO>> GetReturnedVaccinesAsync();
        Task<IEnumerable<VaccineInventoryDTO>> GetExpiringVaccinesAsync(int daysThreshold);
        Task<IEnumerable<VaccineInventoryDTO>> GetLowStockVaccinesAsync(int threshold);
        Task SendExpiryAlertsAsync(int daysThreshold);
    }
}
