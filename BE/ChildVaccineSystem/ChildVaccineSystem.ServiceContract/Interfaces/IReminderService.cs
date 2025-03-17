using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IReminderService
	{
		Task ProcessAppointmentRemindersAsync(int daysThreshold);
		Task CreateReminderForBookingAsync(int bookingId);
	}
}