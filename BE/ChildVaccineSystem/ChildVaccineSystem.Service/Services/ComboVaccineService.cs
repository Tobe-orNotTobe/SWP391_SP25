using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ChildVaccineSystem.Data.DTO.ComboVaccine;
using ChildVaccineSystem.Data.DTO.Vaccine;
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

            var comboDto = _mapper.Map<ComboVaccineDTO>(combo);

            decimal totalPrice = 0;

            foreach (var comboDetail in combo.ComboDetails)
            {
                var vaccine = await _unitOfWork.Vaccines.GetAsync(v => v.VaccineId == comboDetail.VaccineId);
                if (vaccine != null)
                {
                    comboDto.Vaccines.Add(new VaccineDTO
                    {
                        VaccineId = vaccine.VaccineId,
                        Name = vaccine.Name,
                        Price = vaccine.Price 
                    });

                    totalPrice += vaccine.Price;  
                }
            }

            comboDto.TotalPrice = totalPrice;

            return comboDto;
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

            _mapper.Map(comboDto, existingCombo);

            if (comboDto.VaccineIds != null && comboDto.VaccineIds.Any())
            {
                if (comboDto.VaccineIds.Distinct().Count() != comboDto.VaccineIds.Count)
                {
                    throw new Exception("Combo Vaccine cannot contain duplicate vaccines. Please remove duplicate entries and try again.");
                }

                var existingVaccineIds = existingCombo.ComboDetails.Select(cd => cd.VaccineId).ToList();
                var newVaccines = comboDto.VaccineIds.Except(existingVaccineIds).ToList();
                var removedVaccines = existingVaccineIds.Except(comboDto.VaccineIds).ToList();

                if (newVaccines.Any() || removedVaccines.Any())
                {
                    existingCombo.ComboDetails.Clear();
                    foreach (var vaccineId in comboDto.VaccineIds)
                    {
                        existingCombo.ComboDetails.Add(new ComboDetail
                        {
                            ComboId = existingCombo.ComboId,
                            VaccineId = vaccineId
                        });
                    }
                }
            }

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
