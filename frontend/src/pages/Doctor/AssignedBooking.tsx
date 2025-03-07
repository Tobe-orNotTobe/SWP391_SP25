import React, { useEffect, useRef, useState } from "react";
//import StaffLayout from "../../components/Layout/StaffLayout/StaffLayout.tsx";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully.ts";
import { apiGetDoctorBookings } from "../../apis/apiBooking.ts";
import "./VaccinationSchedulePage.scss";
import { BookingResponse } from "../../interfaces/VaccineRegistration.ts";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "../../components/Layout/StaffLayout/DoctorLayout/DoctorLayout.tsx";
import { Table, Button, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Modal} from "antd";

const VaccinationSchedulePage: React.FC = () => {
  const { sub: doctorId } = IsLoginSuccessFully();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<any>(null);

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

  // Hàm xử lý reset tìm kiếm
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  // Hàm tạo các props cho cột có chức năng tìm kiếm
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
    onFilter: (value: any, record: any) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  // Định nghĩa các cột của bảng
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "bookingId",
      key: "bookingId",
      ...getColumnSearchProps("bookingId"), // Thêm chức năng tìm kiếm
      sorter: (a: BookingResponse, b: BookingResponse) =>
        Number(a.bookingId) - Number(b.bookingId), // Thêm chức năng sắp xếp
    },
    {
      title: "Tên Trẻ",
      dataIndex: "childName",
      key: "childName",
      ...getColumnSearchProps("childName"), // Thêm chức năng tìm kiếm
      sorter: (a: BookingResponse, b: BookingResponse) =>
        a.childName.localeCompare(b.childName), // Thêm chức năng sắp xếp
    },
    {
      title: "Ngày Đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: BookingResponse, b: BookingResponse) =>
        new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime(), // Thêm chức năng sắp xếp
    },
    {
      title: "Loại Tiêm",
      dataIndex: "bookingType",
      key: "bookingType",
      ...getColumnSearchProps("bookingType"), // Thêm chức năng tìm kiếm
      filters: [
        { text: "Loại 1", value: "Loại 1" },
        { text: "Loại 2", value: "Loại 2" },
      ], // Thêm chức năng lọc
      onFilter: (value: any, record: BookingResponse) =>
        record.bookingType.includes(value),
    },
    {
      title: "Giá Tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
      sorter: (a: BookingResponse, b: BookingResponse) =>
        Number(a.totalPrice) - Number(b.totalPrice), // Thêm chức năng sắp xếp
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Đang chờ", value: "Đang chờ" },
        { text: "Hoàn thành", value: "Hoàn thành" },
      ], // Thêm chức năng lọc
      onFilter: (value: any, record: BookingResponse) =>
        record.status.includes(value),
      render: (status: string) => {
        const statusStyle = status === "Hoàn thành" ? "green" : "orange";
        return (
          <span
            style={{
              color: statusStyle === "green" ? "#52c41a" : "#f5222d",
              fontWeight: "bold",
            }}
          >
            {status}
          </span>
        );
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
          <Button
            type="primary"
            color="green"
            variant="solid"
            onClick={() => {
              if (record.bookingId) {
                navigate("/doctor/service", {
                  state: bookings.find(
                    (booking) => booking.bookingId === record.bookingId
                  ),
                });
                console.log(bookings);
              }
            }}
          >
            Tiến hành tiêm
          </Button>
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

      {/* Modal Chi Tiết */}
      <Modal visible={modalIsOpen} onCancel={closeModal}>
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
          </div>
        )}
      </Modal>
    </DoctorLayout>
  );
};

export default VaccinationSchedulePage;
