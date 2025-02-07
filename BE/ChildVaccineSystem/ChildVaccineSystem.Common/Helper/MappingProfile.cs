using System;
using AutoMapper;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ChildVaccineSystem.Common.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Vaccine Mapping
            CreateMap<Vaccine, VaccineDTO>().ReverseMap();

            CreateMap<ComboVaccine, ComboVaccineDTO>()
                .ForMember(dest => dest.VaccineIds, opt => opt.MapFrom(src => src.ComboDetails.Select(cd => cd.VaccineId)))
                .ReverseMap();

            CreateMap<User, UserDTO>();

            CreateMap<UserRegisterDTO, User>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true)) 
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            
        }
    }
}