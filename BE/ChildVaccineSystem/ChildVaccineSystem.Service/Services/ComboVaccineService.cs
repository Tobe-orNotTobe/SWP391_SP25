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

namespace ChildVaccineSystem.Service.Services
{
    public class ComboVaccineService : IComboVaccineService
    {
        private readonly IComboVaccineRepository _comboRepository;
        private readonly IMapper _mapper;

        public ComboVaccineService(IComboVaccineRepository comboRepository, IMapper mapper)
        {
            _comboRepository = comboRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ComboVaccineDTO>> GetAllAsync()
        {
            var combos = await _comboRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ComboVaccineDTO>>(combos);
        }

        public async Task<ComboVaccineDTO> GetByIdAsync(int id)
        {
            var combo = await _comboRepository.GetByIdAsync(id);
            return _mapper.Map<ComboVaccineDTO>(combo);
        }

        public async Task<ComboVaccineDTO> CreateAsync(ComboVaccineDTO comboDto)
        {
            var combo = _mapper.Map<ComboVaccine>(comboDto);
            return _mapper.Map<ComboVaccineDTO>(await _comboRepository.CreateAsync(combo, comboDto.VaccineIds));
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _comboRepository.DeleteAsync(id);
        }
    }
}
