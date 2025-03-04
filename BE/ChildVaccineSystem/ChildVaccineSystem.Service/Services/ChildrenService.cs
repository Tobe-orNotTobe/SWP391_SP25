using AutoMapper;
using ChildVaccineSystem.Data.DTO.Children;
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
    public class ChildrenService : IChildrenService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ChildrenService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<List<ChildrenDTO>> GetAllChildrenAsync()
        {
            var children = await _unitOfWork.Children.GetAllAsync();
            return _mapper.Map<List<ChildrenDTO>>(children);
        }

        public async Task<List<ChildrenDTO>> GetChildrenByUserIdAsync(string userId)
        {
            var children = await _unitOfWork.Children.GetAllAsync(c => c.UserId == userId);
            return _mapper.Map<List<ChildrenDTO>>(children);
        }

        public async Task<ChildrenDTO> GetChildByIdAsync(int id)
        {
            var child = await _unitOfWork.Children.GetAsync(c => c.ChildId == id);
            return _mapper.Map<ChildrenDTO>(child);
        }

        public async Task<ChildrenDTO> CreateChildAsync(CreateChildrenDTO childDto, string userId)
        {
            var child = _mapper.Map<Children>(childDto);
            child.UserId = userId;

            var createdChild = await _unitOfWork.Children.AddAsync(child);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<ChildrenDTO>(createdChild);
        }



        public async Task<ChildrenDTO> UpdateChildAsync(int id, UpdateChildrenDTO updatedChildDto)
        {
            var existingChild = await _unitOfWork.Children.GetAsync(c => c.ChildId == id);
            if (existingChild == null) return null;

            _mapper.Map(updatedChildDto, existingChild);
            var updatedChild = await _unitOfWork.Children.UpdateAsync(existingChild);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<ChildrenDTO>(updatedChild);
        }

        public async Task<bool> DeleteChildAsync(int id)
        {
            var existingChild = await _unitOfWork.Children.GetAsync(c => c.ChildId == id);
            if (existingChild == null) return false;

            await _unitOfWork.Children.DeleteAsync(existingChild);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
