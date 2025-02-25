using System;
using System.Linq;
using System.Reflection;
using AutoMapper;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.DTO.Auth;
using ChildVaccineSystem.Data.DTO.Booking;
using ChildVaccineSystem.Data.DTO.Booking.BookingDetail;
using ChildVaccineSystem.Data.DTO.Children;
using ChildVaccineSystem.Data.DTO.ComboVaccine;
using ChildVaccineSystem.Data.DTO.InjectionSchedule;
using ChildVaccineSystem.Data.DTO.Transaction;
using ChildVaccineSystem.Data.DTO.VaccinationSchedule;
using ChildVaccineSystem.Data.DTO.Vaccine;
using ChildVaccineSystem.Data.DTO.VaccineScheduleDetail;
using ChildVaccineSystem.Data.Entities;

namespace ChildVaccineSystem.Common.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Vaccine Mapping
            CreateMap<Vaccine, VaccineDTO>().ReverseMap();

            CreateMap<CreateVaccineDTO, Vaccine>();

            CreateMap<UpdateVaccineDTO, Vaccine>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Vaccine, VaccineBasicDTO>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.VaccineId));

            // ComboVaccine Mapping
            CreateMap<ComboVaccine, ComboVaccineDTO>()
                .ForMember(dest => dest.Vaccines,
                    opt => opt.MapFrom(src => src.ComboDetails.Select(cd => cd.Vaccine)))
                .ReverseMap();

            CreateMap<CreateComboVaccineDTO, ComboVaccine>()
                .ForMember(dest => dest.ComboDetails,
                    opt => opt.MapFrom(src => src.VaccineIds.Select(id => new ComboDetail { VaccineId = id })))
                .ForMember(dest => dest.CreatedAtUpdatedAt,
                    opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UpdateComboVaccineDTO, ComboVaccine>()
                .ForMember(dest => dest.ComboDetails,
                    opt => opt.MapFrom(src => src.VaccineIds.Select(id => new ComboDetail { VaccineId = id })))
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
                    opt => opt.MapFrom(src => src.Children.FullName))
                .ForMember(dest => dest.BookingDetails,
                    opt => opt.MapFrom(src => src.BookingDetails));

            CreateMap<BookingDetail, BookingDetailDTO>();

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
    .ForMember(dest => dest.VaccineId, opt => opt.MapFrom(src => src.Vaccine.VaccineId))
    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Vaccine.Name))
    .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Vaccine.Manufacturer))
    .ForMember(dest => dest.BatchNumber, opt => opt.MapFrom(src => src.BatchNumber))
    .ForMember(dest => dest.ManufacturingDate, opt => opt.MapFrom(src => src.ManufacturingDate))
    .ForMember(dest => dest.ExpiryDate, opt => opt.MapFrom(src => src.ExpiryDate))
    .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src.Supplier))
    .ForMember(dest => dest.InitialQuantity, opt => opt.MapFrom(src => src.InitialQuantity)) // Đảm bảo ánh xạ đúng
    .ForMember(dest => dest.TotalQuantity, opt => opt.MapFrom(src => src.InitialQuantity - src.QuantityInStock)); // Số vaccine đã xuất


            // Transaction
			CreateMap<Transaction, TransactionDTO>().ReverseMap();
			CreateMap<CreateTransactionDTO, Transaction>();
		}
    }
}


