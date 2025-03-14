using ChildVaccineSystem.Data.DTO.VaccineRecord;
using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
    public interface IVaccineRecordService
    {
        Task<VaccineRecordDTO> CreateVaccinationRecordAsync(int bookingId, string doctorId);
        Task ProcessVaccineRecord(BookingDetail detail, Booking booking, List<VaccineRecordDetailDTO> vaccineRecords);
        Task<DateTime?> CalculateNextDoseDateAsync(int vaccineId, int sequence);
        Task<int> GetCurrentVaccineSequenceAsync(int childId, int vaccineId);
        Task<VaccineRecordDTO> GetVaccineRecordByIdAsync(int vaccineRecordId, string userId, bool isAdmin, bool isStaff);
		Task<bool> SoftDeleteVaccineRecordAsync(int vaccineRecordId, string doctorId);
		Task<IEnumerable<VaccineRecordDTO>> GetAllVaccineRecordsAsync(string doctorId);
		Task<bool> UpdateVaccineRecordAsync(int vaccineRecordId, UpdateVaccineRecordDTO updateDto, string doctorId);
		Task<VaccineRecordDTO> GetVaccineRecordsByBookingIdAsync(int bookingId, string doctorId);

	}
}
