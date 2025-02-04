using AutoMapper;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
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

        public VaccineService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<VaccineDTO>> GetAllVaccinesAsync()
        {
            var vaccines = await _unitOfWork.Vaccines.GetAllAsync();
            return _mapper.Map<List<VaccineDTO>>(vaccines);
        }

        public async Task<VaccineDTO> GetVaccineByIdAsync(int id)
        {
            var vaccine = await _unitOfWork.Vaccines.GetByIdAsync(id);
            return _mapper.Map<VaccineDTO>(vaccine);
        }

        public async Task<VaccineDTO> CreateVaccineAsync(VaccineDTO vaccineDto)
        {
            var vaccine = _mapper.Map<Vaccine>(vaccineDto);
            await _unitOfWork.Vaccines.CreateAsync(vaccine);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<VaccineDTO>(vaccine);
        }

        public async Task<VaccineDTO> UpdateVaccineAsync(int id, VaccineDTO updatedVaccineDto)
        {
            var vaccine = await _unitOfWork.Vaccines.GetByIdAsync(id);
            if (vaccine == null) return null;

            _mapper.Map(updatedVaccineDto, vaccine);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<VaccineDTO>(vaccine);
        }

        public async Task<bool> DeleteVaccineAsync(int id)
        {
            var vaccine = await _unitOfWork.Vaccines.GetByIdAsync(id);
            if (vaccine == null) return false;

            await _unitOfWork.Vaccines.DeleteAsync(id);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<List<VaccineDTO>> GetVaccinesByTypeAsync(bool isNecessary)
        {
            var vaccines = await _unitOfWork.Vaccines.GetAllAsync();
            var filteredVaccines = vaccines.Where(v => v.IsNecessary == isNecessary).ToList();
            return _mapper.Map<List<VaccineDTO>>(filteredVaccines);
        }
    }
}