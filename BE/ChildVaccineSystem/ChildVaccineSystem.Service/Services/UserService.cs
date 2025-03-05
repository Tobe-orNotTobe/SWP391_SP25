using ChildVaccineSystem.Data.DTO.User;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;

namespace ChildVaccineSystem.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        public UserService(IUnitOfWork unitOfWork, IUserRepository userRepository)
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
        public async Task<UserProfileDTO> GetProfileAsync(string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return null;

            return new UserProfileDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                DateOfBirth = user.DateOfBirth,
                ImageUrl = user.ImageUrl
            };
        }
        public async Task<bool> UpdateProfileAsync(UserProfileDTO userDTO)
        {
            try
            {
                // Lấy người dùng từ repository
                var user = await _userRepository.GetUserByIdAsync(userDTO.Id);
                if (user == null)
                {
                    return false; // Nếu không tìm thấy người dùng
                }

                // Cập nhật thông tin người dùng chỉ khi có giá trị mới
                if (!string.IsNullOrEmpty(userDTO.FullName))
                {
                    user.FullName = userDTO.FullName;
                }

                if (!string.IsNullOrEmpty(userDTO.Address))
                {
                    user.Address = userDTO.Address;
                }

                if (!string.IsNullOrEmpty(userDTO.PhoneNumber))
                {
                    user.PhoneNumber = userDTO.PhoneNumber;
                }

                if (userDTO.DateOfBirth.HasValue)
                {
                    user.DateOfBirth = userDTO.DateOfBirth.Value;
                }

                if (!string.IsNullOrEmpty(userDTO.ImageUrl))
                {
                    user.ImageUrl = userDTO.ImageUrl; // Cập nhật ảnh nếu có
                }

                // Lưu thay đổi
                var result = await _userRepository.UpdateUserProfileAsync(user);
                if (result)
                {
                    await _userRepository.SaveChangesAsync(); // Lưu vào database
                }

                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }



        public async Task<bool> ChangePasswordAsync(string userId, string oldPassword, string newPassword)
        {
            return await _userRepository.ChangePasswordAsync(userId, oldPassword, newPassword); // Gọi repository để thay đổi mật khẩu
        }

    }
}
