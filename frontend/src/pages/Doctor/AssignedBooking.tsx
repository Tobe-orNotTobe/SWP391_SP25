import React, { useEffect, useRef, useState } from "react";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully.ts";
import { apiGetDoctorBookings } from "../../apis/apiBooking.ts";
import "./VaccinationSchedulePage.scss";
import { BookingResponse } from "../../interfaces/VaccineRegistration.ts";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "../../components/Layout/StaffLayout/DoctorLayout/DoctorLayout.tsx";
import {
  Table,
  Button,
  Space,
  Input,
  InputRef,
  Tag,
  DatePicker,
  Radio,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Modal } from "antd";
import {
  apiCreateVaccineRecord,
  apiGetVaccineRecordByBookingDetailId,
} from "../../apis/apiVaccineRecord.ts";
import { toast } from "react-toastify";
import {
  VaccineRecord,
  VaccineRecordResponse,
} from "../../interfaces/VaccineRecord.ts";
import moment from "moment";
import { BookingDetailResponse } from "../../interfaces/Booking.ts";

const { RangePicker } = DatePicker;

const VaccinationSchedulePage: React.FC = () => {
  const { sub: doctorId } = IsLoginSuccessFully();
  const [bookings, setBookings] = useState<BookingDetailResponse[]>([]);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingDetailResponse | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [vaccineDetails, setVaccineDetails] = useState<VaccineRecord[]>([]);
  const [vaccineRecordDetails, setVaccineRecordDetails] =
    useState<VaccineRecordResponse | null>(null);
  const [filterDate, setFilterDate] = useState<moment.Moment | null>(null);
  const [filterRange, setFilterRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [filterType, setFilterType] = useState<
    "today" | "thisWeek" | "thisMonth" | "thisYear" | "custom"
  >("today");

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

  const handleDateChange = (date: moment.Moment | null) => {
    setFilterDate(date);
    setFilterRange(null);
    setFilterType("custom");
  };

  const handleRangeChange = (dates: [moment.Moment, moment.Moment] | null) => {
    setFilterRange(dates);
    setFilterDate(null);
    setFilterType("custom");
  };

  const handleFilterTypeChange = (e: any) => {
    setFilterType(e.target.value);
    setFilterDate(null);
    setFilterRange(null);
  };

  const getFilteredBookings = () => {
    let filteredBookings = bookings;

    if (filterType === "today") {
      filteredBookings = filteredBookings.filter((booking) =>
        moment(booking.bookingDate).isSame(moment(), "day")
      );
    } else if (filterType === "thisWeek") {
      filteredBookings = filteredBookings.filter((booking) =>
        moment(booking.bookingDate).isSame(moment(), "week")
      );
    } else if (filterType === "thisMonth") {
      filteredBookings = filteredBookings.filter((booking) =>
        moment(booking.bookingDate).isSame(moment(), "month")
      );
    } else if (filterType === "thisYear") {
      filteredBookings = filteredBookings.filter((booking) =>
        moment(booking.bookingDate).isSame(moment(), "year")
      );
    } else if (filterDate) {
      filteredBookings = filteredBookings.filter((booking) =>
        moment(booking.bookingDate).isSame(filterDate, "day")
      );
    } else if (filterRange) {
      filteredBookings = filteredBookings.filter((booking) =>
        moment(booking.bookingDate).isBetween(
          filterRange[0],
          filterRange[1],
          "day",
          "[]"
        )
      );
    }

    return filteredBookings;
  };

  const filteredBookings = getFilteredBookings();
  const pendingBookings = filteredBookings.filter(
    (booking) => booking.status === "Chưa hoàn thành"
  );
  const completedBookings = filteredBookings.filter(
    (booking) => booking.status !== "Chưa hoàn thành"
  );

  const openModal = async (booking: BookingDetailResponse) => {
    setVaccineDetails([]);
    setSelectedBooking(booking);
    setModalIsOpen(true);

    try {
      let existingRecord;
      try {
        existingRecord = await apiGetVaccineRecordByBookingDetailId(
          booking.bookingDetailId
        );
      } catch (error: any) {
        if (error.response?.status === 400) {
          const createResponse = await apiCreateVaccineRecord(
            booking.bookingDetailId
          );
          if (createResponse && createResponse?.isSuccess) {
            existingRecord = await apiGetVaccineRecordByBookingDetailId(
              booking.bookingDetailId
            );
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

  const handleProceedVaccination = async (booking: BookingDetailResponse) => {
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
      sorter: (a: BookingDetailResponse, b: BookingDetailResponse) =>
        Number(a.bookingDetailId) - Number(b.bookingDetailId),
    },
    {
      title: "Ngày Đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: BookingDetailResponse, b: BookingDetailResponse) =>
        new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime(),
    },
    {
      title: "Giá Tiền",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
      sorter: (a: BookingDetailResponse, b: BookingDetailResponse) =>
        Number(a.price) - Number(b.price),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Chờ tiêm", value: "Chưa hoàn thành" },
        { text: "Đã tiêm", value: "Hoàn thành" },
      ],
      onFilter: (value: any, record: BookingDetailResponse) =>
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
      render: (_: undefined, record: BookingDetailResponse) => (
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
      render: (_: undefined, record: BookingDetailResponse) => (
        <Space size="middle">
          <Button type="primary" onClick={() => openModal(record)}>
            Chi tiết
          </Button>
        </Space>
      ),
    });

  return (
    <DoctorLayout>
      <h1>Lịch tiêm chủng</h1>

      <div style={{ marginBottom: 16 }}>
        <Radio.Group onChange={handleFilterTypeChange} value={filterType}>
          <Radio.Button value="today">Hôm nay</Radio.Button>
          <Radio.Button value="thisWeek">Tuần này</Radio.Button>
          <Radio.Button value="thisMonth">Tháng này</Radio.Button>
          <Radio.Button value="thisYear">Năm này</Radio.Button>
          <Radio.Button value="custom">Tùy chọn</Radio.Button>
        </Radio.Group>

        {filterType === "custom" && (
          <div style={{ marginTop: 16 }}>
            <DatePicker
              value={filterDate}
              onChange={handleDateChange}
              style={{ marginRight: 8 }}
            />
            <RangePicker value={filterRange} onChange={handleRangeChange} />
          </div>
        )}
      </div>

      <h2>Các Đơn Chưa Hoàn Thành</h2>
      <Table
        dataSource={pendingBookings}
        columns={columns}
        rowKey="bookingDetailId"
        style={{ marginBottom: 20 }}
        locale={{
          emptyText: "Không có dữ liệu",
        }}
      />

      <h2>Các Đơn Đã Hoàn Thành</h2>
      <Table
        dataSource={completedBookings}
        columns={completedColumns}
        rowKey="bookingDetailId"
        locale={{
          emptyText: "Không có dữ liệu",
        }}
      />

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
                <div>
                  <p>
                    <strong>Mã đơn:</strong>{" "}
                    {vaccineRecordDetails?.result.bookingId}
                  </p>
                  <p>
                    <strong>Tên trẻ:</strong>{" "}
                    {vaccineRecordDetails?.result.fullName}
                  </p>
                  <p>
                    <strong>Ngày sinh:</strong>{" "}
                    {vaccineRecordDetails?.result.dateOfBirth
                      ? vaccineRecordDetails.result.dateOfBirth
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("/")
                      : "N/A"}
                  </p>
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
                        : "Đã tiêm"}
                    </Tag>
                  </p>
                </div>
                {vaccineRecordDetails?.result?.vaccineRecords &&
                  vaccineRecordDetails?.result.vaccineRecords.length > 0 && (
                    <div className="combo-section">
                      <h3>Chi Tiết Vaccine</h3>
                      {vaccineRecordDetails?.result.vaccineRecords.map(
                        (vaccine) => (
                          <div
                            key={vaccine.vaccinationRecordId}
                            className="vaccine-item"
                          >
                            <p>
                              <strong>Tên Vaccine:</strong>{" "}
                              {vaccine.vaccineName}
                            </p>
                            <p>
                              <strong>Giá:</strong>{" "}
                              {vaccine.price?.toLocaleString()} VNĐ
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>

              {selectedBooking.status !== "Chưa hoàn thành" &&
                vaccineRecordDetails?.result?.vaccineRecords &&
                vaccineRecordDetails?.result?.vaccineRecords?.length > 0 && (
                  <div className="vaccine-record-section">
                    <h3>Thông Tin Tiêm Chủng</h3>
                    <table className="vaccine-record-table">
                      <thead>
                        <tr>
                          <th>Tên Vaccine</th>
                          <th>Liều lượng</th>
                          <th>Ngày nhắc lại</th>
                          <th>Số lô</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vaccineRecordDetails &&
                          vaccineRecordDetails.result.vaccineRecords.map(
                            (record) => (
                              <tr key={record.vaccinationRecordId}>
                                <td>{record.vaccineName}</td>
                                <td>{record.doseAmount} ml</td>
                                <td>
                                  {record.nextDoseDate
                                    ? new Date(
                                        record.nextDoseDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </td>

                                <td>{record.batchNumber}</td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
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
