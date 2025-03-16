using AutoMapper;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.DTO.Vaccine;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Repository.Repositories;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.Service.Services;
using ChildVaccineSystem.ServiceContract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Services
{
	public class VaccineService : IVaccineService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IVaccineRepository _vaccineRepository;
        private readonly IEmailService _emailService;
        public VaccineService(IUnitOfWork unitOfWork, IMapper mapper, IEmailService emailService, IVaccineRepository vaccineRepository)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
            _vaccineRepository = vaccineRepository;
        }

        public async Task<List<VaccineDTO>> GetAllVaccinesAsync()
        {
            var vaccines = await _unitOfWork.Vaccines.GetAllAsync();
            return _mapper.Map<List<VaccineDTO>>(vaccines);
        }

        public async Task<VaccineDTO> GetVaccineByIdAsync(int id)
        {
            var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == id);
            return _mapper.Map<VaccineDTO>(vaccine);
        }

        public async Task<VaccineDTO> CreateVaccineAsync(CreateVaccineDTO vaccineDto)
        {
            var vaccine = _mapper.Map<Vaccine>(vaccineDto);

            // ✅ Xử lý Parent Vaccine nếu có
            if (vaccineDto.IsParentId.HasValue)
            {
                vaccine.ParentVaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == vaccineDto.IsParentId.Value);
            }

            var createdVaccine = await _unitOfWork.Vaccines.AddAsync(vaccine);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<VaccineDTO>(createdVaccine);
        }


        public async Task<VaccineDTO> UpdateVaccineAsync(int id, UpdateVaccineDTO updatedVaccineDto)
        {
            var existingVaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == id);
            if (existingVaccine == null) return null;

            _mapper.Map(updatedVaccineDto, existingVaccine);

            // ✅ Xử lý Parent Vaccine nếu có
            if (updatedVaccineDto.IsParentId.HasValue)
            {
                existingVaccine.ParentVaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == updatedVaccineDto.IsParentId.Value);
            }

            var updatedVaccine = await _unitOfWork.Vaccines.UpdateAsync(existingVaccine);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<VaccineDTO>(updatedVaccine);
        }


        public async Task<bool> DeleteVaccineAsync(int id)
        {
            var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == id);
            if (vaccine == null) return false;

            var childVaccines = await _unitOfWork.Vaccines.GetAllAsync(v => v.IsParentId == id);
            if (childVaccines.Any())
            {
                foreach (var childVaccine in childVaccines)
                {
                    childVaccine.IsParentId = null; // Ngắt liên kết với vaccine cha
                    await _unitOfWork.Vaccines.UpdateAsync(childVaccine);
                }
            }

            vaccine.Status = false;
            await _unitOfWork.Vaccines.UpdateAsync(vaccine);
            await _unitOfWork.CompleteAsync();

            return true;
        }


        public async Task<List<VaccineDTO>> GetVaccinesByTypeAsync(bool isNecessary)
        {
            var vaccines = await _unitOfWork.Vaccines.GetAllAsync();
            var filteredVaccines = vaccines.Where(v => v.IsNecessary == isNecessary).ToList();
            return _mapper.Map<List<VaccineDTO>>(filteredVaccines);
        }
        public async Task<List<VaccineBasicDTO>> GetBasicVaccinesAsync()
        {
            var vaccines = await _unitOfWork.Vaccines.GetAllAsync();
            return _mapper.Map<List<VaccineBasicDTO>>(vaccines);
        }
        public async Task<List<TopUsedVaccineDTO>> GetTopUsedVaccinesAsync()
        {
            var data = await _unitOfWork.BookingDetails.GetAllAsync(includeProperties: "Vaccine");

            var result = data
                .Where(d => d.VaccineId.HasValue && d.Vaccine != null) // ✅ Kiểm tra Vaccine != null
                .GroupBy(d => d.VaccineId)
                .Select(group => new TopUsedVaccineDTO
                {
                    VaccineId = group.Key.Value,
                    VaccineName = group.FirstOrDefault()?.Vaccine?.Name ?? "Unknown", // ✅ Kiểm tra null trước khi truy cập
                    Count = group.Count()
                })
                .OrderByDescending(v => v.Count)
                .Take(5)
                .ToList();

            return result;
        }

    }
}