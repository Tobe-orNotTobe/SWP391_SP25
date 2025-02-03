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
        }
    }
}