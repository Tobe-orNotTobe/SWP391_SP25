﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.DTO;

namespace ChildVaccineSystem.ServiceContract.Interfaces
{
	public interface IVaccineService
    {
        Task<List<VaccineDTO>> GetAllVaccinesAsync();
        Task<VaccineDTO> GetVaccineByIdAsync(int id);
        Task<VaccineDTO> CreateVaccineAsync(CreateVaccineDTO vaccineDto);
        Task<VaccineDTO> UpdateVaccineAsync(int id, UpdateVaccineDTO updatedVaccineDto);
        Task<bool> DeleteVaccineAsync(int id);
        Task<List<VaccineDTO>> GetVaccinesByTypeAsync(bool isNecessary);
    }
}

