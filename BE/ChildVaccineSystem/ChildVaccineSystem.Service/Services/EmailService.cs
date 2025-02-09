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

        public void SendEmailConfirmation(string email, string confirmLink)
        {
            if (string.IsNullOrEmpty(email) || !email.Contains("@"))
            {
                throw new Exception("Invalid email address: " + email);
            }

            EmailRequestDTO request = new EmailRequestDTO
            {
                Subject = "ChildVaccine Email Confirmation",
                toEmail = email,
                Body = $"Click vào link sau để xác nhận tài khoản: {confirmLink}"
            };
            _emailRepository.SendEmailConfirmation(request, confirmLink);

        }

        public async Task SendEmailForgotPassword(string email, string resetLink)
        {
            if (string.IsNullOrEmpty(email) || !email.Contains("@"))
            {
                throw new Exception("Invalid email address: " + email);
            }

            var request = new EmailRequestDTO
            {
                Subject = "Reset Your Password",
                toEmail = email,
                Body = $"<p>Click <a href='{resetLink}'>here</a> to reset your password.</p>"
            };

            _emailRepository.SendEmailForgotPassword(request, resetLink);
        }
    }
}
