using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class VaccineInventoryRepository : Repository<VaccineInventory>, IVaccineInventoryRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public VaccineInventoryRepository(ChildVaccineSystemDBContext context) : base(context)
        {
            _context = context;
        }

        // Lấy tất cả vaccine tồn kho
        public async Task<IEnumerable<VaccineInventory>> GetAllAsync()
        {
            return await _context.VaccineInventories.Include(vi => vi.Vaccine).ToListAsync();
        }

        // Lấy vaccine tồn kho theo ID vaccine
        public async Task<IEnumerable<VaccineInventory>> GetByVaccineIdAsync(int vaccineId)
        {
            return await _context.VaccineInventories
                                 .Where(vi => vi.VaccineId == vaccineId)
                                 .Include(vi => vi.Vaccine)  // Đảm bảo lấy Vaccine
                                 .ToListAsync();
        }
        public async Task<VaccineInventory> GetVaccineByIdAsync(int vaccineId)
        {
            return await _context.VaccineInventories
                .Include(vi => vi.Vaccine)
                .FirstOrDefaultAsync(vi => vi.VaccineId == vaccineId);
        }

        // Tìm kiếm vaccine trong kho theo từ khóa
        public async Task<IEnumerable<VaccineInventory>> SearchVaccineStockAsync(string? keyword)
    {
        var query = _context.VaccineInventories
            .Include(vi => vi.Vaccine) 
            .AsQueryable(); 

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            keyword = keyword.ToLower();
            query = query.Where(vi =>
                EF.Functions.Like(vi.Vaccine.Name.ToLower(), $"%{keyword}%") ||
                EF.Functions.Like(vi.Vaccine.Manufacturer.ToLower(), $"%{keyword}%")
            );
        }

        return await query.ToListAsync();
    }

        // Lấy danh sách vaccine đã xuất kho
        public async Task<IEnumerable<VaccineInventory>> GetExportVaccinesAsync()
        {
            return await _context.VaccineInventories
                .Include(vi => vi.Vaccine) 
                .Where(vi => vi.QuantityInStock < vi.InitialQuantity)
                .ToListAsync();
        }



        // Lấy danh sách vaccine đã hoàn trả về kho
        public async Task<IEnumerable<VaccineInventory>> GetReturnedVaccinesAsync()
        {
            return await _context.VaccineInventories
                .Where(vi => vi.QuantityInStock > 0 && vi.QuantityInStock != vi.InitialQuantity)
                .Include(vi => vi.Vaccine)
                .ToListAsync();
        }

        // Kiểm tra vaccine sắp hết hạn
        public async Task<List<VaccineInventory>> GetExpiringVaccinesAsync(int daysThreshold)
        {
            return await _context.Set<VaccineInventory>()
                .Include(v => v.Vaccine)
                .Where(v => v.ExpiryDate <= DateTime.Now.AddDays(daysThreshold))
                .ToListAsync();
        }

        // Kiểm tra vaccine tồn kho thấp
        public async Task<IEnumerable<VaccineInventory>> GetLowStockVaccinesAsync(int threshold)
        {
            return await _context.VaccineInventories
                .Where(vi => vi.QuantityInStock <= threshold)
                .Include(vi => vi.Vaccine)
                .ToListAsync();
        }

        public async Task<VaccineInventory?> GetByBatchNumberAsync(string batchNumber)
        {
            return await _context.VaccineInventories
                .FirstOrDefaultAsync(v => v.BatchNumber == batchNumber);
        }
        public async Task<List<VaccineInventory>> GetAvailableInventoriesByVaccineIdAsync(int vaccineId)
        {
            return await _context.VaccineInventories
                .Where(v => v.VaccineId == vaccineId && v.QuantityInStock > 0)
                .OrderBy(v => v.ExpiryDate)
                .ToListAsync();
        }
        public async Task<VaccineInventory?> GetByIdAsync(int id)
        {
            return await _context.VaccineInventories.FindAsync(id);
        }

        // Lấy vaccine tồn kho theo ID vaccineInventory
        public async Task<IEnumerable<VaccineInventory>> GetByVaccineInventoryIdAsync(int vaccineInventoryId)
        {
            return await _context.VaccineInventories
                                 .Where(vi => vi.VaccineInventoryId == vaccineInventoryId)
                                 .ToListAsync();
        }
    }
}
