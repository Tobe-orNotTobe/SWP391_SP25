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
    }

}
