﻿using ChildVaccineSystem.Data.DTO.User;
using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(string id);
        Task<bool> CreateUser(User user);
        Task<bool> UpdateUser(User user);
        Task<bool> DeleteUser(string id);
        Task<bool> ActivateUser(string id);
        Task<bool> DeactivateUser(string id);
        Task<IEnumerable<User>> SearchUsers(string keyword);
        Task<UserDTO> GetProfileAsync(string userId);
        Task<bool> UpdateProfileAsync(UserDTO userDTO);
        Task<bool> ChangePasswordAsync(string userId, string oldPassword, string newPassword);
    }
}
