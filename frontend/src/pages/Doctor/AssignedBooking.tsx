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

  const navigate = useNavigate();

  const fetchBookings = async () => {
    if (doctorId) {
      const data = await apiGetDoctorBookings(doctorId);
      if (data?.isSuccess) {
        console.log(data.result);
        setBookings(data.result);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [doctorId]);

  // Chia bookings thành hai mảng: chưa hoàn thành và đã hoàn thành
  const pendingBookings = bookings.filter(
    (booking) => booking.status !== "Completed"
  );
  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  );

  const openModal = async (booking: BookingResponse) => {
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
        const vaccine = await apiGetVaccineDetailById(detail.vaccineId);
        if (vaccine && vaccine.result) {
          vaccineDetails.push(vaccine.result);
        }
      } else if (
        detail.comboVaccineId !== null &&
        detail.comboVaccineId !== undefined
      ) {
        const comboVaccine = await apiGetComBoVaccineById(
          detail.comboVaccineId
        );
        if (comboVaccine && comboVaccine.result) {
          comboDetails.push(comboVaccine.result);
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

      let existingRecord;
      try {
        existingRecord = await apiGetVaccineRecordByBookingId(
          booking.bookingId
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
        { text: "Chờ xác nhận", value: "Pending" },
        { text: "Đã xác nhận", value: "Confirmed" },
        { text: "Chờ tiêm", value: "InProgress" },
        { text: "Hoàn thành", value: "Completed" },
        { text: "Đã hủy", value: "Cancelled" },
        { text: "Yêu cầu hoàn tiền", value: "RequestRefund" },
      ],
      onFilter: (value: any, record: BookingResponse) =>
        record.status === value,
      render: (status: string) => {
        const statusLabels: { [key: string]: string } = {
          Pending: "Chờ xác nhận",
          Confirmed: "Đã xác nhận",
          InProgress: "Chờ tiêm",
          Completed: "Hoàn thành",
          Cancelled: "Đã hủy",
          RequestRefund: "Yêu cầu hoàn tiền",
        };
        const statusColors: { [key: string]: string } = {
          Pending: "orange",
          Confirmed: "darkblue",
          InProgress: "blue",
          Completed: "green",
          Cancelled: "red",
          RequestRefund: "darkorange",
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
          {record.status === "InProgress" && (
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

  // Cột cho bảng đã hoàn thành (không có nút "Tiến hành tiêm")
  const completedColumns = columns.filter((col) => col.key !== "action").concat({
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
          rowKey="bookingId"
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
          rowKey="bookingId"
        />
      ) : (
        <p>Không có lịch tiêm chủng đã hoàn thành.</p>
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
                        : selectedBooking.status === "Confirmed"
                        ? "darkblue"
                        : selectedBooking.status === "InProgress"
                        ? "blue"
                        : selectedBooking.status === "Completed"
                        ? "green"
                        : selectedBooking.status === "Cancelled"
                        ? "red"
                        : "darkorange"
                    }
                  >
                    {selectedBooking.status === "Pending"
                      ? "Chờ xác nhận"
                      : selectedBooking.status === "Confirmed"
                      ? "Đã xác nhận"
                      : selectedBooking.status === "InProgress"
                      ? "Chờ tiêm"
                      : selectedBooking.status === "Completed"
                      ? "Hoàn thành"
                      : selectedBooking.status === "Cancelled"
                      ? "Đã hủy"
                      : "Yêu cầu hoàn tiền"}
                  </Tag>
                </p>
              </div>

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