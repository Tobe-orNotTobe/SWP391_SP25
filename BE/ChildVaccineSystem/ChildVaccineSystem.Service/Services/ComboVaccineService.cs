using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ChildVaccineSystem.Data.DTO.ComboVaccine;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;

namespace ChildVaccineSystem.Service.Services
{
    public class ComboVaccineService : IComboVaccineService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ComboVaccineService(IUnitOfWork unitOfWork, IComboVaccineRepository comboVaccineRepository, IVaccineRepository vaccineRepository, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ComboVaccineDTO>> GetAllAsync()
        {
            var combos = await _unitOfWork.ComboVaccines.GetAll();
            return _mapper.Map<IEnumerable<ComboVaccineDTO>>(combos);
        }

        public async Task<ComboVaccineDTO> GetByIdAsync(int id)
        {
            var combo = await _unitOfWork.ComboVaccines.GetById(id);
            if (combo == null)
                throw new Exception("ComboVaccine không tìm thấy.");
            return _mapper.Map<ComboVaccineDTO>(combo);
        }

        public async Task<ComboVaccineDTO> CreateAsync(CreateComboVaccineDTO comboDto)
        {
            var combo = _mapper.Map<ComboVaccine>(comboDto);

            combo.ComboDetails = comboDto.Vaccines
                .Select(vaccine => new ComboDetail
                {
                    ComboId = combo.ComboId,
                    VaccineId = vaccine.VaccineId,
                    Order = vaccine.Order,
                    IntervalDays = vaccine.IntervalDays
                }).ToList();

            var createdCombo = await _unitOfWork.ComboVaccines.AddAsync(combo);
            await _unitOfWork.CompleteAsync();

            var fullCombo = await _unitOfWork.ComboVaccines.GetById(createdCombo.ComboId);
            return _mapper.Map<ComboVaccineDTO>(fullCombo);
        }



        public async Task<ComboVaccineDTO> UpdateAsync(int id, UpdateComboVaccineDTO comboDto)
        {
            var existingCombo = await _unitOfWork.ComboVaccines.GetById(id);
            if (existingCombo == null) return null;

            _unitOfWork.ComboDetails.RemoveRange(existingCombo.ComboDetails);

            existingCombo.ComboDetails = comboDto.Vaccines
                .Select(vaccine => new ComboDetail
                {
                    ComboId = existingCombo.ComboId,
                    VaccineId = vaccine.VaccineId,
                    Order = vaccine.Order,
                    IntervalDays = vaccine.IntervalDays
                }).ToList();

            _mapper.Map(comboDto, existingCombo);

            await _unitOfWork.ComboVaccines.UpdateAsync(existingCombo);
            await _unitOfWork.CompleteAsync();

            var fullCombo = await _unitOfWork.ComboVaccines.GetById(id);
            return _mapper.Map<ComboVaccineDTO>(fullCombo);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var combo = await _unitOfWork.ComboVaccines.GetById(id);
            if (combo == null) return false;

            combo.IsActive = false;
            await _unitOfWork.ComboVaccines.UpdateAsync(combo);
            await _unitOfWork.CompleteAsync();

            return true;
        }

    }
}
