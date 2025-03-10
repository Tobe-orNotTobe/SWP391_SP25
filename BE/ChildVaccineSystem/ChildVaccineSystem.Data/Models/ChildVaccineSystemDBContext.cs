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
		public DbSet<WalletDeposit> WalletDeposits { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// User Relationships
			modelBuilder.Entity<User>()
				.HasMany<Children>()
				.WithOne(c => c.User)
				.HasForeignKey(c => c.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany<Booking>()
				.WithOne(b => b.User)
				.HasForeignKey(b => b.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany<Transaction>()
				.WithOne(t => t.User)
				.HasForeignKey(t => t.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany<VaccinationRecord>()
				.WithOne(vr => vr.User)
				.HasForeignKey(vr => vr.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany<Notification>()
				.WithOne(n => n.User)
				.HasForeignKey(n => n.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<User>()
				.HasMany<Feedback>()
				.WithOne(f => f.User)
				.HasForeignKey(f => f.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			//Booking
			modelBuilder.Entity<Booking>()
				.HasOne(b => b.User)
				.WithMany(u => u.Bookings)
				.HasForeignKey(b => b.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

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
			   .HasMany<Feedback>()
			   .WithOne(f => f.Booking)
			   .HasForeignKey(f => f.BookingId)
			   .OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Booking>()
				.HasMany<DoctorWorkSchedule>()
				.WithOne(d => d.Booking)
				.HasForeignKey(d => d.BookingId)
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

			modelBuilder.Entity<VaccinationRecord>()
				.HasMany<Reaction>()
				.WithOne(r => r.VaccinationRecord)
				.HasForeignKey(r => r.VaccinationRecordId)
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
				.HasOne(cd => cd.ComboVaccine)
				.WithMany(cv => cv.ComboDetails)
				.HasForeignKey(cd => cd.ComboId)
				.OnDelete(DeleteBehavior.Restrict);

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

			//Children
			modelBuilder.Entity<Children>()
				.HasOne(c => c.User)
				.WithMany(u => u.Children)
				.HasForeignKey(c => c.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

			//DoctorWorkSchedule
			modelBuilder.Entity<DoctorWorkSchedule>()
				.HasOne(d => d.User)
				.WithMany()
				.HasForeignKey(d => d.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<DoctorWorkSchedule>()
				.HasOne(d => d.Booking)
				.WithMany()
				.HasForeignKey(d => d.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			//Feedback
			modelBuilder.Entity<Feedback>()
				.HasOne(f => f.User)
				.WithMany()
				.HasForeignKey(f => f.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Feedback>()
				.HasOne(f => f.Booking)
				.WithMany()
				.HasForeignKey(f => f.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			//Notification
			modelBuilder.Entity<Notification>()
				.HasOne(n => n.User)
				.WithMany()
				.HasForeignKey(n => n.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

			//VaccinationRecord
			modelBuilder.Entity<VaccinationRecord>()
				.HasOne(vr => vr.User)
				.WithMany()
				.HasForeignKey(vr => vr.UserId)
				.HasPrincipalKey(u => u.Id)
				.OnDelete(DeleteBehavior.Restrict);

			//VaccineInventory
			modelBuilder.Entity<VaccineInventory>()
				.HasOne(vi => vi.Vaccine)
				.WithMany()
				.HasForeignKey(vi => vi.VaccineId)
				.OnDelete(DeleteBehavior.Restrict);

			//Reaction
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

			//Transaction
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

            //VaccineTransactionHistory
            modelBuilder.Entity<VaccineTransactionHistory>()
            .HasOne(vth => vth.VaccineInventory)
            .WithMany(vi => vi.TransactionHistories)
            .HasForeignKey(vth => vth.VaccineInventoryId)
            .OnDelete(DeleteBehavior.Cascade);

			// Wallet
			modelBuilder.Entity<Wallet>()
				 .HasOne(w => w.User)
				 .WithMany()
				 .HasForeignKey(w => w.UserId)
				 .OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Wallet>()
				.HasMany(w => w.Transactions)
				.WithOne(t => t.Wallet)
				.HasForeignKey(t => t.WalletId)
				.OnDelete(DeleteBehavior.Cascade);

			// RefundRequest 
			modelBuilder.Entity<RefundRequest>()
				.HasOne(r => r.User)
				.WithMany()
				.HasForeignKey(r => r.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<RefundRequest>()
				.HasOne(r => r.Booking)
				.WithMany()
				.HasForeignKey(r => r.BookingId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<RefundRequest>()
				.HasOne(r => r.ProcessedBy)
				.WithMany()
				.HasForeignKey(r => r.ProcessedById)
				.IsRequired(false)
				.OnDelete(DeleteBehavior.Restrict);

			// WalletTransaction 
			modelBuilder.Entity<WalletTransaction>()
				.HasOne(t => t.RefundRequest)
				.WithMany()
				.HasForeignKey(t => t.RefundRequestId)
				.IsRequired(false)
				.OnDelete(DeleteBehavior.Restrict);

			//WalletDeposit
			modelBuilder.Entity<WalletDeposit>()
				.HasOne(wd => wd.User)
				.WithMany()
				.HasForeignKey(wd => wd.UserId)
				.OnDelete(DeleteBehavior.Restrict);
		}
	}
}
