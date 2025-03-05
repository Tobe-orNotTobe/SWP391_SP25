//tạo bảng booking và assign cho bác sĩ
import React, { useEffect, useState } from "react";

import { apiAssignDoctor, apiGetAllBookings } from "../../apis/apiBooking";
import { toast } from "react-toastify";
import { BookingResponse } from "../../interfaces/Booking";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { apiGetAllDoctors } from "../../apis/apiAdmin";
import { Doctor } from "../../interfaces/Doctor";
import "./DoctorList.scss";
import Staff1Layout from "../../components/Layout/StaffLayout/Stafff1Layout/Staff1Layout";

function AssignPage() {
  const [bookings, setBookings] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalDoctorIsOpen, setDoctorModalIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const loadDoctors = async () => {
      const doctorList = await apiGetAllDoctors();
      console.log(doctorList.result);
      console.log("doctor list");
      setDoctors(doctorList.result);
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await apiGetAllBookings();
      if (data?.isSuccess) {
        console.log(data.result);
        setBookings(data.result);
      } else {
        toast.error(data.errorMessage);
      }
    };

    fetchBookings();
  }, []);

  const handleAssignDoctor = async (doctorId: string, bookingId: string) => {
    try {
      const response = await apiAssignDoctor(doctorId, bookingId);
      toast.success(response.status);
      toast.success("Phân công thành công");
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error completing assign:", error);
      throw error; // Hoặc xử lý error theo cách bạn muốn
    }
  };

  const openModal = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalIsOpen(false);
  };

  const openDoctorModal = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setDoctorModalIsOpen(true);
  };

  const closeDoctorModal = () => {
    setSelectedBooking(null);
    setDoctorModalIsOpen(false);
  };
  const navigate = useNavigate();

  return (
    <Staff1Layout>
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
            {bookings.map((booking: BookingResponse, index) => (
              <tr key={index}>
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
                  <button
                    className="detail-btn"
                    onClick={() => openDoctorModal(booking)}
                  >
                    Phân công
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có lịch tiêm chủng.</p>
      )}

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

      <Modal
        isOpen={modalDoctorIsOpen}
        onRequestClose={closeDoctorModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="container">
          <h1 className="title">Danh sách bác sĩ</h1>
          <div className="doctor-grid">
            {doctors.length > 0 ? (
              doctors.map((doctor: Doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <img
                    src={doctor.imageUrl || "/default-avatar.png"}
                    alt={doctor.fullName}
                    className="avatar"
                  />
                  <h2 className="doctor-name">{doctor.fullName}</h2>
                  <p className="username">@{doctor.userName}</p>
                  <p className="email">{doctor.email}</p>
                  <p className="phone">{doctor.phoneNumber}</p>
                  <p className="address">{doctor.address}</p>
                  <span
                    className={`status ${
                      doctor.isActive ? "active" : "inactive"
                    }`}
                  >
                    {doctor.isActive ? "Hoạt động" : "Ngưng hoạt động"}
                  </span>
                  <button
                    className="detail-btn"
                    onClick={() => {
                      handleAssignDoctor(doctor.id, selectedBooking?.bookingId);
                    }}
                  >
                    Phân công
                  </button>
                </div>
              ))
            ) : (
              <p className="no-doctor">Không có bác sĩ nào.</p>
            )}
          </div>
        </div>
      </Modal>
    </Staff1Layout>
  );
}

export default AssignPage;
