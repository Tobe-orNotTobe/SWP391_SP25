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
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        public UserService(IUnitOfWork unitOfWork) { _unitOfWork = unitOfWork; }

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
    }
}
