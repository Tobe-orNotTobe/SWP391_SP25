using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using ChildVaccineSystem.Common.Helper;
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
        private readonly APIResponse _response;

        public ChildrenController(IChildrenService childrenService, APIResponse response)
        {
            _childrenService = childrenService;
            _response = response;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllChildren()
        {
            var children = await _childrenService.GetAllChildrenAsync();

            if (children == null || children.Count == 0)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.ErrorMessages.Add("No children found.");
                return NotFound(_response);
            }

            _response.IsSuccess = true;
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = children;
            return Ok(_response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetChildById(int id)
        {
            var child = await _childrenService.GetChildByIdAsync(id);
            if (child == null)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.ErrorMessages.Add("Child not found.");
                return NotFound(_response);
            }

            _response.IsSuccess = true;
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = child;
            return Ok(_response);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetChildrenByUserId(string userId)
        {
            var children = await _childrenService.GetChildrenByUserIdAsync(userId);
            if (children == null || children.Count == 0)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.ErrorMessages.Add("No children found for this user.");
                return NotFound(_response);
            }

            _response.IsSuccess = true;
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = children;
            return Ok(_response);
        }

        [HttpPost()]
        public async Task<IActionResult> CreateChild([FromQuery] string userId, [FromBody] CreateChildrenDTO childDto)
        {
            if (childDto == null || string.IsNullOrEmpty(userId))
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.ErrorMessages.Add("Invalid data.");
                return BadRequest(_response);
            }

            var createdChild = await _childrenService.CreateChildAsync(childDto, userId);
            _response.IsSuccess = true;
            _response.StatusCode = HttpStatusCode.Created;
            _response.Result = createdChild;

            return CreatedAtAction(nameof(GetChildById), new { id = createdChild.ChildId }, _response);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChild(int id, [FromBody] UpdateChildrenDTO updatedChildDto)
        {
            if (updatedChildDto == null)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.ErrorMessages.Add("Invalid data.");
                return BadRequest(_response);
            }

            var updatedChild = await _childrenService.UpdateChildAsync(id, updatedChildDto);
            if (updatedChild == null)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.ErrorMessages.Add("Child not found.");
                return NotFound(_response);
            }

            _response.IsSuccess = true;
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = updatedChild;
            return Ok(_response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChild(int id)
        {
            var deleted = await _childrenService.DeleteChildAsync(id);
            if (!deleted)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.ErrorMessages.Add("Child not found.");
                return NotFound(_response);
            }

            _response.IsSuccess = true;
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = deleted;
            return Ok(_response);
        }
    }
}
