using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;

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

        public async Task<List<ComboVaccineDTO>> GetAllAsync()
        {
            var combos = await _comboRepository.GetAllAsync();
            return _mapper.Map<List<ComboVaccineDTO>>(combos);
        }

        public async Task<ComboVaccineDTO?> GetByIdAsync(int id)
        {
            var combo = await _comboRepository.GetByIdAsync(id);
            return _mapper.Map<ComboVaccineDTO>(combo);
        }
    }
}
