using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IVaccineInventoryRepository : IRepository<VaccineInventory>
    {
        Task<IEnumerable<VaccineInventory>> GetAllAsync();
        Task<IEnumerable<VaccineInventory>> GetByVaccineIdAsync(int vaccineId);
        Task<IEnumerable<VaccineInventory>> SearchVaccineStockAsync(string? keyword);
        Task<IEnumerable<VaccineInventory>> GetExportVaccinesAsync();
        Task<IEnumerable<VaccineInventory>> GetReturnedVaccinesAsync();
        Task<List<VaccineInventory>> GetExpiringVaccinesAsync(int daysThreshold);
        Task<IEnumerable<VaccineInventory>> GetLowStockVaccinesAsync(int threshold);
        Task<VaccineInventory?> GetByBatchNumberAsync(string batchNumber);
        Task<List<VaccineInventory>> GetAvailableInventoriesByVaccineIdAsync(int vaccineId);
        Task<VaccineInventory?> GetByIdAsync(int id);
        Task<VaccineInventory> GetVaccineByIdAsync(int vaccineId);
        Task<IEnumerable<VaccineInventory>> GetByVaccineInventoryIdAsync(int vaccineInventoryId);
    }
}
