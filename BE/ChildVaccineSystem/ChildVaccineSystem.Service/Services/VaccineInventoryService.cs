using AutoMapper;
using ChildVaccineSystem.Data.DTO.Vaccine;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Service.Services
{
    public class VaccineInventoryService : IVaccineInventoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public VaccineInventoryService(IUnitOfWork unitOfWork, IMapper mapper, IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
        }

        public async Task<VaccineInventoryDTO> AddVaccineInventoryAsync(CreateVaccineInventoryDTO dto)
        {
            // Kiểm tra vaccine có tồn tại không
            var vaccine = await _unitOfWork.Vaccines.GetByIdAsync(dto.VaccineId);
            if (vaccine == null)
            {
                throw new Exception("Vaccine does not exist.");
            }

            // Kiểm tra xem lô vaccine đã tồn tại chưa
            var existingBatch = await _unitOfWork.VaccineInventories
                .GetByBatchNumberAsync(dto.BatchNumber);

            if (existingBatch != null)
            {
                throw new Exception("Batch number already exists.");
            }

            // Tạo mới một bản ghi VaccineInventory
            var newInventory = new VaccineInventory
            {
                VaccineId = dto.VaccineId,
                BatchNumber = dto.BatchNumber,
                ManufacturingDate = dto.ManufacturingDate,
                ExpiryDate = dto.ExpiryDate,
                InitialQuantity = dto.InitialQuantity,
                QuantityInStock = dto.InitialQuantity, // Ban đầu số lượng tồn kho = số lượng nhập vào
                Supplier = dto.Supplier
            };

            await _unitOfWork.VaccineInventories.AddAsync(newInventory);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<VaccineInventoryDTO>(newInventory);
        }

        // Lấy danh sách tồn kho vaccine
        public async Task<IEnumerable<VaccineInventoryDTO>> GetVaccineStockReportAsync()
        {
            var vaccineStockList = await _unitOfWork.VaccineInventories.GetAllAsync();

            var stockReport = vaccineStockList.Select(vi => new VaccineInventoryDTO
            {
                VaccineId = vi.VaccineId,
                Name = vi.Vaccine.Name ?? "Unknown",
                Manufacturer = vi.Vaccine.Manufacturer ?? "Unknown",
                BatchNumber = vi.BatchNumber,
                ManufacturingDate = vi.ManufacturingDate,
                ExpiryDate = vi.ExpiryDate,
                Supplier = vi.Supplier,
                InitialQuantity = vi.InitialQuantity,
                QuantityInStock = vi.QuantityInStock,
                TotalQuantity = vi.InitialQuantity - vi.QuantityInStock,

            }).ToList();

            return stockReport;
        }


        // Tìm kiếm vaccine trong kho
        public async Task<IEnumerable<VaccineInventoryDTO>> SearchVaccineStockAsync(string? keyword = null)
        {
            var vaccineInventory = await _unitOfWork.VaccineInventories.SearchVaccineStockAsync(keyword);
            return _mapper.Map<IEnumerable<VaccineInventoryDTO>>(vaccineInventory);
        }

        // Xuất vaccine khỏi kho
        public async Task IssueVaccineAsync(int vaccineId, int quantity)
        {
            // Lấy danh sách vaccine inventory từ repository (đã sắp xếp theo hạn dùng)
            var vaccineInventories = await _unitOfWork.VaccineInventories.GetAvailableInventoriesByVaccineIdAsync(vaccineId);

            if (vaccineInventories == null || vaccineInventories.Count == 0)
            {
                throw new Exception("No available vaccine stock.");
            }

            int remainingQuantity = quantity;

            foreach (var inventory in vaccineInventories)
            {
                if (remainingQuantity <= 0) break;

                if (inventory.QuantityInStock >= remainingQuantity)
                {
                    inventory.QuantityInStock -= remainingQuantity;
                    remainingQuantity = 0;
                }
                else
                {
                    remainingQuantity -= inventory.QuantityInStock;
                    inventory.QuantityInStock = 0;
                }
            }

            if (remainingQuantity > 0)
            {
                throw new Exception("Not enough vaccine in stock.");
            }

            await _unitOfWork.CompleteAsync();
        }

        //  Hoàn trả vaccine về kho
        public async Task ReturnVaccineAsync(int id, int quantity)
        {
            var vaccineInventory = await _unitOfWork.VaccineInventories.GetByVaccineIdAsync(id);
            if (vaccineInventory == null)
                throw new Exception("Vaccine không tồn tại trong kho.");

            vaccineInventory.QuantityInStock += quantity;
            await _unitOfWork.CompleteAsync();
        }

        // Lấy danh sách vaccine đã xuất kho
        public async Task<IEnumerable<VaccineInventoryDTO>> GetIssuedVaccinesAsync()
        {
            var issuedVaccines = await _unitOfWork.VaccineInventories.GetIssuedVaccinesAsync();

            return issuedVaccines.Select(vi => new VaccineInventoryDTO
            {
                VaccineId = vi.VaccineId,
                Name = vi.Vaccine?.Name ?? "Unknown", 
                Manufacturer = vi.Vaccine?.Manufacturer ?? "Unknown", 
                BatchNumber = vi.BatchNumber,
                ManufacturingDate = vi.ManufacturingDate,
                ExpiryDate = vi.ExpiryDate,
                InitialQuantity = vi.InitialQuantity,
                QuantityInStock = vi.QuantityInStock,
                TotalQuantity = vi.InitialQuantity - vi.QuantityInStock, //Số lượng Vaccine đã xuất kho
                Supplier = vi.Supplier
            }).ToList();
        }



        // Lấy danh sách vaccine đã hoàn trả về kho
        public async Task<IEnumerable<VaccineInventoryDTO>> GetReturnedVaccinesAsync()
        {
            var returnedVaccines = await _unitOfWork.VaccineInventories.GetReturnedVaccinesAsync();
            return _mapper.Map<IEnumerable<VaccineInventoryDTO>>(returnedVaccines);
        }

        // Kiểm tra vaccine sắp hết hạn
        public async Task<IEnumerable<VaccineInventoryDTO>> GetExpiringVaccinesAsync(int daysThreshold)
        {
            var vaccines = await _unitOfWork.VaccineInventories.GetExpiringVaccinesAsync(daysThreshold);
            return _mapper.Map<IEnumerable<VaccineInventoryDTO>>(vaccines);
        }

        // Kiểm tra vaccine tồn kho thấp
        public async Task<IEnumerable<VaccineInventoryDTO>> GetLowStockVaccinesAsync(int threshold)
        {
            var vaccines = await _unitOfWork.VaccineInventories.GetLowStockVaccinesAsync(threshold);
            return _mapper.Map<IEnumerable<VaccineInventoryDTO>>(vaccines);
        }

        // Gửi cảnh báo vaccine hết hạn
        public async Task SendExpiryAlertsAsync(int daysThreshold)
        {
            var vaccines = await _unitOfWork.VaccineInventories.GetExpiringVaccinesAsync(daysThreshold);
            if (!vaccines.Any()) return;

            var adminEmail = "hauphanduc3014@gmail.com";
            var expiringVaccineList = vaccines
                .Select(v => $"{v.Vaccine.Name} - Expiration date: {v.ExpiryDate.ToShortDateString()}")
                .ToList();

            await _emailService.SendExpiryAlertsAsync(adminEmail, expiringVaccineList);
        }
    }
}
