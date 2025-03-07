import  { useEffect, useState, useRef } from "react";
import { apiAssignDoctor, apiGetAllBookings } from "../../apis/apiBooking";
import { toast } from "react-toastify";
import { BookingResponse } from "../../interfaces/VaccineRegistration.ts";
//import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { apiGetAllDoctors } from "../../apis/apiAdmin";
import { Doctor } from "../../interfaces/Doctor";
import "./DoctorList.scss";
import Staff1Layout from "../../components/Layout/StaffLayout/Stafff1Layout/Staff1Layout";
import { Table, Button, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Modal, Card, Avatar, Typography, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function AssignPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalDoctorIsOpen, setDoctorModalIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<any>(null);

  useEffect(() => {
    const loadDoctors = async () => {
      const doctorList = await apiGetAllDoctors();
      setDoctors(doctorList.result);
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await apiGetAllBookings();
      if (data?.isSuccess) {
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
      console.log("Phân công thành công");
      return response;
    } catch (error) {
      console.error("Error completing assign:", error);
      throw error;
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

  // Hàm xử lý tìm kiếm
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
    },
    {
      title: "Chi Tiết",
      key: "action",
      render: (_: any, record: BookingResponse) => (
        <Space size="middle">
          <Button type="primary" className="" onClick={() => openModal(record)}>
            Chi tết
          </Button>
          <Button
            type="primary"
            color="green"
            variant="solid"
            onClick={() => openDoctorModal(record)}
          >
            Phân công
          </Button>
          {/* <Button
            type="primary"
            color="orange"
            variant="solid"
            onClick={() => openDoctorModal(record)}
          >
            Hủy phân công
          </Button> */}
        </Space>
      ),
    },
  ];

  return (
    <Staff1Layout>
      {bookings.length > 0 ? (
        <Table dataSource={bookings} columns={columns} rowKey="bookingId" />
      ) : (
        <p>Không có lịch tiêm chủng.</p>
      )}

      {/* Modal chi tiết */}
      <Modal
        visible={modalIsOpen}
        onCancel={closeModal}
        //className="modal-content"
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
          </div>
        )}
      </Modal>

      {/* Modal phân công bác sĩ */}
      <Modal
        visible={modalDoctorIsOpen}
        onCancel={closeDoctorModal}
        footer={null}
        width={1200}
        className="doctor-modal"
      >
        <div className="container">
          <Title level={2} className="title">
            Chọn bác sĩ muốn phân công
          </Title>
          <Row gutter={[16, 16]} className="doctor-grid">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <Col key={doctor.id} xs={24} sm={12} md={8} lg={6}>
                  <Card className="doctor-card">
                    <Avatar
                      size={120}
                      icon={<UserOutlined />}
                      src={doctor?.imageUrl || "/default-avatar.png"}
                      alt={doctor.fullName}
                      className="avatar"
                    />
                    <Title level={4} className="doctor-name">
                      {doctor.fullName}
                    </Title>
                    <Text type="secondary" className="username">
                      @{doctor.userName}
                    </Text>
                    <Text className="email">{doctor.email}</Text>
                    <Text className="phone">{doctor.phoneNumber}</Text>
                    <Text className="address">{doctor.address}</Text>
                    <div
                      className={`status ${
                        doctor.isActive ? "active" : "inactive"
                      }`}
                    >
                      {doctor.isActive ? "Đang hoạt động" : "Đang không hoạt động"}
                    </div>
                    <Button
                      type="primary"
                      block
                      className="detail-btn"
                      onClick={() => {
                        if (selectedBooking?.bookingId !== undefined) {
                          handleAssignDoctor(
                            doctor.id.toString(),
                            selectedBooking.bookingId.toString()
                          );
                        } else {
                          console.log("Booking ID là undefined");
                        }
                      }}
                    >
                      Phân công
                    </Button>
                  </Card>
                </Col>
              ))
            ) : (
              <Text className="no-doctor">Không có bác sĩ nào.</Text>
            )}
          </Row>
        </div>
      </Modal>
    </Staff1Layout>
  );
}

export default AssignPage;
