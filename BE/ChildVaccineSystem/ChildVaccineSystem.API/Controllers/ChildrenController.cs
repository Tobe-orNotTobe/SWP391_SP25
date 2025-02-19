using ChildVaccineSystem.Data.DTO.Children;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChildVaccineSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChildrenController : ControllerBase
    {
        private readonly IChildrenService _childrenService;

        public ChildrenController(IChildrenService childrenService)
        {
            _childrenService = childrenService;
        }

      
        [HttpGet]
        public async Task<ActionResult<List<ChildrenDTO>>> GetAllChildren()
        {
            var children = await _childrenService.GetAllChildrenAsync();
            return Ok(children);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChildrenDTO>> GetChildById(int id)
        {
            var child = await _childrenService.GetChildByIdAsync(id);
            if (child == null)
                return NotFound("Child not found.");

            return Ok(child);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<ChildrenDTO>>> GetChildrenByUserId(string userId)
        {
            var children = await _childrenService.GetChildrenByUserIdAsync(userId);
            if (children == null || children.Count == 0)
            {
                return NotFound("No children found for this user.");
            }
            return Ok(children);
        }

        [HttpPost]
        public async Task<ActionResult<ChildrenDTO>> CreateChild([FromBody] CreateChildrenDTO childDto)
        {
            if (childDto == null)
                return BadRequest("Invalid data.");

            var createdChild = await _childrenService.CreateChildAsync(childDto);
            return CreatedAtAction(nameof(GetChildById), new { id = createdChild.ChildId }, createdChild);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ChildrenDTO>> UpdateChild(int id, [FromBody] UpdateChildrenDTO updatedChildDto)
        {
            if (updatedChildDto == null)
                return BadRequest("Invalid data.");

            var updatedChild = await _childrenService.UpdateChildAsync(id, updatedChildDto);
            if (updatedChild == null)
                return NotFound("Child not found.");

            return Ok(updatedChild);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteChild(int id)
        {
            var deleted = await _childrenService.DeleteChildAsync(id);
            if (!deleted)
                return NotFound("Child not found.");

            return Ok(true);
        }
    }
}
