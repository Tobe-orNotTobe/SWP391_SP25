import React, { useState } from "react";
import { Tag, Select } from "antd"; // Import Select từ Ant Design
import "./VaccinationRecordForm.scss";

const { Option } = Select;

const VaccinationRecordForm = () => {
  const [formData, setFormData] = useState({
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

  const [registeredVaccines, setRegisteredVaccines] = useState([
    {
      image:
        "https://vnvc.vn/wp-content/uploads/2019/11/vacxin-prevenar-13-1.jpg",
      name: "Covid Vaccine",
      type: "Gói",
      dose: "1 ml",
      price: "200,000 VND",
      reminder: "1 tháng",
      reminderDate: "",
      notes: "Không có ghi chú",
      status: "Chờ tiêm", // Trạng thái mặc định
      lotNumber: "CK11212", // Số lô mặc định
    },
    {
      image:
        "https://vnvc.vn/wp-content/uploads/2019/11/vacxin-prevenar-13-1.jpg",
      name: "Flu Vaccine",
      type: "Lẻ",
      dose: "0.5 ml",
      price: "150,000 VND",
      reminder: "6 tháng",
      reminderDate: "",
      notes: "Cần theo dõi phản ứng",
      status: "Đã tiêm", // Trạng thái mặc định
      lotNumber: "CD12121", // Số lô mặc định
    },
  ]);

  const mockUser = {
    fullName: "Nguyễn Văn A",
    birthDate: "1990-01-01",
    height: "170",
    weight: "65",
  };

  const handleReminderDateChange = (index, date) => {
    const updatedVaccines = [...registeredVaccines];
    updatedVaccines[index].reminderDate = date;
    setRegisteredVaccines(updatedVaccines);
  };

  const handleStatusChange = (index, status) => {
    const updatedVaccines = [...registeredVaccines];
    updatedVaccines[index].status = status;
    setRegisteredVaccines(updatedVaccines);
  };

  const handleLotNumberChange = (index, lotNumber) => {
    const updatedVaccines = [...registeredVaccines];
    updatedVaccines[index].lotNumber = lotNumber;
    setRegisteredVaccines(updatedVaccines);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý dữ liệu form ở đây
    console.log(formData);
  };

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
              value={mockUser.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh *</label>
            <input
              type="date"
              name="birthDate"
              value={mockUser.birthDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Chiều cao (cm) *</label>
            <input
              type="number"
              name="height"
              value={mockUser.height}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Cân nặng (kg) *</label>
            <input
              type="number"
              name="weight"
              value={mockUser.weight}
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
                <th>Loại vaccine</th>
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

                  {/* Loại vaccine (read-only) */}
                  <td>
                    <input type="text" value={vaccine.type} readOnly />
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
                      onChange={(value) => handleStatusChange(index, value)}
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
        <button type="submit" className="submit-button">
          Hoàn thành
        </button>
      </form>
    </div>
  );
};

export default VaccinationRecordForm;
