using System;
using System.Linq;
using System.Reflection;
using AutoMapper;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.DTO.Blog;
using ChildVaccineSystem.Data.DTO.Booking;
using ChildVaccineSystem.Data.DTO.Booking.BookingDetail;
using ChildVaccineSystem.Data.DTO.Children;
using ChildVaccineSystem.Data.DTO.ComboVaccine;
using ChildVaccineSystem.Data.DTO.DoctorWorkSchedule;
using ChildVaccineSystem.Data.DTO.Feedback;
using ChildVaccineSystem.Data.DTO.InjectionSchedule;
using ChildVaccineSystem.Data.DTO.Notification;
using ChildVaccineSystem.Data.DTO.Refund;
using ChildVaccineSystem.Data.DTO.Transaction;
using ChildVaccineSystem.Data.DTO.User;
using ChildVaccineSystem.Data.DTO.VaccinationSchedule;
using ChildVaccineSystem.Data.DTO.Vaccine;
using ChildVaccineSystem.Data.DTO.VaccineInventory;
using ChildVaccineSystem.Data.DTO.VaccineRecord;
using ChildVaccineSystem.Data.DTO.VaccineScheduleDetail;
using ChildVaccineSystem.Data.DTO.Wallet;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.Common.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //vaccine
            CreateMap<Vaccine, VaccineDTO>().ReverseMap();

            CreateMap<CreateVaccineDTO, Vaccine>()
                .ForMember(dest => dest.ParentVaccine, opt => opt.Ignore()) // ✅ Xử lý riêng trong service
                .ForMember(dest => dest.IsIncompatibility, opt => opt.MapFrom(src => src.IsIncompatibility));

            CreateMap<UpdateVaccineDTO, Vaccine>()
                .ForMember(dest => dest.ParentVaccine, opt => opt.Ignore()) // ✅ Xử lý riêng trong service
                .ForMember(dest => dest.IsIncompatibility, opt => opt.MapFrom(src => src.IsIncompatibility))
                                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
          
            CreateMap<Vaccine, VaccineBasicDTO>()
.ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.VaccineId));
            // ComboVaccine Mapping
            // ✅ Mapping ComboDetail -> ComboDetailDTO
            CreateMap<ComboDetail, ComboDetailDTO>()
                .ForMember(dest => dest.Order, opt => opt.MapFrom(src => src.Order))
                .ForMember(dest => dest.IntervalDays, opt => opt.MapFrom(src => src.IntervalDays))
                .ForMember(dest => dest.Vaccine, opt => opt.MapFrom(src => src.Vaccine))
                .ReverseMap();

            // ✅ Mapping ComboVaccine -> ComboVaccineDTO
            CreateMap<ComboVaccine, ComboVaccineDTO>()
                .ForMember(dest => dest.ComboId, opt => opt.MapFrom(src => src.ComboId))
                .ForMember(dest => dest.ComboName, opt => opt.MapFrom(src => src.ComboName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.TotalPrice))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(dest => dest.Vaccines, opt => opt.MapFrom(src => src.ComboDetails))
                .ReverseMap();

            // ✅ Mapping CreateComboDetailDTO -> ComboDetail
            CreateMap<CreateComboDetailDTO, ComboDetail>()
                .ForMember(dest => dest.VaccineId, opt => opt.MapFrom(src => src.VaccineId))
                .ForMember(dest => dest.Order, opt => opt.MapFrom(src => src.Order))
                .ForMember(dest => dest.IntervalDays, opt => opt.MapFrom(src => src.IntervalDays))
                .ReverseMap();

            // ✅ Mapping CreateComboVaccineDTO -> ComboVaccine
            CreateMap<CreateComboVaccineDTO, ComboVaccine>()
                .ForMember(dest => dest.ComboDetails,
                    opt => opt.MapFrom(src => src.Vaccines
                        .Select(vaccine => new ComboDetail
                        {
                            VaccineId = vaccine.VaccineId,
                            Order = vaccine.Order,
                            IntervalDays = vaccine.IntervalDays
                        })))
                .ForMember(dest => dest.CreatedAtUpdatedAt,
                    opt => opt.MapFrom(src => DateTime.UtcNow));

            // ✅ Mapping UpdateComboDetailDTO -> ComboDetail
            CreateMap<UpdateComboDetailDTO, ComboDetail>()
                .ForMember(dest => dest.VaccineId, opt => opt.MapFrom(src => src.VaccineId))
                .ForMember(dest => dest.Order, opt => opt.MapFrom(src => src.Order))
                .ForMember(dest => dest.IntervalDays, opt => opt.MapFrom(src => src.IntervalDays))
                .ReverseMap();

            // ✅ Mapping UpdateComboVaccineDTO -> ComboVaccine
            CreateMap<UpdateComboVaccineDTO, ComboVaccine>()
                .ForMember(dest => dest.ComboDetails,
                    opt => opt.MapFrom(src => src.Vaccines
                        .Select(vaccine => new ComboDetail
                        {
                            VaccineId = vaccine.VaccineId,
                            Order = vaccine.Order,
                            IntervalDays = vaccine.IntervalDays
                        })))
                .ForMember(dest => dest.CreatedAtUpdatedAt,
                    opt => opt.MapFrom(src => DateTime.UtcNow));

            // User Mapping
            CreateMap<User, UserDTO>();

            CreateMap<UserRegisterDTO, User>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true)) // Default to true
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            // VaccinationSchedule Mappings
            CreateMap<VaccinationSchedule, VaccinationScheduleDTO>().ReverseMap();

            CreateMap<CreateVaccinationScheduleDTO, VaccinationSchedule>();

            CreateMap<UpdateVaccinationScheduleDTO, VaccinationSchedule>()
                .ForMember(dest => dest.ScheduleId, opt => opt.Ignore());

            // VaccinationScheduleDetail Mappings
            CreateMap<VaccineScheduleDetail, VaccineScheduleDetailDTO>()
            .ForMember(dest => dest.VaccineName,
                      opt => opt.MapFrom(src => src.Vaccine.Name));

            CreateMap<CreateVaccineScheduleDetailDTO, VaccineScheduleDetail>();

            CreateMap<UpdateVaccineScheduleDetailDTO, VaccineScheduleDetail>();

            //Booking
            CreateMap<CreateBookingDTO, Booking>()
                .ForMember(dest => dest.BookingDetails, opt => opt.Ignore())
                .ForMember(dest => dest.TotalPrice, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore());

            CreateMap<CreateBookingDetailDTO, BookingDetail>()
                .ForMember(dest => dest.Price, opt => opt.Ignore());

            CreateMap<Booking, BookingDTO>()
                .ForMember(dest => dest.ChildName,
        opt => opt.MapFrom(src => src.Children != null ? src.Children.FullName : "Không xác định"))
                .ForMember(dest => dest.BookingDetails,
                    opt => opt.MapFrom(src => src.BookingDetails));

            CreateMap<BookingDetail, BookingDetailDTO>();
            // BookingDetail Mapping
            CreateMap<BookingDetail, BookingDetailDTO>()
                .ForMember(dest => dest.VaccineName,
                           opt => opt.MapFrom(src => src.Vaccine != null ? src.Vaccine.Name : null))
                .ForMember(dest => dest.ComboVaccineName,
                           opt => opt.MapFrom(src => src.ComboVaccine != null ? src.ComboVaccine.ComboName : null));
            CreateMap<BookingDetail, BookingDetailDTO>()
    .ForMember(dest => dest.InjectionDate, opt => opt.MapFrom(src => src.InjectionDate));
            CreateMap<Booking, BookingDTO>();
            // ✅ Mapping cho Vaccine đơn lẻ
            CreateMap<BookingDetail, BookingDetailDTO>()
                .ForMember(dest => dest.VaccineName, opt => opt.MapFrom(src => src.Vaccine.Name))
                .ForMember(dest => dest.ComboVaccineName, opt => opt.MapFrom(src => src.ComboVaccine.ComboName))
                .ReverseMap();

            // ✅ Mapping cho Booking
            CreateMap<Booking, BookingDTO>()
                .ForMember(dest => dest.BookingDetails, opt => opt.MapFrom(src => src.BookingDetails))
                .ReverseMap();
            //Children
            CreateMap<Children, ChildrenDTO>().ReverseMap();
            CreateMap<CreateChildrenDTO, Children>();
            CreateMap<UpdateChildrenDTO, Children>();

            // InjectionSchedule Mappings
            CreateMap<InjectionSchedule, InjectionScheduleDTO>();

            CreateMap<CreateInjectionScheduleDTO, InjectionSchedule>()
                .ForMember(dest => dest.VaccineScheduleDetailId,
                      opt => opt.Ignore());
            CreateMap<UpdateInjectionScheduleDTO, InjectionSchedule>();

            CreateMap<VaccineInventory, VaccineInventoryDTO>()
                .ForMember(dest => dest.VaccineInventoryId, opt => opt.MapFrom(src => src.VaccineInventoryId))
                .ForMember(dest => dest.VaccineId, opt => opt.MapFrom(src => src.VaccineId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Vaccine.Name))
                .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Vaccine.Manufacturer))
                .ForMember(dest => dest.BatchNumber, opt => opt.MapFrom(src => src.BatchNumber))
                .ForMember(dest => dest.ManufacturingDate, opt => opt.MapFrom(src => src.ManufacturingDate))
                .ForMember(dest => dest.ExpiryDate, opt => opt.MapFrom(src => src.ExpiryDate))
                .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src.Supplier))
                .ForMember(dest => dest.InitialQuantity, opt => opt.MapFrom(src => src.InitialQuantity))
                .ForMember(dest => dest.ReturnedQuantity, opt => opt.MapFrom(src => src.ReturnedQuantity))

                .ForMember(dest => dest.TotalQuantity, opt => opt.MapFrom(src => src.InitialQuantity - src.QuantityInStock));

            //CreateMap<VaccineInventory, ReturnedVaccineDTO>()
            //    .ForMember(dest => dest.VaccineInventoryId, opt => opt.MapFrom(src => src.VaccineInventoryId))
            //    .ForMember(dest => dest.VaccineId, opt => opt.MapFrom(src => src.VaccineId))
            //    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Vaccine != null ? src.Vaccine.Name : "Unknown"))
            //    .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Vaccine != null ? src.Vaccine.Manufacturer : "Unknown"))
            //    .ForMember(dest => dest.BatchNumber, opt => opt.MapFrom(src => src.BatchNumber))
            //    .ForMember(dest => dest.InitialQuantity, opt => opt.MapFrom(src => src.InitialQuantity))
            //    .ForMember(dest => dest.QuantityInStock, opt => opt.MapFrom(src => src.QuantityInStock))
            //    .ForMember(dest => dest.ReturnedQuantity, opt => opt.MapFrom(src => src.QuantityInStock - src.InitialQuantity))
            //    .ForMember(dest => dest.ManufacturingDate, opt => opt.MapFrom(src => src.ManufacturingDate))
            //    .ForMember(dest => dest.ExpiryDate, opt => opt.MapFrom(src => src.ExpiryDate))
            //    .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src.Supplier));

            // Transaction
            CreateMap<Transaction, TransactionDTO>().ReverseMap();
            CreateMap<CreateTransactionDTO, Transaction>();
         
            // DoctorWorkSchedule Mapping
            CreateMap<DoctorWorkSchedule, DoctorWorkScheduleDTO>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.BookingId, opt => opt.MapFrom(src => src.Bookings.FirstOrDefault().BookingId)) 
                .ForMember(dest => dest.BookingDate, opt => opt.MapFrom(src => src.Bookings.FirstOrDefault().BookingDate)) 
                .ForMember(dest => dest.ChildName, opt => opt.MapFrom(src => src.Bookings.FirstOrDefault().Children.FullName)); 

            // BlogPost Mapping
            CreateMap<BlogPost, BlogPostDTO>()
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.AuthorName));  // Ánh xạ AuthorName

            CreateMap<CreateBlogPostDTO, BlogPost>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));  // Tự động gán CreatedAt khi tạo mới

            CreateMap<UpdateBlogPostDTO, BlogPost>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl));

            CreateMap<BlogPost, BlogPostBasicDTO>();

            //feedback
            CreateMap<Feedback, FeedbackDTO>();
            CreateMap<CreateFeedbackDTO, Feedback>();
            CreateMap<User, UserProfileDTO>();

			// Wallet mappings
			CreateMap<Wallet, WalletDTO>();
			CreateMap<WalletTransaction, WalletTransactionDTO>();

			// Refund request mappings
			CreateMap<RefundRequest, RefundRequestDTO>()
				.ForMember(dest => dest.UserName,
					opt => opt.MapFrom(src => src.User != null ? src.User.FullName : "Unknown"));
;
			// VaccineRecord mappings
			CreateMap<VaccinationRecord, VaccineRecordDTO>()
				.ForMember(dest => dest.BookingId, opt => opt.MapFrom(src => src.BookingDetail.BookingId))
				.ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Child.FullName))
				.ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.Child.DateOfBirth))
				.ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.Child.Height))
				.ForMember(dest => dest.Weight, opt => opt.MapFrom(src => src.Child.Weight))
				.ForMember(dest => dest.VaccineRecords, opt => opt.MapFrom(src => new List<VaccineRecordDetailDTO>()))
				.ForMember(dest => dest.Message, opt => opt.MapFrom(src => "Vaccine record processed successfully"));

			CreateMap<VaccinationRecord, VaccineRecordDetailDTO>()
				.ForMember(dest => dest.VaccinationRecordId, opt => opt.MapFrom(src => src.VaccinationRecordId))
				.ForMember(dest => dest.VaccineName, opt => opt.MapFrom(src => src.Vaccine.Name))
				.ForMember(dest => dest.DoseAmount, opt => opt.MapFrom(src => src.Vaccine.DoseAmount))
				.ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Vaccine.Price))
				.ForMember(dest => dest.NextDoseDate, opt => opt.MapFrom(src => src.NextDoseDate))
				.ForMember(dest => dest.BatchNumber, opt => opt.MapFrom(src => src.BatchNumber))
				.ForMember(dest => dest.StatusEnum, opt => opt.MapFrom(src => src.Status))
				.ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes));

			CreateMap<Notification, NotificationDTO>();
			CreateMap<Notification, AdminNotificationDTO>()
				.ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
				.ForMember(dest => dest.UserEmail, opt => opt.MapFrom(src => src.User.Email));
		}
	}
};


