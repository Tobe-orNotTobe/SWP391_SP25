using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;

namespace ChildVaccineSystem.Service.Services
{
    public class ComboVaccineService : IComboVaccineService
    {
        private readonly IComboVaccineRepository _comboVaccineRepository;
        private readonly IVaccineRepository _vaccineRepository;
        private readonly IMapper _mapper;

        public ComboVaccineService(
            IComboVaccineRepository comboVaccineRepository,
            IVaccineRepository vaccineRepository,
            IMapper mapper)
        {
            _comboVaccineRepository = comboVaccineRepository;
            _vaccineRepository = vaccineRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ComboVaccineDTO>> GetAllAsync()
        {
            var combos = await _comboVaccineRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ComboVaccineDTO>>(combos);
        }

        public async Task<ComboVaccineDTO> GetByIdAsync(int id)
        {
            var combo = await _comboVaccineRepository.GetByIdAsync(id);
            return _mapper.Map<ComboVaccineDTO>(combo);
        }

        public async Task<ComboVaccineDTO> CreateAsync(ComboVaccineDTO comboDto)
        {
            // Validate VaccineIds
            var existingVaccineIds = await _vaccineRepository.GetAllIdsAsync();
            if (comboDto.VaccineIds.Except(existingVaccineIds).Any())
            {
                throw new Exception("One or more VaccineIds do not exist.");
            }

            // Map DTO to Entity
            var combo = _mapper.Map<ComboVaccine>(comboDto);

            // Call repository to save
            var createdCombo = await _comboVaccineRepository.CreateAsync(combo);
            return _mapper.Map<ComboVaccineDTO>(createdCombo);
        }

        public async Task<ComboVaccineDTO> UpdateAsync(int id, ComboVaccineDTO comboDto)
        {
            if (id != comboDto.ComboId)
                throw new Exception("Mismatch between provided ComboId and DTO ComboId.");

            var combo = _mapper.Map<ComboVaccine>(comboDto);
            var updatedCombo = await _comboVaccineRepository.UpdateAsync(combo);
            return _mapper.Map<ComboVaccineDTO>(updatedCombo);
        }


        public async Task<bool> DeleteAsync(int id)
        {
            return await _comboVaccineRepository.DeleteAsync(id);
        }
    }
}
