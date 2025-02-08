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
        public ICollection<ComboDetail> ComboDetails { get; set; } = new List<ComboDetail>();

        public DbSet<User> Users { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingDetail> BookingDetails { get; set; }
        public DbSet<Children> Children { get; set; }
        public DbSet<Vaccine> Vaccines { get; set; }
        public DbSet<VaccinationSchedule> VaccinationSchedules { get; set; }
        public DbSet<VaccinationRecord> VaccinationRecords { get; set; }
        public DbSet<PricingPolicy> PricingPolicies { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<DoctorWorkSchedule> DoctorWorkSchedules { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        public DbSet<ComboDetail> ComboDetail { get; set; }

        public DbSet<ComboVaccine> ComboVaccines { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .HasPrincipalKey(u => u.Id) 
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

            modelBuilder.Entity<ComboDetail>()
    .HasOne(cd => cd.Vaccine)
    .WithMany()
    .HasForeignKey(cd => cd.VaccineId)
    .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ComboVaccine>()
    .HasMany(cv => cv.ComboDetails)
    .WithOne(cd => cd.ComboVaccine)
    .HasForeignKey(cd => cd.ComboId)
    .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
