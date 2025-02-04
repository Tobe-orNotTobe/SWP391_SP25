using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Service.Services
{
    public class EmailService : IEmailService
    {
        private readonly IEmailRepository _emailRepository;
        private readonly IConfiguration _configuration;

        public EmailService(IEmailRepository emailRepository, IConfiguration configuration)
        {
            _emailRepository = emailRepository;
            _configuration = configuration;
        }
        public void SendEmail(EmailRequestDTO request)
        {
            try
            {
                _emailRepository.SendEmail(request);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }

        public void SendEmailConfirmation(string username, string confirmLink)
        {
            EmailRequestDTO request = new EmailRequestDTO
            {
                Subject = "Cursus Email Confirmation",
                Body = "",
                toEmail = username
            };
            _emailRepository.SendEmailConfirmation(request, confirmLink);

        }

        public async Task SendEmailAsync(User user, string resetLink)
        {
            var emailRequest = new EmailRequestDTO
            {
                Subject = "Password Reset Request",
                toEmail = user.Email // Sử dụng email thực của người dùng
            };

            _emailRepository.SendEmailForgotPassword(emailRequest, resetLink);

        }

    }
}
