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
  apiGetVaccineRecordByBookingDetailId,
  apiGetVaccineRecordByBookingId,
} from "../../apis/apiVaccineRecord.ts";
import { toast } from "react-toastify";
import {
  apiGetVaccineDetailById,
  apiGetComBoVaccineById,
  apiGetVaccineDetail,
} from "../../apis/apiVaccine.ts";
import { VaccineRecord, VaccineRecordResponse } from "../../interfaces/VaccineRecord.ts";

const VaccinationSchedulePage: React.FC = () => {
  const { sub: doctorId } = IsLoginSuccessFully();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [vaccineDetails, setVaccineDetails] = useState<VaccineRecord[]>([]);
  const [vaccineRecordDetails, setVaccineRecordDetails] = useState<VaccineRecordResponse | null>(null);
  const searchInput = useRef<InputRef>(null);

  const navigate = useNavigate();

  const fetchBookings = async () => {
    if (doctorId) {
      const data = await apiGetDoctorBookings(doctorId);
      if (data) {
        console.log(data);
        setBookings(data);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [doctorId]);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Chưa hoàn thành"
  );
  const completedBookings = bookings.filter(
    (booking) => booking.status !== "Chưa hoàn thành"
  );

  const openModal = async (booking: BookingResponse) => {
    setVaccineDetails([]);
    setSelectedBooking(booking);
    setModalIsOpen(true);

    try {
      let existingRecord;
      try {
        existingRecord = await apiGetVaccineRecordByBookingDetailId(booking.bookingDetailId);
      } catch (error: any) {
        if (error.response?.status === 400) {
          const createResponse = await apiCreateVaccineRecord(booking.bookingDetailId);
          if (createResponse && createResponse?.isSuccess) {
            existingRecord = await apiGetVaccineRecordByBookingDetailId(booking.bookingDetailId);
          } else {
          }
        } else {
          throw error;
        }
      }

      if (existingRecord?.isSuccess) {
        setVaccineRecordDetails(existingRecord);
      } else {
        setVaccineDetails([]);
      }
    } catch (error) {
      console.error("Error fetching or creating vaccine record:", error);
    }
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setVaccineDetails([]);
    setVaccineRecordDetails(null);
    setModalIsOpen(false);
  };

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
      if (!booking.bookingDetailId) return;

      let existingRecord;
      try {
        existingRecord = await apiGetVaccineRecordByBookingDetailId(
          booking.bookingDetailId
        );
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          existingRecord = null;
        } else {
          throw error;
        }
      }

      if (existingRecord && existingRecord.isSuccess) {
        navigate("/doctor/service", { state: booking });
        return;
      }

      const response = await apiCreateVaccineRecord(booking.bookingDetailId);
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
      dataIndex: "bookingDetailId",
      key: "bookingDetailId",
      ...getColumnSearchProps("bookingDetailId"),
      sorter: (a: BookingResponse, b: BookingResponse) =>
        Number(a.bookingDetailId) - Number(b.bookingDetailId),
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
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
      sorter: (a: BookingResponse, b: BookingResponse) =>
        Number(a.totalPrice) - Number(b.totalPrice),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Chờ tiêm", value: "Chưa hoàn thành" },
        { text: "Đã tiêm", value: "Hoàn thành" },
      ],
      onFilter: (value: any, record: BookingResponse) =>
        record.status === value,
      render: (status: string) => {
        const statusLabels: { [key: string]: string } = {
          "Chưa hoàn thành": "Chờ tiêm",
          "Hoàn thành": "Đã tiêm",
        };
        const statusColors: { [key: string]: string } = {
          "Chưa hoàn thành": "orange",
          "Hoàn thành": "green",
        };
        const vietnameseStatus = statusLabels[status] || status;
        return (
          <Tag color={statusColors[status] || "default"}>
            {vietnameseStatus}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: undefined, record: BookingResponse) => (
        <Space size="middle">
          <Button type="primary" onClick={() => openModal(record)}>
            Chi tiết
          </Button>
          {record.status === "Chưa hoàn thành" && (
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

  const completedColumns = columns
    .filter((col) => col.key !== "action")
    .concat({
      title: "Hành động",
      key: "action",
      render: (_: undefined, record: BookingResponse) => (
        <Space size="middle">
          <Button type="primary" onClick={() => openModal(record)}>
            Chi tiết
          </Button>
        </Space>
      ),
    });

  return (
    <DoctorLayout>
      <h1>Lịch Tiêm Chủng</h1>

      <h2>Các Đơn Chưa Hoàn Thành</h2>
      {pendingBookings.length > 0 ? (
        <Table
          dataSource={pendingBookings}
          columns={columns}
          rowKey="bookingDetailId"
          style={{ marginBottom: 20 }}
        />
      ) : (
        <p>Không có lịch tiêm chủng chưa hoàn thành.</p>
      )}

      <h2>Các Đơn Đã Hoàn Thành</h2>
      {completedBookings.length > 0 ? (
        <Table
          dataSource={completedBookings}
          columns={completedColumns}
          rowKey="bookingDetailId"
        />
      ) : (
        <p>Không có lịch tiêm chủng đã hoàn thành.</p>
      )}

<Modal
  open={modalIsOpen}
  onCancel={closeModal}
  footer={null}
  width={700}
  centered
  className="vaccination-modal"
>
  <div className="modal-content">
    <h2 className="modal-title">Chi Tiết Đặt Lịch</h2>
    {selectedBooking && (
      <div className="modal-body">
        <div className="info-section">
          <p><strong>Mã đơn:</strong> {vaccineRecordDetails?.result.vaccinationRecordId}</p>
          <p><strong>Tên trẻ:</strong> {vaccineRecordDetails?.result.fullName}</p>
          <p>
            <strong>Trạng Thái:</strong>{" "}
            <Tag
              color={
                selectedBooking.status === "Chưa hoàn thành" 
                  ? "orange" 
                  : "green"
              }
            >
              {selectedBooking.status === "Chưa hoàn thành" 
                ? "Chờ tiêm" 
                : "Đã tiêm"
              }
            </Tag>
          </p>

          {selectedBooking.status !== "Chưa hoàn thành" && 
           vaccineRecordDetails?.result?.vaccineRecords?.length > 0 && (
            <div className="vaccine-record-section">
              <h3>Thông Tin Tiêm Chủng</h3>
              <table className="vaccine-record-table">
                <thead>
                  <tr>
                    <th>Tên Vaccine</th>
                    <th>Liều lượng</th>
                    <th>Ngày tiêm</th>
                    <th>Số lô</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccineRecordDetails.result.vaccineRecords.map((record) => (
                    <tr key={record.vaccinationRecordId}>
                      <td>{record.vaccineName}</td>
                      <td>{record.doseAmount} ml</td>
                      <td>
                        {new Date(record.vaccinationDate).toLocaleDateString()}
                      </td>
                      <td>{record.batchNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</Modal>
    </DoctorLayout>
  );
};

export default VaccinationSchedulePage;