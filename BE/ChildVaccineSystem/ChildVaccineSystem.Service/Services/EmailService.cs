using ChildVaccineSystem.Data.DTO.Email;
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
                throw new Exception("Địa chỉ email không hợp lệ: " + email);
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
                throw new Exception("Địa chỉ email không hợp lệ: " + email);
            }

            var request = new EmailRequestDTO
            {
                Subject = "Đặt lại mật khẩu của bạn",
                toEmail = email,
                Body = $"<p>Nhấp chuột <a href='{resetLink}'>tại đây</a> để đặt lại mật khẩu của bạn.</p>"
            };

            _emailRepository.SendEmailForgotPassword(request, resetLink);
        }
        public async Task SendExpiryAlertsAsync(string adminEmail, List<string> expiringVaccines)
        {
            if (string.IsNullOrEmpty(adminEmail) || !adminEmail.Contains("@"))
            {
                throw new Exception("Địa chỉ email admin không hợp lệ: " + adminEmail);
            }

            if (expiringVaccines == null || !expiringVaccines.Any())
            {
                return; 
            }

            string subject = "Cảnh báo vắc-xin hết hạn!";
            StringBuilder bodyBuilder = new StringBuilder();
            bodyBuilder.Append("<h3>Cảnh báo: Các loại vắc-xin sau đây sắp hết hạn.</h3><ul>");

            foreach (var vaccineInfo in expiringVaccines)
            {
                bodyBuilder.Append($"<li>{vaccineInfo}</li>");
            }

            bodyBuilder.Append("</ul>");
            bodyBuilder.Append("<p>Vui lòng kiểm tra và xử lý kịp thời.</p>");

            EmailRequestDTO request = new EmailRequestDTO
            {
                Subject = subject,
                toEmail = adminEmail,
                Body = bodyBuilder.ToString()
            };

            await Task.Run(() => _emailRepository.SendEmail(request));
        }
    }
}
