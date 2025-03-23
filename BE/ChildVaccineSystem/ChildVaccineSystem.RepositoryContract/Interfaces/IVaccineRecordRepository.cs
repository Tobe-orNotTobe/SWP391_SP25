using ChildVaccineSystem.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.RepositoryContract.Interfaces
{
    public interface IVaccineRecordRepository
    {
        Task<VaccinationRecord> GetByIdAsync(int id);
        Task<List<VaccinationRecord>> GetAllAsync(Expression<Func<VaccinationRecord, bool>> filter = null, string includeProperties = "");
        Task AddAsync(VaccinationRecord record);
        void Update(VaccinationRecord record);
        void Delete(VaccinationRecord record);
        Task SaveChangesAsync();
        Task<VaccinationRecord?> GetByIdAsync(int id, string? includeProperties = null);

	}
}
