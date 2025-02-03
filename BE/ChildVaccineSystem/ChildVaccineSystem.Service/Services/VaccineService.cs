using AutoMapper;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Services
{
    public class VaccineService : IVaccineService
    {
        private readonly IVaccineRepository _vaccineRepository;
        private readonly IMapper _mapper;

        public VaccineService(IVaccineRepository vaccineRepository, IMapper mapper)
        {
            _vaccineRepository = vaccineRepository;
            _mapper = mapper;
        }

        public async Task<List<VaccineDTO>> GetAllVaccinesAsync()
        {
            var vaccines = await _vaccineRepository.GetAllAsync();
            return _mapper.Map<List<VaccineDTO>>(vaccines);
        }

        public async Task<VaccineDTO> GetVaccineByIdAsync(int id)
        {
            var vaccine = await _vaccineRepository.GetByIdAsync(id);
            return _mapper.Map<VaccineDTO>(vaccine);
        }

        public async Task<VaccineDTO> CreateVaccineAsync(VaccineDTO vaccineDto)
        {
            var vaccine = _mapper.Map<Vaccine>(vaccineDto);
            var createdVaccine = await _vaccineRepository.CreateAsync(vaccine);
            return _mapper.Map<VaccineDTO>(createdVaccine);
        }

        public async Task<VaccineDTO> UpdateVaccineAsync(int id, VaccineDTO updatedVaccineDto)
        {
            var vaccine = await _vaccineRepository.GetByIdAsync(id);
            if (vaccine == null) return null;

            _mapper.Map(updatedVaccineDto, vaccine);
            var updatedVaccine = await _vaccineRepository.UpdateAsync(id, vaccine);
            return _mapper.Map<VaccineDTO>(updatedVaccine);
        }

        public async Task<bool> DeleteVaccineAsync(int id)
        {
            return await _vaccineRepository.DeleteAsync(id);
        }

        public async Task<List<VaccineDTO>> GetVaccinesByTypeAsync(bool isNecessary)
        {
            var vaccines = await _vaccineRepository.GetAllAsync();
            var filteredVaccines = vaccines.Where(v => v.IsNecessary == isNecessary).ToList();
            return _mapper.Map<List<VaccineDTO>>(filteredVaccines);
        }
    }
}

