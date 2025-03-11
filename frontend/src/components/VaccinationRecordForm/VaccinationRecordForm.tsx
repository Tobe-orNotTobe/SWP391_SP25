import React, { useState, useEffect } from "react";
import { Select } from "antd";
import "./VaccinationRecordForm.scss";
import {
  VaccineRecordResponse,
  VaccineRecord,
  UpdateVaccineRecordRequest,
} from "../../interfaces/VaccineRecord.ts";
import {
  apiGetVaccineRecord,
  apiUpdateVaccineRecord,
} from "../../apis/apiVaccineRecord.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {AxiosError} from "axios";

const { Option } = Select;

interface Props {
  bookingId: number; // Nhận bookingId thay vì toàn bộ đối tượng booking
}

const VaccinationRecordForm: React.FC<Props> = ({ booking }) => {
  const [vaccineData, setVaccineData] = useState<VaccineRecordResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [vaccineRecordId, setvaccineRecordId] = useState<number>(-1);
  const [updatedRecords, setUpdatedRecords] = useState<
    UpdateVaccineRecordRequest[]
  >([]);

  const navigate = useNavigate();

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGetVaccineRecord(booking.bookingId);
        setVaccineData(response);
        // console.log(response);
        setUpdatedRecords(response.result.vaccineRecords); // Lưu dữ liệu vào state
        // console.log(response.result.vaccineRecords)
        setvaccineRecordId(response.result.vaccineRecords[0].vaccinationRecordId);
        // console.log(response.result.vaccineRecords[0].vaccinationRecordId)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vaccine:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [booking.bookingId]);

  const handleUpdateRecord = (
    index: number,
    updatedField: Partial<VaccineRecord>
  ) => {
    if (!vaccineData) return;

    const newRecords = [...updatedRecords];
    newRecords[index] = { ...newRecords[index], ...updatedField };

    setUpdatedRecords(newRecords);
  };

  // Xử lý cập nhật trạng thái, số lô, ngày nhắc lại
  // const handleUpdateRecord = async (index: number, updatedField: Partial<VaccineRecord>) => {
  //   if (!vaccineData) return;

  //   try {
  //     const updatedRecords = [...vaccineData.result.vaccineRecords];
  //     updatedRecords[index] = { ...updatedRecords[index], ...updatedField };

  //     setVaccineData({
  //       ...vaccineData,
  //       result: { ...vaccineData.result, vaccineRecords: updatedRecords },
  //     });

  //     // Gửi request cập nhật đến API
  //     const updateRequest: UpdateVaccineRecordRequest = {
  //       notes: updatedRecords[index].notes,
  //       status: updatedRecords[index].status,
  //       nextDoseDate: updatedRecords[index].nextDoseDate || "",
  //     };
  //     await apiUpdateVaccineRecord(booking.bookingId, updateRequest);
  //     toast.success("Cập nhật thành công!");
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật vaccine record:", error);
  //     toast.error("Cập nhật thất bại!");
  //   }
  // };

  // Xử lý hoàn thành booking
  const handleComplete = async () => {
    if (!vaccineData) return;

    try {
      for (const record of updatedRecords) {
        const updateRequest: UpdateVaccineRecordRequest = {
          notes: record.notes,
          status: "Completed",
          nextDoseDate: record.nextDoseDate || "",
        };

        await apiUpdateVaccineRecord(vaccineRecordId, updateRequest);

      }

      toast.success("Hồ sơ đã được cập nhật thành công!");
      navigate("/doctor/vaccination-schedule");
    } catch (err : unknown)  {
      if (err instanceof AxiosError) {
        console.log(err.response)
        toast.error(`${err.response?.data?.errorMessages}` || "Nhập đầy đủ thông tin")
      }else {
        toast.error("Lỗi không xác định")
      }
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!vaccineData) {
    return <div>Không tìm thấy dữ liệu!</div>;
  }

  return (
    <div className="vaccination-record-container">
      <form>
        <h1>GHI NHẬN HỒ SƠ TIÊM CHỦNG</h1>

        {/* Thông tin cá nhân */}
        <div className="form-section">
          <h2>Thông tin cá nhân</h2>
          <div className="form-group">
            <label>Họ tên *</label>
            <input type="text" value={vaccineData.result.fullName} readOnly />
          </div>
          <div className="form-group">
            <label>Ngày sinh *</label>
            <input
              type="date"
              value={vaccineData.result.dateOfBirth.split("T")[0]}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Chiều cao (cm) *</label>
            <input type="number" value={vaccineData.result.height} readOnly />
          </div>
          <div className="form-group">
            <label>Cân nặng (kg) *</label>
            <input type="number" value={vaccineData.result.weight} readOnly />
          </div>
        </div>

        {/* Thông tin vaccine */}
        <div className="form-section">
          <h2>Thông tin vaccine</h2>
          <table className="vaccine-table">
            <thead>
              <tr>
                <th>Tên vaccine</th>
                <th>Liều lượng</th>
                <th>Giá</th>
                <th>Ngày nhắc lại</th>
                <th>Số lô</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {vaccineData.result.vaccineRecords.map((record, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" value={record.vaccineName} readOnly />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={record.doseAmount + " ml"}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={record.price.toLocaleString("vi-VN") + " VND"}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      // value={
                      //   record.nextDoseDate
                      //     ? record.nextDoseDate.split("T")[0]
                      //     : ""
                      // }
                      onChange={(e) =>
                        handleUpdateRecord(index, {
                          nextDoseDate: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      readOnly
                      type="text"
                      value={record.batchNumber}
                      onChange={(e) =>
                        handleUpdateRecord(index, {
                          batchNumber: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <Select
                      value={record.status}
                      onChange={(value) =>
                        handleUpdateRecord(index, { status: value })
                      }
                      style={{ width: "100%" }}
                    >
                      <Option value="Chờ tiêm">Chờ tiêm</Option>
                      <Option value="Đã tiêm">Đã tiêm</Option>
                    </Select>
                  </td>
                  <td>
                    <textarea
                      //value={record.notes}
                      onChange={(e) =>
                        handleUpdateRecord(index, { notes: e.target.value })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nút hoàn thành */}
        <button
          type="button"
          className="submit-button"
          onClick={handleComplete}
        >
          Hoàn thành
        </button>
      </form>
    </div>
  );
};

export default VaccinationRecordForm;
