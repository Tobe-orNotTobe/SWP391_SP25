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
                throw new Exception("ComboVaccine not found.");
            return _mapper.Map<ComboVaccineDTO>(combo);
        }

        public async Task<ComboVaccineDTO> CreateAsync(CreateComboVaccineDTO comboDto)
        {
            comboDto.VaccineIds = comboDto.VaccineIds.Distinct().ToList();

            var combo = _mapper.Map<ComboVaccine>(comboDto);

            combo.ComboDetails = comboDto.VaccineIds
                .Select(vaccineId => new ComboDetail
                {
                    ComboId = combo.ComboId,
                    VaccineId = vaccineId
                })
                .ToList();

            var createdCombo = await _unitOfWork.ComboVaccines.AddAsync(combo);
            await _unitOfWork.CompleteAsync();

            var fullCombo = await _unitOfWork.ComboVaccines.GetById(createdCombo.ComboId);
            return _mapper.Map<ComboVaccineDTO>(fullCombo);
        }


        public async Task<ComboVaccineDTO> UpdateAsync(int id, UpdateComboVaccineDTO comboDto)
        {
            var existingCombo = await _unitOfWork.ComboVaccines.GetById(id);
            if (existingCombo == null) return null;

            if (comboDto.VaccineIds != null && comboDto.VaccineIds.Distinct().Count() != comboDto.VaccineIds.Count)
            {
                throw new Exception("Combo Vaccine cannot contain duplicate vaccines. Please remove duplicate entries and try again.");
            }

            var existingVaccineIds = existingCombo.ComboDetails.Select(cd => cd.VaccineId).ToList();

            if (comboDto.VaccineIds != null)
            {
                var duplicates = comboDto.VaccineIds.Intersect(existingVaccineIds).ToList();
                if (duplicates.Any())
                {
                    throw new Exception($"The following vaccine IDs already exist in the combo: {string.Join(", ", duplicates)}. Please remove them and try again.");
                }

                var comboDetailsToDelete = existingCombo.ComboDetails.ToList();
                _unitOfWork.ComboDetails.RemoveRange(comboDetailsToDelete);

                foreach (var vaccineId in comboDto.VaccineIds)
                {
                    existingCombo.ComboDetails.Add(new ComboDetail
                    {
                        ComboId = existingCombo.ComboId,
                        VaccineId = vaccineId
                    });
                }
            }

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
