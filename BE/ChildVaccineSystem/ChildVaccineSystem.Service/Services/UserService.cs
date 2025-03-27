using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.DTO.User;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ChildVaccineSystem.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IWalletService _walletService;
        public UserService(IUnitOfWork unitOfWork, IUserRepository userRepository, UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IWalletService walletService)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _userManager = userManager;
            _roleManager = roleManager;
            _walletService = walletService;
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

        public async Task<UserDTO> GetUserByPhoneOrEmailAsync(string keyword)
        {
            if (string.IsNullOrEmpty(keyword))
                throw new ArgumentException("Keyword không được để trống");

            var user = await _unitOfWork.Users.GetAsync(u =>
                u.Email.ToLower() == keyword.ToLower() ||
                u.PhoneNumber.ToLower() == keyword.ToLower());

            if (user == null)
                throw new ArgumentException("Không tìm thấy khách hàng với thông tin này");

            return new UserDTO
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth,
                Address = user.Address
            };
        }

        public async Task<(bool Success, string? Message, List<string>? Errors)> CreateUserAsync(RegisterAccountDTO model)
        {
            var errors = new List<string>();

            if (model == null)
            {
                errors.Add("Dữ liệu người dùng không được để trống.");
                return (false, null, errors);
            }

            // Validate Username
            if (string.IsNullOrWhiteSpace(model.UserName))
                errors.Add("Tên đăng nhập không được để trống.");
            else if (model.UserName.Length > 50)
                errors.Add("Tên đăng nhập không được vượt quá 50 ký tự.");
            else
            {
                var existingUserName = await _userManager.FindByNameAsync(model.UserName);
                if (existingUserName != null)
                    errors.Add("Tên đăng nhập đã tồn tại.");
            }

            // Validate Email
            if (string.IsNullOrWhiteSpace(model.Email))
                errors.Add("Email không được để trống.");
            else if (!IsValidEmail(model.Email))
                errors.Add("Email không hợp lệ.");
            else
            {
                var existingEmail = await _userManager.FindByEmailAsync(model.Email);
                if (existingEmail != null)
                    errors.Add("Email đã được sử dụng.");
            }

            // Validate Phone Number
            if (string.IsNullOrWhiteSpace(model.PhoneNumber) || !IsValidPhoneNumber(model.PhoneNumber))
                errors.Add("Số điện thoại không hợp lệ. Phải bắt đầu bằng số 0 và tối đa 10 chữ số.");
            else
            {
                var existingPhone = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
                if (existingPhone != null)
                    errors.Add("Số điện thoại đã được sử dụng.");
            }

            // Validate Full Name
            if (string.IsNullOrWhiteSpace(model.FullName))
                errors.Add("Họ tên không được để trống.");
            else if (model.FullName.Length > 100)
                errors.Add("Họ tên không được vượt quá 100 ký tự.");

            // Validate Address
            if (!string.IsNullOrWhiteSpace(model.Address) && model.Address.Length > 200)
                errors.Add("Địa chỉ không được vượt quá 200 ký tự.");

            // Validate Date of Birth (phải ít nhất 25 tuổi)
            if (model.DateOfBirth == default)
            {
                errors.Add("Ngày sinh không được để trống.");
            }
            else if (model.DateOfBirth > DateTime.Today)
            {
                errors.Add("Ngày sinh không thể lớn hơn ngày hiện tại.");
            }
            else
            {
                int age = DateTime.Today.Year - model.DateOfBirth.Year;
                if (model.DateOfBirth > DateTime.Today.AddYears(-age)) age--;
                if (age < 25)
                    errors.Add("Người dùng phải đủ 25 tuổi trở lên.");
            }

            // Validate Role
            if (string.IsNullOrWhiteSpace(model.Role))
                errors.Add("Vai trò không được để trống.");
            else if (!await _roleManager.RoleExistsAsync(model.Role))
                errors.Add($"Vai trò '{model.Role}' không tồn tại.");

            // Validate Certificate URL
            if (!string.IsNullOrEmpty(model.CertificateImageUrl) &&
                !Uri.IsWellFormedUriString(model.CertificateImageUrl, UriKind.Absolute))
                errors.Add("Đường dẫn ảnh chứng chỉ không hợp lệ.");

            // Validate Password
            if (!IsStrongPassword(model.Password))
                errors.Add("Mật khẩu phải dài ít nhất 6 ký tự, bao gồm ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt.");

            if (errors.Any())
                return (false, null, errors);

            // Create User
            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName,
                Address = model.Address,
                PhoneNumber = model.PhoneNumber,
                DateOfBirth = model.DateOfBirth,
                EmailConfirmed = true,
                IsActive = true,
                CertificateImageUrl = model.CertificateImageUrl
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var identityErrors = result.Errors.Select(e => e.Description).ToList();
                return (false, null, identityErrors);
            }

            if (model.Role == "Customer")
                await _walletService.CreateWalletAsync(user.Id, isAdminWallet: false);

            await _userManager.AddToRoleAsync(user, model.Role);

            return (true, $"Tài khoản đã được tạo thành công với vai trò '{model.Role}'", null);
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPhoneNumber(string phoneNumber)
        {
            return phoneNumber.Length <= 10 && phoneNumber.StartsWith("0") && phoneNumber.All(char.IsDigit);
        }

        private bool IsStrongPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
                return false;

            bool hasUpper = password.Any(char.IsUpper);
            bool hasLower = password.Any(char.IsLower);
            bool hasDigit = password.Any(char.IsDigit);
            bool hasSpecial = password.Any(ch => !char.IsLetterOrDigit(ch));

            return hasUpper && hasLower && hasDigit && hasSpecial;
        }
    }
}
