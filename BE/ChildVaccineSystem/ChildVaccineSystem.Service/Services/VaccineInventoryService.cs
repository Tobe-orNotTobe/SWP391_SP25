using AutoMapper;
using ChildVaccineSystem.Data.DTO.VaccineInventory;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.EntityFrameworkCore;
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
                throw new Exception("Không có vắc-xin.");
            }

            // Kiểm tra xem lô vaccine đã tồn tại chưa
            var existingBatch = await _unitOfWork.VaccineInventories
                .GetByBatchNumberAsync(dto.BatchNumber);

            if (existingBatch != null)
            {
                throw new Exception("Số lô đã tồn tại.");
            }

            // Validate the manufacturing date and expiry date
            if (dto.ManufacturingDate > dto.ExpiryDate)
            {
                throw new Exception("Ngày sản xuất không được muộn hơn ngày hết hạn.");
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

        // Lấy danh sách tồn kho vaccine, bao gồm danh sách vaccine đã xuất kho và hoàn trả
        public async Task<IEnumerable<VaccineInventoryDTO>> GetVaccineInventoryAsync()
        {
            var vaccineInventories = await _unitOfWork.VaccineInventories.GetAllAsync();
            vaccineInventories = vaccineInventories.Where(vi => !vi.IsActive).ToList();

            var vaccineInventoryDTOs = vaccineInventories.Select(vi =>
            {
                // Tính số tồn kho thực tế, bao gồm cả vaccine đã xuất và hoàn trả
                var stockWithoutReturns = vi.QuantityInStock - vi.ReturnedQuantity;
                var exported = vi.InitialQuantity - stockWithoutReturns;
                var acceptedReturn = Math.Min(vi.ReturnedQuantity, exported);
                var actualStock = stockWithoutReturns + acceptedReturn;

                return new VaccineInventoryDTO
                {
                    VaccineInventoryId = vi.VaccineInventoryId,
                    VaccineId = vi.VaccineId,
                    Name = vi.Vaccine?.Name ?? "Unknown",
                    Manufacturer = vi.Vaccine?.Manufacturer ?? "Unknown",
                    BatchNumber = vi.BatchNumber,
                    ManufacturingDate = vi.ManufacturingDate,
                    ExpiryDate = vi.ExpiryDate,
                    Supplier = vi.Supplier,
                    InitialQuantity = vi.InitialQuantity,
                    QuantityInStock = actualStock,
                    TotalQuantity = vi.InitialQuantity - vi.QuantityInStock, // Vaccine đã xuất (Exported)
                    ReturnedQuantity = acceptedReturn // Vaccine đã hoàn trả
                };
            }).ToList();

            return vaccineInventoryDTOs;
        }




        // Tìm kiếm vaccine trong kho
        public async Task<IEnumerable<VaccineInventoryDTO>> SearchVaccineStockAsync(string? keyword = null)
        {
            var vaccineInventory = await _unitOfWork.VaccineInventories.SearchVaccineStockAsync(keyword);

            // Lọc những vaccine chưa bị xóa mềm
            vaccineInventory = vaccineInventory.Where(vi => !vi.IsActive).ToList();

            return _mapper.Map<IEnumerable<VaccineInventoryDTO>>(vaccineInventory);
        }


        // Xuất vaccine khỏi kho
        public async Task ExportVaccineAsync(int vaccineId, int quantity)
        {
            var vaccineInventories = await _unitOfWork.VaccineInventories.GetAvailableInventoriesByVaccineIdAsync(vaccineId);

            // Lọc ra các lô vaccine chưa bị xóa mềm (IsActive = false) và sắp xếp theo hạn sử dụng gần nhất
            var sortedInventories = vaccineInventories
                .Where(vi => !vi.IsActive) // Chỉ lấy những lô chưa bị xóa mềm
                .OrderBy(vi => vi.ExpiryDate) // Ưu tiên xuất lô gần hết hạn trước
                .ToList();

            if (!sortedInventories.Any())
            {
                throw new Exception("Không có sẵn vắc-xin.");
            }

            int remainingQuantity = quantity;

            foreach (var inventory in sortedInventories)
            {
                if (remainingQuantity <= 0) break;

                int issuedQuantity = Math.Min(remainingQuantity, inventory.QuantityInStock);
                inventory.QuantityInStock -= issuedQuantity;
                remainingQuantity -= issuedQuantity;

                // Tạo giao dịch xuất vaccine
                var transaction = new VaccineTransactionHistory
                {
                    VaccineInventoryId = inventory.VaccineInventoryId,
                    TransactionType = "Xuất",
                    Quantity = issuedQuantity,
                    TransactionDate = DateTime.UtcNow,
                    Description = $"Xuất {issuedQuantity} vắc-xin từ Lô {inventory.BatchNumber}."
                };

                await _unitOfWork.VaccineTransactionHistories.AddAsync(transaction);
            }

            if (remainingQuantity > 0)
            {
                throw new Exception("Không có đủ vắc-xin trong kho.");
            }

            await _unitOfWork.CompleteAsync();
        }

        // Hoàn trả vaccine về kho
        public async Task ReturnVaccineAsync(int vaccineId, int returnQuantity)
        {
            var vaccineInventory = await _unitOfWork.VaccineInventories.GetVaccineByIdAsync(vaccineId);
            if (vaccineInventory == null)
            {
                throw new Exception("Không tìm thấy vắc-xin có ID cụ thể.");
            }

            if (vaccineInventory.IsActive)
            {
                throw new InvalidOperationException("Không thể trả lại vắc-xin. Kho vắc-xin này đã bị xóa (xóa tạm thời).");
            }

            // Tính số vaccine đã xuất:
            int stockWithoutReturns = vaccineInventory.QuantityInStock - vaccineInventory.ReturnedQuantity;
            int exported = vaccineInventory.InitialQuantity - stockWithoutReturns;

            // Kiểm tra hợp lệ: tổng số vaccine trả không vượt quá số đã xuất
            if (vaccineInventory.ReturnedQuantity + returnQuantity > exported)
            {
                throw new InvalidOperationException("Số lượng vắc xin xuất đi không đủ để trả lại.");
            }

            // Cập nhật tồn kho và số vaccine đã trả
            vaccineInventory.ReturnedQuantity += returnQuantity;  // Cập nhật số lượng đã hoàn trả
            vaccineInventory.QuantityInStock += returnQuantity;  // Cập nhật số lượng tồn kho sau khi hoàn trả

            // Tạo giao dịch hoàn trả (Return)
            var transaction = new VaccineTransactionHistory
            {
                VaccineInventoryId = vaccineInventory.VaccineInventoryId,
                TransactionType = "Hoàn trả",
                Quantity = returnQuantity,
                TransactionDate = DateTime.UtcNow,
                Description = $"Hoàn trả {returnQuantity} vắc-xin về kho"
            };

            // Lưu giao dịch vào lịch sử (Dùng IVaccineTransactionHistoryRepository)
            await _unitOfWork.VaccineTransactionHistories.AddAsync(transaction);

            // Cập nhật bảng VaccineInventory
            await _unitOfWork.VaccineInventories.UpdateAsync(vaccineInventory);

            // Lưu thay đổi
            await _unitOfWork.CompleteAsync();
        }

        // Lấy danh sách vaccine đã xuất kho (Export Vaccines)
        public async Task<IEnumerable<VaccineInventoryDTO>> GetExportVaccinesAsync()
        {
            var issuedVaccines = await _unitOfWork.VaccineInventories.GetExportVaccinesAsync();

            return issuedVaccines.Select(vi => new VaccineInventoryDTO
            {
                VaccineId = vi.VaccineInventoryId,
                Name = vi.Vaccine?.Name ?? "Unknown",
                Manufacturer = vi.Vaccine?.Manufacturer ?? "Unknown",
                BatchNumber = vi.BatchNumber,
                ManufacturingDate = vi.ManufacturingDate,
                ExpiryDate = vi.ExpiryDate,
                InitialQuantity = vi.InitialQuantity,
                QuantityInStock = vi.QuantityInStock,
                TotalQuantity = vi.InitialQuantity - vi.QuantityInStock, // Số lượng vaccine đã xuất (Exported)
                Supplier = vi.Supplier
            }).ToList();
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
                .Select(v => $"{v.Vaccine.Name} - Ngày hết hạn: {v.ExpiryDate.ToShortDateString()}")
                .ToList();

            await _emailService.SendExpiryAlertsAsync(adminEmail, expiringVaccineList);
        }
        
        //Cập nhật Vaccine Inventory
        public async Task<VaccineInventoryDTO> UpdateVaccineInventoryAsync(int id, UpdateVaccineInventoryDTO dto)
        {
            // Tìm kiếm vaccine inventory theo id
            var inventory = await _unitOfWork.VaccineInventories.GetByIdAsync(id);
            if (inventory == null)
            {
                throw new Exception("Không tìm thấy vắc-xin trong kho.");
            }

            // Kiểm tra xem batch number mới có bị trùng không (nếu cập nhật batch number)
            if (!string.IsNullOrEmpty(dto.BatchNumber) && dto.BatchNumber != inventory.BatchNumber)
            {
                var existingBatch = await _unitOfWork.VaccineInventories.GetByBatchNumberAsync(dto.BatchNumber);
                if (existingBatch != null)
                {
                    throw new Exception("Số lô đã tồn tại.");
                }
                inventory.BatchNumber = dto.BatchNumber;
            }

            // Validate the manufacturing date and expiry date
            if (dto.ManufacturingDate.HasValue && dto.ExpiryDate.HasValue && dto.ManufacturingDate.Value > dto.ExpiryDate.Value)
            {
                throw new Exception("Ngày sản xuất không được muộn hơn ngày hết hạn.");
            }

            // Cập nhật thông tin khác nếu có
            if (dto.ManufacturingDate.HasValue)
            {
                inventory.ManufacturingDate = dto.ManufacturingDate.Value;
            }

            if (dto.ExpiryDate.HasValue)
            {
                inventory.ExpiryDate = dto.ExpiryDate.Value;
            }

            inventory.Supplier = dto.Supplier ?? inventory.Supplier;

            // Cập nhật số lượng ban đầu và điều chỉnh tồn kho
            if (dto.InitialQuantity.HasValue)
            {
                int quantityDifference = dto.InitialQuantity.Value - inventory.InitialQuantity;
                inventory.InitialQuantity = dto.InitialQuantity.Value;
                inventory.QuantityInStock += quantityDifference; // Điều chỉnh tồn kho theo số lượng mới
            }

            // Lưu lại thay đổi vào cơ sở dữ liệu
            await _unitOfWork.CompleteAsync();

            // Trả về đối tượng DTO đã được cập nhật
            return _mapper.Map<VaccineInventoryDTO>(inventory);
        }

        // Lấy danh sách tồn kho vaccine theo VaccineId
        public async Task<IEnumerable<VaccineInventoryDTO>> GetVaccineInventoryByIdAsync(int vaccineId)
        {
            var vaccineInventories = await _unitOfWork.VaccineInventories.GetByVaccineIdAsync(vaccineId);

            if (vaccineInventories == null || !vaccineInventories.Any())
            {
                throw new KeyNotFoundException($"Không tìm thấy thông tin tồn kho cho vắc-xin có ID: {vaccineId}");
            }

            // Lọc bỏ các lô đã bị soft delete
            var activeInventories = vaccineInventories.Where(vi => !vi.IsActive).ToList();

            if (!activeInventories.Any())
            {
                throw new Exception("Hiện không có sẵn vắc-xin này trong kho.");
            }

            return activeInventories.Select(vi => new VaccineInventoryDTO
            {
                VaccineInventoryId = vi.VaccineInventoryId,
                VaccineId = vi.VaccineId,
                Name = vi.Vaccine?.Name ?? "Unknown",
                Manufacturer = vi.Vaccine?.Manufacturer ?? "Unknown",
                TotalQuantity = vi.InitialQuantity - vi.QuantityInStock,
                InitialQuantity = vi.InitialQuantity,
                QuantityInStock = vi.QuantityInStock,
                ReturnedQuantity = vi.ReturnedQuantity,
                BatchNumber = vi.BatchNumber,
                ManufacturingDate = vi.ManufacturingDate,
                ExpiryDate = vi.ExpiryDate,
                Supplier = vi.Supplier
            }).ToList();
        }


        //Lấy danh sách vaccine đã hoàn trả về kho(Returned Vaccines)
        public async Task<IEnumerable<ReturnedVaccineDTO>> GetReturnedVaccinesAsync()
        {
            var returnedVaccines = await _unitOfWork.VaccineInventories.GetReturnedVaccinesAsync();

            var returnedVaccineDTOs = returnedVaccines.Select(vi =>
            {
                // Tính số tồn nếu chưa cộng các giao dịch trả
                var stockWithoutReturns = vi.QuantityInStock - vi.ReturnedQuantity;
                // Số vaccine đã xuất = InitialQuantity - stockWithoutReturns
                var exported = vi.InitialQuantity - stockWithoutReturns;
                // Số vaccine trả được chấp nhận không vượt quá số đã xuất
                var acceptedReturn = Math.Min(vi.ReturnedQuantity, exported);
                // Số tồn thực tế sau khi cộng các giao dịch trả
                var actualStock = stockWithoutReturns + acceptedReturn;

                return new ReturnedVaccineDTO
                {
                    VaccineId = vi.VaccineInventoryId,
                    Name = vi.Vaccine != null ? vi.Vaccine.Name : "Unknown",
                    Manufacturer = vi.Vaccine != null ? vi.Vaccine.Manufacturer : "Unknown",
                    BatchNumber = vi.BatchNumber,
                    InitialQuantity = vi.InitialQuantity,
                    QuantityInStock = actualStock,
                    ReturnedQuantity = acceptedReturn,
                    ManufacturingDate = vi.ManufacturingDate,
                    ExpiryDate = vi.ExpiryDate,
                    Supplier = vi.Supplier
                };
            }).ToList();

            return returnedVaccineDTOs;
        }

        // Xóa Mềm  Vaccine Inventory
        public async Task<string> SoftDeleteVaccineInventoryAsync(int vaccineInventoryId)
        {
            var inventory = await _unitOfWork.VaccineInventories.GetByIdAsync(vaccineInventoryId);

            if (inventory == null)
            {
                throw new Exception("Không tìm thấy vắc-xin trong kho.");
            }

            // Đánh dấu lô vaccine này là xóa mềm, nhưng không ảnh hưởng đến các lô khác
            inventory.IsActive = true;
            await _unitOfWork.CompleteAsync();

            return $"Kho vắc-xin có ID  {vaccineInventoryId} đã bị xóa tạm thời.";
        }

        // Lấy danh sách tồn kho vaccine theo VaccineInventoryId
        public async Task<IEnumerable<VaccineInventoryDTO>> GetVaccineInventoryByVaccineInventoryIdAsync(int vaccineInventoryId)
        {
            // Lấy danh sách tồn kho của vaccine theo ID, chỉ lấy những vaccine chưa bị xóa mềm
            var vaccineInventories = await _unitOfWork.VaccineInventories.GetByVaccineInventoryIdAsync(vaccineInventoryId);

            // Lọc những vaccine chưa bị xóa mềm
            //vaccineInventories = vaccineInventories.Where(vi => !vi.IsActive).ToList();

            if (vaccineInventories == null || !vaccineInventories.Any())
            {
                // Ném ngoại lệ nếu không tìm thấy vaccine tồn kho
                throw new KeyNotFoundException($"Không tìm thấy thông tin tồn kho cho vắc-xin có ID: {vaccineInventoryId}");
            }

            // Kiểm tra xem có vaccine nào bị xóa mềm không
            if (vaccineInventories.Any(vi => vi.IsActive))
            {
                throw new InvalidOperationException("Kho vắc-xin này đã bị xóa (xóa tạm thời).");
            }

            // Chuyển đổi danh sách đối tượng thành danh sách DTO
            var vaccineInventoryDTOs = vaccineInventories.Select(vi => new VaccineInventoryDTO
            {
                VaccineInventoryId = vi.VaccineInventoryId,
                VaccineId = vi.VaccineId,
                Name = vi.Vaccine?.Name ?? "Unknown",
                Manufacturer = vi.Vaccine?.Manufacturer ?? "Unknown",
                TotalQuantity = vi.InitialQuantity - vi.QuantityInStock,
                InitialQuantity = vi.InitialQuantity,
                QuantityInStock = vi.QuantityInStock,
                BatchNumber = vi.BatchNumber,
                ManufacturingDate = vi.ManufacturingDate,
                ExpiryDate = vi.ExpiryDate,
                Supplier = vi.Supplier
            }).ToList();

            return vaccineInventoryDTOs;
        }

		public async Task<int> GetAvailableInventoryForVaccineAsync(int vaccineId)
		{
			var inventory = await _unitOfWork.VaccineInventories
				.GetAllAsync(vi => vi.VaccineId == vaccineId && vi.QuantityInStock > 0);

			var selectedInventory = inventory.OrderBy(vi => vi.ExpiryDate).FirstOrDefault();
			if (selectedInventory == null) throw new Exception("Không có lô vắc-xin nào có sẵn.");

			// Giảm số lượng trong kho
			selectedInventory.QuantityInStock -= 1;
			await _unitOfWork.CompleteAsync();

			return selectedInventory.VaccineInventoryId;
		}
	}
}
