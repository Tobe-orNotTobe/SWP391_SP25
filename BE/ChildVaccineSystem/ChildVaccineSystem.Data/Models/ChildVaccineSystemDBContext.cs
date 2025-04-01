using ChildVaccineSystem.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChildVaccineSystem.Data.Models
{
	public class ChildVaccineSystemDBContext : IdentityDbContext<User, IdentityRole, string>
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
		public DbSet<VaccineScheduleDetail> VaccineScheduleDetails { get; set; }
		public DbSet<VaccinationRecord> VaccinationRecords { get; set; }
		public DbSet<VaccineInventory> VaccineInventories { get; set; }
		public DbSet<PricingPolicy> PricingPolicies { get; set; }
		public DbSet<Transaction> Transactions { get; set; }
		public DbSet<Reaction> Reactions { get; set; }
		public DbSet<DoctorWorkSchedule> DoctorWorkSchedules { get; set; }
		public DbSet<Notification> Notifications { get; set; }
		public DbSet<ComboVaccine> ComboVaccines { get; set; }
		public DbSet<InjectionSchedule> InjectionSchedules { get; set; }
		public DbSet<VaccineTransactionHistory> VaccineTransactions { get; set; }
		public DbSet<BlogPost> BlogPosts { get; set; }
		public DbSet<Wallet> Wallets { get; set; }
		public DbSet<WalletTransaction> WalletTransactions { get; set; }
		public DbSet<RefundRequest> RefundRequests { get; set; }
		public DbSet<VaccinationReminder> VaccinationReminders { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<User>().ToTable("AspNetUsers")
				.Ignore(u => u.PhoneNumberConfirmed)  
				.Ignore(u => u.TwoFactorEnabled)
				.Ignore(u => u.LockoutEnd)
				.Ignore(u => u.LockoutEnabled)
				.Ignore(u => u.AccessFailedCount);

			modelBuilder.Entity<IdentityRole> ().Ignore(u => u.ConcurrencyStamp);

			modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable(null as string);
			modelBuilder.Entity<IdentityUserToken<string>>().ToTable(null as string);
			modelBuilder.Entity<IdentityUserLogin<string>>().ToTable(null as string);
			modelBuilder.Entity<IdentityUserClaim<string>>().ToTable(null as string);

			// User Relationships
			modelBuilder.Entity<User>()
				.HasMany(u => u.Children) 
				.WithOne(c => c.User)
				.HasForeignKey(c => c.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany(u => u.Bookings)
				.WithOne(b => b.User)
				.HasForeignKey(b => b.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany<Transaction>()
				.WithOne(t => t.User)
				.HasForeignKey(t => t.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany(u => u.VaccinationRecords)
				.WithOne(vr => vr.User)
				.HasForeignKey(vr => vr.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany(u => u.Notifications)
				.WithOne(n => n.User)
				.HasForeignKey(n => n.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany<Feedback>()
				.WithOne(f => f.User)
				.HasForeignKey(f => f.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			//DoctorWorkSchedule
			modelBuilder.Entity<DoctorWorkSchedule>()
				.HasMany(dws => dws.Bookings)
				.WithOne(b => b.DoctorWorkSchedule)
				.HasForeignKey(b => b.DoctorWorkScheduleId)
				.OnDelete(DeleteBehavior.Restrict);

			//Booking
			modelBuilder.Entity<Booking>()
				.HasOne(b => b.Children)
				.WithMany()
				.HasForeignKey(b => b.ChildId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Booking>()
				.HasMany(b => b.BookingDetails)
				.WithOne(bd => bd.Booking)
				.HasForeignKey(bd => bd.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Booking>()
				.HasOne(b => b.PricingPolicy)
				.WithMany()
				.HasForeignKey(b => b.PricingPolicyId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Booking>()
				.HasMany<Transaction>()
				.WithOne(t => t.Booking)
				.HasForeignKey(t => t.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Booking>()
				.HasOne(b => b.Feedback)
				.WithOne(f => f.Booking)
				.HasForeignKey<Feedback>(f => f.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			//BookingDetail
			modelBuilder.Entity<BookingDetail>()
				.HasOne(bd => bd.Vaccine)
				.WithMany()
				.HasForeignKey(bd => bd.VaccineId)
				.IsRequired(false)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<BookingDetail>()
				.HasOne(bd => bd.ComboVaccine)
				.WithMany()
				.HasForeignKey(bd => bd.ComboVaccineId)
				.IsRequired(false)
				.OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BookingDetail>()
                .HasMany<VaccinationRecord>()
                .WithOne(vr => vr.BookingDetail)
                .HasForeignKey(vr => vr.BookingDetailId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BookingDetail>()
			  .HasOne(bd => bd.VaccineInventory)
			  .WithMany()
			  .HasForeignKey(bd => bd.VaccineInventoryId)
			  .OnDelete(DeleteBehavior.Restrict);

			//Vaccine
			modelBuilder.Entity<Vaccine>()
				.HasOne(v => v.ParentVaccine)
				.WithMany(v => v.ChildVaccines)
				.HasForeignKey(v => v.IsParentId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Vaccine>()
				.HasMany<ComboDetail>()
				.WithOne(cd => cd.Vaccine)
				.HasForeignKey(cd => cd.VaccineId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Vaccine>()
				.HasMany<VaccineInventory>()
				.WithOne(vi => vi.Vaccine)
				.HasForeignKey(vi => vi.VaccineId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Vaccine>()
				.HasMany<Reaction>()
				.WithOne(r => r.Vaccine)
				.HasForeignKey(r => r.VaccineId)
				.OnDelete(DeleteBehavior.Restrict);

			//VaccinationRecord
			modelBuilder.Entity<VaccinationRecord>()
				.HasOne(vr => vr.Reaction)
				.WithOne(r => r.VaccinationRecord)
				.HasForeignKey<Reaction>(r => r.VaccinationRecordId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<VaccinationRecord>()
			   .HasOne(vr => vr.VaccineInventory)
			   .WithMany(vi => vi.VaccinationRecords)
			   .HasForeignKey(vr => vr.VaccineInventoryId)
			   .OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<VaccinationRecord>()
			  .HasOne(vr => vr.Child)
			  .WithMany(c => c.VaccinationRecords)
			  .HasForeignKey(vr => vr.ChildId)
			.OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VaccinationRecord>()
       .HasOne(vr => vr.BookingDetail) // Một VaccinationRecord thuộc một BookingDetail
       .WithMany(bd => bd.VaccinationRecords) // Một BookingDetail có nhiều VaccinationRecords
       .HasForeignKey(vr => vr.BookingDetailId)
       .OnDelete(DeleteBehavior.Restrict); // Không cho phép xóa cascade
                                           // Vaccine Inventory constraints
            modelBuilder.Entity<VaccineInventory>()
				.HasIndex(vi => vi.BatchNumber)
				.IsUnique();

			//ComboVaccine
			modelBuilder.Entity<ComboVaccine>()
				.HasMany(cv => cv.ComboDetails)
				.WithOne(cd => cd.ComboVaccine)
				.HasForeignKey(cd => cd.ComboId)
				.OnDelete(DeleteBehavior.Cascade);

			//ComboDetail
			modelBuilder.Entity<ComboDetail>()
				.HasOne(cd => cd.Vaccine)
				.WithMany()
				.HasForeignKey(cd => cd.VaccineId)
				.OnDelete(DeleteBehavior.Restrict);

			// ComboDetail - VaccineInventory relationship
			modelBuilder.Entity<ComboDetail>()
				.HasOne(cd => cd.VaccineInventory)
				.WithMany()
				.HasForeignKey(cd => cd.VaccineInventoryId)
				.OnDelete(DeleteBehavior.Restrict);

			//InjectionSchedule
			modelBuilder.Entity<InjectionSchedule>()
				.HasOne(i => i.VaccineScheduleDetail)
				.WithMany(d => d.InjectionSchedules)
				.HasForeignKey(i => i.VaccineScheduleDetailId)
				.OnDelete(DeleteBehavior.Cascade);

			//VaccineScheduleDetail
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

			//VaccineTransactionHistory
			modelBuilder.Entity<VaccineTransactionHistory>()
			.HasOne(vth => vth.VaccineInventory)
			.WithMany(vi => vi.TransactionHistories)
			.HasForeignKey(vth => vth.VaccineInventoryId)
			.OnDelete(DeleteBehavior.Cascade);

			// RefundRequest 
			modelBuilder.Entity<RefundRequest>()
				.HasOne(r => r.User)
				.WithMany(u => u.RefundRequests)
				.HasForeignKey(r => r.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<RefundRequest>()
				.HasOne(r => r.Booking)
				.WithOne(b => b.RefundRequest)
				.HasForeignKey<RefundRequest>(r => r.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			//VaccinationReminder
			modelBuilder.Entity<VaccinationReminder>()
				.HasOne(vr => vr.User)
				.WithMany()
				.HasForeignKey(vr => vr.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<VaccinationReminder>()
				.HasOne(vr => vr.Children)
				.WithMany()
				.HasForeignKey(vr => vr.ChildId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<VaccinationReminder>()
				.HasOne(vr => vr.Booking)
				.WithMany()
				.HasForeignKey(vr => vr.BookingId)
				.OnDelete(DeleteBehavior.Restrict);
		}
	}
}
