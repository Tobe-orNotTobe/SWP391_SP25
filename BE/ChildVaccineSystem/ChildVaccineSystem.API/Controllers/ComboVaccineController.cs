using ChildVaccineSystem.Data.DTO;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChildVaccineSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComboVaccineController : ControllerBase
    {
        private readonly IComboVaccineService _comboService;

        public ComboVaccineController(IComboVaccineService comboService)
        {
            _comboService = comboService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _comboService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var combo = await _comboService.GetByIdAsync(id);
            if (combo == null) return NotFound();
            return Ok(combo);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ComboVaccineDTO comboDto)
        {
            var createdCombo = await _comboService.CreateAsync(comboDto);
            return CreatedAtAction(nameof(GetById), new { id = createdCombo.ComboId }, createdCombo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ComboVaccineDTO comboDto)
        {
            var updatedCombo = await _comboService.UpdateAsync(id, comboDto);
            if (updatedCombo == null) return NotFound();
            return Ok(updatedCombo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var isDeleted = await _comboService.DeleteAsync(id);
            if (!isDeleted) return NotFound();
            return NoContent();
        }
    }
}
