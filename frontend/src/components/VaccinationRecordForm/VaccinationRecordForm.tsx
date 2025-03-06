import React, { useState, useEffect } from "react";
import { Select } from "antd"; // Import Select từ Ant Design
import "./VaccinationRecordForm.scss";
import {
  Booking,
  BookingDetail,
  Vaccine,
} from "../../interfaces/VaccineRegistration.ts";
import { BookingResponse } from "../../interfaces/Booking.ts";
import {
  apiGetBookingById,
  apiPutBookingComplete,
} from "../../apis/apiBooking"; // Import các hàm API
import { apiGetChildById } from "../../apis/apiChild.ts";
import { apiGetVaccineDetailById } from "../../apis/apiVaccine.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { scheduler } from "timers/promises";

const { Option } = Select;

// Định nghĩa kiểu dữ liệu cho FormData
interface FormData {
  fullName: string;
  birthDate: string;
  height: string;
  weight: string;
  vaccineType: string;
  vaccineName: string;
  vaccineDose: string;
  vaccinePrice: string;
  reminder: string;
  lotNumber: string;
  reminderDate: string;
  notes: string;
}

interface Props {
  booking: BookingResponse; // Truyền bookingId thay vì booking
}

const VaccinationRecordForm: React.FC<Props> = ({ booking }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    birthDate: "",
    height: "",
    weight: "",
    vaccineType: "",
    vaccineName: "",
    vaccineDose: "",
    vaccinePrice: "",
    reminder: "",
    lotNumber: "",
    reminderDate: "",
    notes: "",
  });

  const [registeredVaccines, setRegisteredVaccines] = useState<Vaccine[]>([]);
  const [childInfo, setChildInfo] = useState<any>(null);
  const [bookings, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate()

  // Fetch thông tin booking và vaccine từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin booking từ API
        const bookingData = await apiGetBookingById(booking.bookingId);
        setBooking(bookingData.result);
        console.log(bookingData.result);

        // Lấy thông tin trẻ từ API
        const childData = await apiGetChildById(bookingData.result.childId);
        setChildInfo(childData.result);
        console.log(childData);

        // Lấy thông tin vaccine từ API dựa trên bookingDetails
        const vaccineDetails = await Promise.all(
          bookingData.result.bookingDetails.map(
            async (detail: BookingDetail) => {
              const vaccineResponse = await apiGetVaccineDetailById(
                detail.vaccineId || detail.comboVaccineId || 0
              );
              const vaccine = vaccineResponse.result;
              return {
                ...vaccine,
                dose: "1 ml", // Giả sử liều vaccine là 1 ml
                price: vaccine.price?.toLocaleString("vi-VN") + " VND", // Định dạng giá
                reminder: "1 tháng", // Giả sử nhắc lại sau 1 tháng
                reminderDate: "",
                notes: "Không có ghi chú",
                status: "Chờ tiêm",
                lotNumber: "CK11212", // Giả sử số lô
              };
            }
          )
        );

        setRegisteredVaccines(vaccineDetails);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [booking.bookingId]);

  const handleComplete = async (bookingId: string) => {
    try {
      const response = await apiPutBookingComplete(bookingId);
      toast.success(response.status)
      console.log(response);
      navigate('/doctor/vaccination-schedule')
      return response;
    } catch (error) {
      console.error("Error completing booking:", error);
      throw error; // Hoặc xử lý error theo cách bạn muốn
    }
  };

  const handleReminderDateChange = (index: number, date: string) => {
    const updatedVaccines = [...registeredVaccines];
    updatedVaccines[index].reminderDate = date;
    setRegisteredVaccines(updatedVaccines);
  };

  const handleStatusChange = (index: number, status: string) => {
    const updatedVaccines = [...registeredVaccines];
    updatedVaccines[index].status = status;
    setRegisteredVaccines(updatedVaccines);
  };

  const handleLotNumberChange = (index: number, lotNumber: string) => {
    const updatedVaccines = [...registeredVaccines];
    updatedVaccines[index].lotNumber = lotNumber;
    setRegisteredVaccines(updatedVaccines);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="vaccination-record-container">
      <form onSubmit={handleSubmit}>
        <h1>GHI NHẬN HỒ SƠ TIÊM CHỦNG</h1>

        {/* Thông tin cá nhân */}
        <div className="form-section">
          <h2>Thông tin cá nhân</h2>
          <div className="form-group">
            <label>Họ tên người tiêm *</label>
            <input
              type="text"
              name="fullName"
              value={childInfo?.fullName || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh *</label>
            <input
              type="date"
              name="birthDate"
              value={childInfo?.dateOfBirth?.split("T")[0] || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Chiều cao (cm) *</label>
            <input
              type="number"
              name="height"
              value={childInfo.height}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Cân nặng (kg) *</label>
            <input
              type="number"
              name="weight"
              value={childInfo.weight}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Thông tin dịch vụ */}
        <div className="form-section">
          <h2>Thông tin dịch vụ</h2>
          <table className="vaccine-table">
            <thead>
              <tr>
                <th>Tên vaccine</th>
                <th>Liều vaccine</th>
                <th>Giá vaccine</th>
                <th>Nhắc lại sau</th>
                <th>Ngày nhắc lại</th>
                <th>Số lô</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {registeredVaccines.map((vaccine, index) => (
                <tr key={index}>
                  {/* Tên vaccine (read-only) */}
                  <td>
                    <input type="text" value={vaccine.name} readOnly />
                  </td>

                  {/* Liều vaccine (read-only) */}
                  <td>
                    <input type="text" value={vaccine.dose} readOnly />
                  </td>

                  {/* Giá vaccine (read-only) */}
                  <td>
                    <input type="text" value={vaccine.price} readOnly />
                  </td>

                  {/* Nhắc lại sau */}
                  <td>
                    <select
                      name="reminder"
                      value={formData.reminder}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn thời gian</option>
                      <option value="1 tháng">1 tháng</option>
                      <option value="2 tháng">2 tháng</option>
                      <option value="6 tháng">6 tháng</option>
                      <option value="Tùy chọn">Tùy chọn</option>
                    </select>
                  </td>

                  {/* Ngày nhắc lại (nhân viên nhập) */}
                  <td>
                    <input
                      type="date"
                      name="reminderDate"
                      value={vaccine.reminderDate || ""}
                      onChange={(e) =>
                        handleReminderDateChange(index, e.target.value)
                      }
                      required
                    />
                  </td>

                  {/* Số lô */}
                  <td>
                    <input
                      type="text"
                      value={vaccine.lotNumber}
                      onChange={(e) =>
                        handleLotNumberChange(index, e.target.value)
                      }
                    />
                  </td>

                  {/* Trạng thái (sử dụng Antd Select) */}
                  <td>
                    <Select
                      value={vaccine.status}
                      onChange={(value: string) =>
                        handleStatusChange(index, value)
                      }
                      style={{ width: "100%" }}
                    >
                      <Option value="Chờ tiêm">Chờ tiêm</Option>
                      <Option value="Đã tiêm">Đã tiêm</Option>
                    </Select>
                  </td>

                  {/* Ghi chú (read-only) */}
                  <td>
                    <textarea value={vaccine.notes} readOnly />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nút hoàn thành */}
        <button
          type="submit"
          className="submit-button"
          onClick={() => handleComplete(booking.bookingId)}
        >
          Hoàn thành
        </button>
      </form>
    </div>
  );
};

export default VaccinationRecordForm;
