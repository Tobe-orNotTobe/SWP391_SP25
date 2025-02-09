using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ChildVaccineSystem.Data.Entities;
using ChildVaccineSystem.RepositoryContract.Interfaces;
using ChildVaccineSystem.Data.Models;

namespace ChildVaccineSystem.Repository.Repositories
{
    public class VaccineRepository : IVaccineRepository
    {
        private readonly ChildVaccineSystemDBContext _context;

        public VaccineRepository(ChildVaccineSystemDBContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<int>> GetAllIdsAsync()
        {
            return await _context.Vaccines.Select(v => v.VaccineId).ToListAsync();
        }

        public async Task<IEnumerable<Vaccine>> GetAllAsync()
        {
            return await _context.Vaccines.AsNoTracking().ToListAsync();
        }

        public async Task<Vaccine?> GetByIdAsync(int id)
        {
            return await _context.Vaccines.AsNoTracking().FirstOrDefaultAsync(v => v.VaccineId == id);
        }

        public async Task<Vaccine> CreateAsync(Vaccine vaccine)
        {
            bool scheduleExists = await _context.VaccinationSchedules
                .AnyAsync(s => s.ScheduleId == vaccine.ScheduleId);

            if (!scheduleExists)
            {
                throw new Exception($"ScheduleId {vaccine.ScheduleId} does not exist.");
            }

            _context.Vaccines.Add(vaccine);
            await _context.SaveChangesAsync();
            return vaccine;
        }

        public async Task<Vaccine?> UpdateAsync(int id, Vaccine vaccine)
        {
            var existingVaccine = await _context.Vaccines.FindAsync(id);
            if (existingVaccine == null) return null;

            // Validate ScheduleId before updating
            bool scheduleExists = await _context.VaccinationSchedules
                .AnyAsync(s => s.ScheduleId == vaccine.ScheduleId);

            if (!scheduleExists)
            {
                throw new Exception($"ScheduleId {vaccine.ScheduleId} does not exist.");
            }

            existingVaccine.Name = vaccine.Name;
            existingVaccine.Description = vaccine.Description;
            existingVaccine.Manufacturer = vaccine.Manufacturer;
            existingVaccine.SideEffect = vaccine.SideEffect;
            existingVaccine.DiseasePrevented = vaccine.DiseasePrevented;
            existingVaccine.Price = vaccine.Price;
            existingVaccine.Status = vaccine.Status;
            existingVaccine.IsNecessary = vaccine.IsNecessary;
            existingVaccine.Image = vaccine.Image;
            existingVaccine.InjectionSite = vaccine.InjectionSite;
            existingVaccine.Notes = vaccine.Notes;
            existingVaccine.VaccineInteractions = vaccine.VaccineInteractions;
            existingVaccine.UndesirableEffects = vaccine.UndesirableEffects;
            existingVaccine.Preserve = vaccine.Preserve;
            existingVaccine.InjectionsCount = vaccine.InjectionsCount;
            existingVaccine.Distance = vaccine.Distance;
            existingVaccine.ScheduleId = vaccine.ScheduleId;

            await _context.SaveChangesAsync();
            return existingVaccine;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var vaccine = await _context.Vaccines.FindAsync(id);
            if (vaccine == null) return false;

            _context.Vaccines.Remove(vaccine);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Vaccine>> GetVaccinesByTypeAsync(bool isNecessary)
        {
            return await _context.Vaccines
                .AsNoTracking()
                .Where(v => v.IsNecessary == isNecessary)
                .ToListAsync();
        }
    }
}
