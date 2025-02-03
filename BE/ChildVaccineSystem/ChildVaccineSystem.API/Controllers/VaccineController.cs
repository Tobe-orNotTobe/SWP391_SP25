using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ChildVaccineSystem.ServiceContract.Interfaces;
using ChildVaccineSystem.Data.DTO;

namespace ChildVaccineSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VaccineController : ControllerBase
    {
        private readonly IVaccineService _vaccineService;

        public VaccineController(IVaccineService vaccineService)
        {
            _vaccineService = vaccineService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vaccines = await _vaccineService.GetAllVaccinesAsync();
            return Ok(vaccines);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var vaccine = await _vaccineService.GetVaccineByIdAsync(id);
            if (vaccine == null) return NotFound();
            return Ok(vaccine);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VaccineDTO vaccineDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var createdVaccine = await _vaccineService.CreateVaccineAsync(vaccineDto);
            return CreatedAtAction(nameof(GetById), new { id = createdVaccine.VaccineId }, createdVaccine);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] VaccineDTO vaccineDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updatedVaccine = await _vaccineService.UpdateVaccineAsync(id, vaccineDto);
            if (updatedVaccine == null) return NotFound();
            return Ok(updatedVaccine);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var isDeleted = await _vaccineService.DeleteVaccineAsync(id);
            if (!isDeleted) return NotFound();
            return NoContent();
        }

        [HttpGet("type/{isNecessary}")]
        public async Task<IActionResult> GetByType(bool isNecessary)
        {
            var vaccines = await _vaccineService.GetVaccinesByTypeAsync(isNecessary);
            return Ok(vaccines);
        }
    }
}
