using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.Data.Models;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ChildVaccineSystemDBContext _context;
        private readonly UserManager<User> _userManager;

        public UserRepository(ChildVaccineSystemDBContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<bool> IsUsernameExistsAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.UserName == username);
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> IsPhoneNumberExistsAsync(string phoneNumber)
        {
            return await _context.Users.AnyAsync(u => u.PhoneNumber == phoneNumber);
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
        public async Task<bool> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            return true;
        }
        public async Task<bool> UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            return true;
        }
        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;
            _context.Users.Remove(user);
            return true;
        }
        public async Task<bool> ActivateUserAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;
            user.IsActive = true;
            return true;
        }
        public async Task<bool> DeactivateUserAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;
            user.IsActive = false;
            return true;
        }
        public async Task<IEnumerable<User>> SearchUsersAsync(string keyword)
        {
            return await _context.Users.Where(u => u.FullName.Contains(keyword) || u.Email.Contains(keyword)).ToListAsync();
        }
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetAsync(Expression<Func<User, bool>> filter)
        {
            return await _context.Users.FirstOrDefaultAsync(filter);
        }
        public async Task<bool> ChangePasswordAsync(string userId, string oldPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false; 
            }

            var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            return result.Succeeded;
        }

        public async Task<bool> UpdateUserProfileAsync(User user)
        {
            try
            {
                _context.Users.Update(user);
                await _context.SaveChangesAsync(); // Ensure the changes are saved to the database
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<User> GetUserByPhoneOrEmailAsync(string keyword)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == keyword.ToLower() ||
                                          u.PhoneNumber.ToLower() == keyword.ToLower());
        }

    }
}
