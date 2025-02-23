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
            var createdSchedule = await _unitOfWork.Vaccines.AddAsync(vaccine);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<VaccineDTO>(createdSchedule);
        }

        public async Task<VaccineDTO> UpdateVaccineAsync(int id, UpdateVaccineDTO updatedVaccineDto)
        {
            var existingSchedule = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == id);
            if (existingSchedule == null) return null;

            _mapper.Map(updatedVaccineDto, existingSchedule);
			var updatedVaccine = await _unitOfWork.Vaccines.UpdateAsync(existingSchedule);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<VaccineDTO>(updatedVaccine);
        }

        public async Task<bool> DeleteVaccineAsync(int id)
        {
            var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == id);
            if (vaccine == null) return false;

            await _unitOfWork.Vaccines.DeleteAsync(vaccine);
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
    }
}