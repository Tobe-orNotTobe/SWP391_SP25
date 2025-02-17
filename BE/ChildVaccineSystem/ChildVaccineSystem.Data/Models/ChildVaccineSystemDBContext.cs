using ChildVaccineSystem.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChildVaccineSystem.Data.Models
{
    public class ChildVaccineSystemDBContext : IdentityDbContext<User>
    {
        public ChildVaccineSystemDBContext(DbContextOptions<ChildVaccineSystemDBContext> options) : base(options)
        {
        }
        //public ICollection<ComboDetail> ComboDetails { get; set; } = new List<ComboDetail>();

        public DbSet<User> Users { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingDetail> BookingDetails { get; set; }
        public DbSet<Children> Children { get; set; }
		public DbSet<ComboDetail> ComboDetails { get; set; }
		public DbSet<Feedback> Feedbacks { get; set; }
		public DbSet<Vaccine> Vaccines { get; set; }
        public DbSet<VaccinationSchedule> VaccinationSchedules { get; set; }
        public DbSet<VaccinationRecord> VaccinationRecords { get; set; }
		public DbSet<VaccineInventory> vaccineInventories { get; set; }
		public DbSet<PricingPolicy> PricingPolicies { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<DoctorWorkSchedule> DoctorWorkSchedules { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        public DbSet<ComboDetail> ComboDetail { get; set; }

        public DbSet<ComboVaccine> ComboVaccines { get; set; }
		public DbSet<InjectionSchedule> InjectionSchedules { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .HasPrincipalKey(u => u.Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Booking)
                .WithMany()
                .HasForeignKey(t => t.BookingId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.PricingPolicy)
                .WithMany()
                .HasForeignKey(b => b.PricingPolicyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VaccinationRecord>()
                .HasOne(vr => vr.User)
                .WithMany()
                .HasForeignKey(vr => vr.UserId)
                .HasPrincipalKey(u => u.Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VaccinationRecord>()
                .HasOne(vr => vr.BookingDetail)
                .WithMany()
                .HasForeignKey(vr => vr.BookingDetailId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ComboVaccine>()
                .HasMany(cv => cv.ComboDetails)
                .WithOne(cd => cd.ComboVaccine)
                .HasForeignKey(cd => cd.ComboId)
                .OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Children>()
				.HasOne(c => c.User)
                .WithMany(u => u.Children)
                .HasForeignKey(c => c.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<DoctorWorkSchedule>()
				.HasOne(d => d.User)
				.WithMany()
				.HasForeignKey(d => d.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Feedback>()
				.HasOne(f => f.User)
				.WithMany()
				.HasForeignKey(f => f.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Notification>()
				.HasOne(n => n.User)
				.WithMany()
				.HasForeignKey(n => n.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<VaccinationRecord>()
				.HasOne(vr => vr.User)
				.WithMany()
				.HasForeignKey(vr => vr.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

			// Booking Relationships
			modelBuilder.Entity<BookingDetail>()
				.HasOne(bd => bd.Booking)
                .WithMany(b => b.BookingDetails)
                .HasForeignKey(bd => bd.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<DoctorWorkSchedule>()
				.HasOne(d => d.Booking)
				.WithMany()
				.HasForeignKey(d => d.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Feedback>()
				.HasOne(f => f.Booking)
				.WithMany()
				.HasForeignKey(f => f.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<ComboDetail>()
				.HasOne(cd => cd.ComboVaccine)
				.WithMany(cv => cv.ComboDetails)
				.HasForeignKey(cd => cd.ComboId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<ComboDetail>()
				.HasOne(cd => cd.Vaccine)
				.WithMany()
				.HasForeignKey(cd => cd.VaccineId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<VaccineInventory>()
				.HasOne(vi => vi.Vaccine)
				.WithMany()
				.HasForeignKey(vi => vi.VaccineId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Reaction>()
				.HasOne(r => r.Vaccine)
				.WithMany()
				.HasForeignKey(r => r.VaccineId)
				.OnDelete(DeleteBehavior.Restrict);

			
			// VaccinationRecord Relationships
			modelBuilder.Entity<Reaction>()
				.HasOne(r => r.VaccinationRecord)
				.WithMany()
				.HasForeignKey(r => r.VaccinationRecordId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<InjectionSchedule>()
						.HasOne(i => i.VaccineScheduleDetail)
						.WithMany(d => d.InjectionSchedules)
						.HasForeignKey(i => i.VaccineScheduleDetailId)
						.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<VaccineScheduleDetail>(entity =>
			{

				entity.HasOne(d => d.Schedule)
				  .WithMany(s => s.VaccineScheduleDetails)
				  .HasForeignKey(d => d.ScheduleId)
				  .OnDelete(DeleteBehavior.Restrict);

				entity.HasOne(d => d.Vaccine)
				.WithMany(v => v.VaccineScheduleDetails)
				.HasForeignKey(d => d.VaccineId)
				.OnDelete(DeleteBehavior.Restrict);
			});
		}
	}
}
