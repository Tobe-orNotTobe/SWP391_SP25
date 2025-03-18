import React, { useEffect, useRef, useState } from "react";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully.ts";
import {
  apiGetBookingById,
  apiGetDoctorBookings,
} from "../../apis/apiBooking.ts";
import "./VaccinationSchedulePage.scss";
import {
  BookingResponse,
  BookingDetail,
  Vaccine,
} from "../../interfaces/VaccineRegistration.ts";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "../../components/Layout/StaffLayout/DoctorLayout/DoctorLayout.tsx";
import { Table, Button, Space, Input, InputRef, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Modal } from "antd";
import {
  apiCreateVaccineRecord,
  apiGetVaccineRecord,
  apiGetVaccineRecordByBookingId,
} from "../../apis/apiVaccineRecord.ts";
import { toast } from "react-toastify";
import {
  apiGetVaccineDetailById,
  apiGetComBoVaccineById,
} from "../../apis/apiVaccine.ts";

const VaccinationSchedulePage: React.FC = () => {
  const { sub: doctorId } = IsLoginSuccessFully();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [vaccineDetails, setVaccineDetails] = useState<any[]>([]);
  const [comboDetails, setComboDetails] = useState<any[]>([]);
  const searchInput = useRef<InputRef>(null);

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

  const openModal = async (booking: BookingResponse) => {
    // Reset state về mảng rỗng
    setVaccineDetails([]);
    setComboDetails([]);

    setSelectedBooking(booking);
    setModalIsOpen(true);

    try {
      const bookingDetailsResponse = await apiGetBookingById(booking.bookingId);
      if (bookingDetailsResponse?.isSuccess) {
        const bookingDetails = bookingDetailsResponse.result.bookingDetails;

        const { vaccineDetails, comboDetails } =
          await getVaccineAndComboDetails(bookingDetails);
        setVaccineDetails(vaccineDetails);
        setComboDetails(comboDetails);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const getVaccineAndComboDetails = async (bookingDetails: BookingDetail[]) => {
    const vaccineDetails = [];
    const comboDetails = [];

    for (const detail of bookingDetails) {
      if (detail.vaccineId !== null && detail.vaccineId !== undefined) {
        // Lấy thông tin vaccine đơn lẻ
        const vaccine = await apiGetVaccineDetailById(detail.vaccineId);
        if (vaccine && vaccine.result) {
          vaccineDetails.push(vaccine.result);
        }
      } else if (
        detail.comboVaccineId !== null &&
        detail.comboVaccineId !== undefined
      ) {
        // Lấy thông tin combo và các vaccine trong combo
        const comboVaccine = await apiGetComBoVaccineById(
          detail.comboVaccineId
        );
        if (comboVaccine && comboVaccine.result) {
          // Thêm thông tin combo vào danh sách combo
          comboDetails.push(comboVaccine.result);

          // Thêm các vaccine trong combo vào danh sách vaccine
          if (
            comboVaccine.result.vaccines &&
            comboVaccine.result.vaccines.length > 0
          ) {
            vaccineDetails.push(...comboVaccine.result.vaccines);
          }
        }
      }
    }

    return { vaccineDetails, comboDetails };
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setVaccineDetails([]);
    setComboDetails([]);
    setModalIsOpen(false);
  };

  const navigate = useNavigate();

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string | number | boolean, record: BookingResponse) => {
      const recordValue = record[dataIndex as keyof BookingResponse];
      return recordValue
        ? recordValue
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase())
        : false;
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleProceedVaccination = async (booking: BookingResponse) => {
    try {
      if (!booking.bookingId) return;

      // Kiểm tra xem vaccine record đã tồn tại chưa
      let existingRecord;
      try {
        existingRecord = await apiGetVaccineRecordByBookingId(
          booking.bookingId
        );
      } catch (error:any) {
        if (error.response && error.response.status === 400) {
          existingRecord = null;
        } else {
          throw error;
        }
      }

      if (existingRecord && existingRecord.isSuccess) {
        // Nếu record đã tồn tại, hiển thị thông báo và không tạo mới
        navigate("/doctor/service", { state: booking });
        return;
      }

      // Nếu record chưa tồn tại, tạo mới
      const response = await apiCreateVaccineRecord(booking.bookingId);

      if (response?.isSuccess) {
        console.log("Vaccine record created successfully", response);
        navigate("/doctor/service", { state: booking });
      } else {
        console.error("Failed to create vaccine record", response);
        toast.error(response.data.errorMessages);
      }
    } catch (error) {
      console.error("Error creating vaccine record", error);
      toast.error("Đã xảy ra lỗi khi xử lý vaccine record.");
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "bookingId",
      key: "bookingId",
      ...getColumnSearchProps("bookingId"),
      sorter: (a: BookingResponse, b: BookingResponse) =>
        Number(a.bookingId) - Number(b.bookingId),
    },
    {
      title: "Tên Trẻ",
      dataIndex: "childName",
      key: "childName",
      ...getColumnSearchProps("childName"),
      sorter: (a: BookingResponse, b: BookingResponse) =>
        a.childName.localeCompare(b.childName),
    },
    {
      title: "Ngày Đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: BookingResponse, b: BookingResponse) =>
        new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime(),
    },
    {
      title: "Loại Tiêm",
      dataIndex: "bookingType",
      key: "bookingType",
      ...getColumnSearchProps("bookingType"),
      filters: [
        { text: "Loại 1", value: "Loại 1" },
        { text: "Loại 2", value: "Loại 2" },
      ],
      onFilter: (value: string | number, record: BookingResponse) =>
        record.bookingType
          ?.toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
    },
    {
      title: "Giá Tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
      sorter: (a: BookingResponse, b: BookingResponse) =>
        Number(a.totalPrice) - Number(b.totalPrice),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Chờ tiêm", value: "Pending" },
        { text: "Đã tiêm", value: "Completed" },
        { text: "Đã hủy", value: "Canceled" },
        { text: "Đã xóa", value: "Deleted" },
      ],
      onFilter: (value: any, record: BookingResponse) =>
        record.status === value,
      render: (status: string) => {
        const statusMapping: {
          [key: string]: { text: string; color: string };
        } = {
          Pending: { text: "Chờ tiêm", color: "orange" },
          Completed: { text: "Đã tiêm", color: "green" },
          Canceled: { text: "Đã hủy", color: "red" },
          Deleted: { text: "Đã xóa", color: "gray" },
        };

        const statusInfo = statusMapping[status] || {
          text: status,
          color: "default",
        };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Chi Tiết",
      key: "action",
      render: (_: undefined, record: BookingResponse) => (
        <Space size="middle">
          <Button type="primary" onClick={() => openModal(record)}>
            Chi tiết
          </Button>
          {record.status !== "Completed" && (
            <Button
              type="primary"
              color="green"
              variant="solid"
              onClick={() => handleProceedVaccination(record)}
            >
              Tiến hành tiêm
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <DoctorLayout>
      <h1>Lịch Tiêm Chủng</h1>
      {bookings.length > 0 ? (
        <Table dataSource={bookings} columns={columns} rowKey="bookingId" />
      ) : (
        <p>Không có lịch tiêm chủng.</p>
      )}

      <Modal
        open={modalIsOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        centered
        className="custom-modal"
      >
        <div className="modal-content">
          <h2 className="modal-title">Chi Tiết Đặt Lịch</h2>
          {selectedBooking && (
            <div className="modal-body">
              <div className="info-section">
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
                  <strong>Trạng Thái:</strong>{" "}
                  <Tag
                    color={
                      selectedBooking.status === "Pending"
                        ? "orange"
                        : selectedBooking.status === "Completed"
                        ? "green"
                        : selectedBooking.status === "Canceled"
                        ? "red"
                        : "gray"
                    }
                  >
                    {selectedBooking.status}
                  </Tag>
                </p>
              </div>

              {/* Hiển thị Chi Tiết Vaccine hoặc Combo */}
              {comboDetails.length > 0 && (
                <div className="combo-section">
                  <h3>Chi Tiết Combo</h3>
                  {comboDetails.map((combo) => (
                    <div key={combo.comboId} className="combo-item">
                      <p>
                        <strong>Tên Combo:</strong> {combo.comboName}
                      </p>
                      <p>
                        <strong>Giá Combo:</strong>{" "}
                        {combo.totalPrice?.toLocaleString()} VNĐ
                      </p>
                      <p>
                        <strong>Vaccine trong Combo:</strong>
                      </p>
                      <ul>
                        {combo.vaccines.map((vaccine: Vaccine) => (
                          <div key={vaccine.vaccineId}>
                            {vaccine.name} - {vaccine.price?.toLocaleString()}{" "}
                            VNĐ
                          </div>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Hiển thị vaccine đơn lẻ (chỉ khi không có combo) */}
              {vaccineDetails.length > 0 && comboDetails.length === 0 && (
                <div className="vaccine-section">
                  <h3>Chi Tiết Vaccine</h3>
                  {vaccineDetails.map((vaccine) => (
                    <div key={vaccine.vaccineId} className="vaccine-item">
                      <p>
                        <strong>Tên Vaccine:</strong> {vaccine.name}
                      </p>
                      <p>
                        <strong>Giá:</strong> {vaccine.price?.toLocaleString()}{" "}
                        VNĐ
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </DoctorLayout>
  );
};

export default VaccinationSchedulePage;
