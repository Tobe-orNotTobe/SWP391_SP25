using ChildVaccineSystem.Data.DTO.Email;
using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IEmailService
    {
        public void SendEmail(EmailRequestDTO request);
        public void SendEmailConfirmation(string username, string confirmLink);         
        Task SendEmailForgotPassword(string email, string resetLink);
        Task SendExpiryAlertsAsync(string adminEmail, List<string> expiringVaccines);

    }
}
