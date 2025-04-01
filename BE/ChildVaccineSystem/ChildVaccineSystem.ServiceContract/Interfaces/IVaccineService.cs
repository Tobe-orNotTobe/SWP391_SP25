 using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.Data.DTO.Vaccine;

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
        Task<List<VaccineBasicDTO>> GetBasicVaccinesAsync();
        Task<List<TopUsedVaccineDTO>> GetTopUsedVaccinesAsync();

    }
}

