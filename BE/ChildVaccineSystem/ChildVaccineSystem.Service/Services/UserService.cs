using ChildVaccineSystem.Data.DTO.User;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Repository.Repositories;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        public UserService(IUnitOfWork unitOfWork, IUserRepository userRepository ) 
        { 
            _unitOfWork = unitOfWork; 
            _userRepository = userRepository;
        }

        public Task<IEnumerable<User>> GetAllUsers()
        {
            return _unitOfWork.Users.GetAllUsersAsync();
        }
        public Task<User> GetUserById(string id)
        {
            return _unitOfWork.Users.GetUserByIdAsync(id);
        }
        public Task<bool> CreateUser(User user)
        {
            return _unitOfWork.Users.CreateUserAsync(user);
        }
        public Task<bool> UpdateUser(User user)
        {
            return _unitOfWork.Users.UpdateUserAsync(user);
        }
        public Task<bool> DeleteUser(string id)
        {
            return _unitOfWork.Users.DeleteUserAsync(id);
        }
        public Task<bool> ActivateUser(string id)
        {
            return _unitOfWork.Users.ActivateUserAsync(id);
        }
        public Task<bool> DeactivateUser(string id)
        {
            return _unitOfWork.Users.DeactivateUserAsync(id);
        }
        public Task<IEnumerable<User>> SearchUsers(string keyword)
        {
            return _unitOfWork.Users.SearchUsersAsync(keyword);
        }
        public async Task<UserDTO> GetProfileAsync(string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return null;

            return new UserDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                DateOfBirth = user.DateOfBirth,
                ImageUrl = user.ImageUrl
            };
        }

        public async Task<bool> UpdateProfileAsync(UserDTO userDTO)
        {
            var user = await _userRepository.GetUserByIdAsync(userDTO.Id);
            if (user == null) return false;

            user.FullName = userDTO.FullName;
            user.Address = userDTO.Address;
            user.PhoneNumber = userDTO.PhoneNumber;
            user.DateOfBirth = (DateTime)userDTO.DateOfBirth;
            if (!string.IsNullOrEmpty(userDTO.ImageUrl))
            {
                user.ImageUrl = userDTO.ImageUrl; 
            }

            return await _userRepository.UpdateUserAsync(user);
        }

        public async Task<bool> ChangePasswordAsync(string userId, string oldPassword, string newPassword)
        {
            return await _userRepository.ChangePasswordAsync(userId, oldPassword, newPassword); // Gọi repository để thay đổi mật khẩu
        }

    }
}
