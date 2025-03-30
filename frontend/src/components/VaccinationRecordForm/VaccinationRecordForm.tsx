import React, { useState, useEffect } from "react";
import { Modal, Select } from "antd";
import "./VaccinationRecordForm.scss";
import {
  VaccineRecordResponse,
  VaccineRecord,
  UpdateVaccineRecordRequest,
} from "../../interfaces/VaccineRecord.ts";
import {
  apiGetVaccineRecordByBookingDetailId,
  apiUpdateVaccineRecord,
} from "../../apis/apiVaccineRecord.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  BookingDetailResponse,
} from "../../interfaces/VaccineRegistration.ts";

const { Option } = Select;

interface Props {
  booking: BookingDetailResponse;
}

const VaccinationRecordForm: React.FC<Props> = ({ booking }) => {
  const [vaccineData, setVaccineData] = useState<VaccineRecordResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [updatedRecords, setUpdatedRecords] = useState<VaccineRecord[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await apiGetVaccineRecordByBookingDetailId(
        booking.bookingDetailId
      );
      setVaccineData(response);

      const vaccineRecords = response.result.vaccineRecords.map(
        (record: VaccineRecord) => ({
          ...record,
          nextDoseDate: record.nextDoseDate || "",
          notes: record.notes || "",
        })
      );

      setUpdatedRecords(vaccineRecords);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu vaccine:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [booking.bookingDetailId]);

  const handleUpdateRecord = (
    index: number,
    updatedField: Partial<VaccineRecord>
  ) => {
    if (!vaccineData) return;

    const newRecords = [...updatedRecords];
    newRecords[index] = { ...newRecords[index], ...updatedField };
    setUpdatedRecords(newRecords);
  };

  const showCompletionConfirmationModal = (
    onConfirm: () => void,
    onCancel: () => void
  ) => {
    Modal.confirm({
      title: "Xác nhận hoàn thành",
      content:
        "Bạn có xác nhận đã tiêm đủ không ?",
      okText: "Có",
      cancelText: "Chưa",
      onOk: onConfirm, // Xử lý khi người dùng xác nhận
      onCancel: onCancel, // Xử lý khi người dùng hủy
    });
  };

  const handleComplete = async () => {
    if (!vaccineData) return;

    try {

      const allCompleted = updatedRecords.every(
        (record) => record.status === "Completed"
      );

      if (allCompleted) {
        // Hiển thị modal xác nhận thay vì window.confirm
        showCompletionConfirmationModal(
          async () => {
            // Xử lý khi người dùng xác nhận tiếp tục
            // for (const record of updatedRecords) {
            //   const updateRequest: UpdateVaccineRecordRequest = {
            //     notes: record.notes,
            //     status: "Completed",
            //     nextDoseDate: record.nextDoseDate || "",
            //   };
            //   await apiUpdateVaccineRecord(
            //     Number(record.vaccinationRecordId),
            //     updateRequest
            //   );
            // }

            toast.success("Hồ sơ đã được cập nhật thành công!");
            navigate("/doctor/vaccination-schedule");
          },
          () => {
            // Xử lý khi người dùng hủy
            toast.warning("Hủy cập nhật hồ sơ.");
          }
        );
        return; // Dừng lại nếu chưa xác nhận
      }

      // Nếu tất cả đều đã hoàn thành, tiếp tục cập nhật
      for (const record of updatedRecords) {
        const updateRequest: UpdateVaccineRecordRequest = {
          notes: record.notes,
          status: "Completed",
          nextDoseDate: record.nextDoseDate || "",
        };
        await apiUpdateVaccineRecord(
          Number(record.vaccinationRecordId),
          updateRequest
        );
      }

      toast.success("Hồ sơ đã được cập nhật thành công!");
      navigate("/doctor/vaccination-schedule");
    } catch (error) {
      console.error("Lỗi khi cập nhật vaccine record:", error);
      toast.error("Không thể hoàn thành hồ sơ!");
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!vaccineData) return <div>Không tìm thấy dữ liệu!</div>;

  return (
    <div className="vaccination-record-container">
      <form>
        <h1>GHI NHẬN HỒ SƠ TIÊM CHỦNG</h1>

        {/* Thông tin cá nhân */}
        <div className="form-section">
          <h2>Thông tin cá nhân</h2>
          <div className="form-group">
            <label>Họ tên</label>
            <input type="text" value={vaccineData.result.fullName} readOnly />
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              value={vaccineData.result.dateOfBirth.split("T")[0]}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Chiều cao (cm)</label>
            <input type="number" value={vaccineData.result.height} readOnly />
          </div>
          <div className="form-group">
            <label>Cân nặng (kg)</label>
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
                <tr key={record.vaccinationRecordId}>
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
                      readOnly
                      value={
                        record.nextDoseDate
                          ? record.nextDoseDate.split("T")[0]
                          : ""
                      }
                      min={new Date().toISOString().split("T")[0]}
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
                      <Option value="Completed">Đã tiêm</Option>
                    </Select>
                  </td>
                  <td>
                    <textarea
                      value={updatedRecords[index].notes || ""}
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
