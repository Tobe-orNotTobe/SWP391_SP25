import React, { useEffect, useState } from "react";
import StaffLayout from "../../components/Layout/StaffLayout/StaffLayout.tsx";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully.ts";
import { apiGetDoctorBookings } from "../../apis/apiBooking.ts";
import "./VaccinationSchedulePage.scss";
import Modal from "react-modal";
import { BookingResponse } from "../../interfaces/Booking.ts";

Modal.setAppElement("#root"); // Đặt root để đảm bảo modal hoạt động tốt

const VaccinationSchedulePage: React.FC = () => {
  const { sub: doctorId } = IsLoginSuccessFully();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (doctorId) {
        const data = await apiGetDoctorBookings(doctorId);
        if (data?.isSuccess) {
          console.log(data.result);
          setBookings(data.result);
        }
      }
    };

    fetchBookings();
  }, [doctorId]);

  const openModal = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalIsOpen(false);
  };

  return (
    <StaffLayout>
      <h1>Lịch Tiêm Chủng</h1>
      {bookings.length > 0 ? (
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Tên Trẻ</th>
              <th>Ngày Đặt</th>
              <th>Loại Tiêm</th>
              <th>Giá Tiền</th>
              <th>Trạng Thái</th>
              <th>Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking: BookingResponse) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{booking.childName}</td>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>{booking.bookingType}</td>
                <td>{booking.totalPrice.toLocaleString()} VNĐ</td>
                <td>{booking.status}</td>
                <td>
                  <button
                    className="detail-btn"
                    onClick={() => openModal(booking)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có lịch tiêm chủng.</p>
      )}

      {/* Modal Chi Tiết */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Chi Tiết Đặt Lịch</h2>
        {selectedBooking && (
          <div>
            <p>
              <strong>ID:</strong> {selectedBooking.bookingId}
            </p>
            <p>
              <strong>Tên Trẻ:</strong> {selectedBooking.childName}
            </p>
            <p>
              <strong>Ngày Đặt:</strong>{" "}
              {new Date(selectedBooking.bookingDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Loại Tiêm:</strong> {selectedBooking.bookingType}
            </p>
            <p>
              <strong>Ghi Chú:</strong> {selectedBooking.note}
            </p>
            <p>
              <strong>Trạng Thái:</strong> {selectedBooking.status}
            </p>
            <button onClick={closeModal} className="close-btn">
              Đóng
            </button>
          </div>
        )}
      </Modal>
    </StaffLayout>
  );
};

export default VaccinationSchedulePage;
