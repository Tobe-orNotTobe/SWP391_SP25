using ChildVaccineSystem.Data.DTO.Booking;
using ChildVaccineSystem.ServiceContract.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChildVaccineSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BookingDTO bookingDto)
        {
            var createdBooking = await _bookingService.CreateAsync(bookingDto);
            return CreatedAtAction(nameof(GetById), new { id = createdBooking.BookingId }, createdBooking);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserBookings(string userId)
        {
            var bookings = await _bookingService.GetUserBookingsAsync(userId);
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var booking = await _bookingService.GetBookingWithDetailsAsync(id);
            if (booking == null) return NotFound();
            return Ok(booking);
        }
    }

}
