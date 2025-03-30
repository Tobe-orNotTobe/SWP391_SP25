import { useEffect, useState, useRef } from "react";
import {
  apiAssignDoctor,
  apiGetAllBookings,
  apiGetBookingById,
  apiGetUnassignedBooking,
  apiUnAssignDoctor,
} from "../../apis/apiBooking";
import { toast } from "react-toastify";
import { apiGetAllDoctors } from "../../apis/apiAdmin";
import { Doctor } from "../../interfaces/Doctor";
import "./DoctorList.scss";
import Staff1Layout from "../../components/Layout/StaffLayout/Stafff1Layout/Staff1Layout";
import {
  Table,
  Button,
  Space,
  Input,
  DatePicker,
  Radio,
  Typography,
  Card,
  Avatar,
  Tag,
  Modal,
  Row,
  Col,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import {
  apiGetComBoVaccineById,
  apiGetVaccineDetailById,
} from "../../apis/apiVaccine.ts";
import { apiGetVaccineRecordByBookingId } from "../../apis/apiVaccineRecord.ts";
import { VaccineRecordResponse } from "../../interfaces/VaccineRecord.ts";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { BookingDetail, BookingResult } from "../../interfaces/Booking.ts";
import { ColumnType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

function AssignPage() {
  const [bookings, setBookings] = useState<BookingResult[]>([]);
  const [unassignBookings, setUnassignBookings] = useState<BookingResult[]>(
    []
  );
  const [assignedBookings, setAssignedBookings] = useState<BookingResult[]>(
    []
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalDoctorIsOpen, setDoctorModalIsOpen] = useState(false);
  const [vaccineRecordDetails, setVaccineRecordDetails] =
    useState<VaccineRecordResponse>();
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResult | null>(null);
  const [comboDetails, setComboDetails] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterRange, setFilterRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [filterType, setFilterType] = useState<
    "today" | "thisWeek" | "thisMonth" | "thisYear" | "custom"
  >("today");

  const searchInput = useRef<any>(null);

  useEffect(() => {
    apiGetAllDoctors().then(({ result }) => setDoctors(result));
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

  useEffect(() => {
    const fetchUnassignedBookings = async () => {
      const data = await apiGetUnassignedBooking();
      if (data?.isSuccess) {
        setUnassignBookings(data.result);
        const assigned = bookings.filter(
          (booking) =>
            !data.result.some(
              (unassigned: BookingResult) =>
                unassigned.bookingId === booking.bookingId
            )
        );
        setAssignedBookings(assigned);
      } else {
        toast.error(data.errorMessage);
      }
    };
    fetchUnassignedBookings();
  }, [bookings]);

  const handleDateChange = (date: moment.Moment | null) => {
    if (!date) {
      console.log("No date selected");
      setFilterDate(null); 
      setFilterRange(null); 
      setFilterType("custom"); 
      return;
    }

    const momentDate = moment(date.toDate()); // Chuyển Day.js thành Date rồi sang Moment
    setFilterDate(momentDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
    setFilterRange(null);
    setFilterType("custom");
    console.log(
      "Converted moment date:",
      momentDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
    );
  };

  const handleRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
  ) => {
    if (dates && dates[0] && dates[1]) {
      setFilterRange([moment(dates[0].toDate()), moment(dates[1].toDate())]); // Chuyển Dayjs -> Moment
    } else {
      setFilterRange(null);
    }
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
      console.log(filteredBookings);
      console.log(filterDate);
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
  const filteredUnassignBookings = filteredBookings.filter((booking) =>
    unassignBookings.some(
      (unassign) => unassign.bookingId === booking.bookingId
    )
  );
  const filteredAssignedBookings = filteredBookings.filter((booking) =>
    assignedBookings.some((assign) => assign.bookingId === booking.bookingId)
    &&( booking.status === "Pending"|| booking.status === "Completed")
  );

  const handleAssignDoctor = async (doctorId: string, bookingId: string) => {
    try {
      const response = await apiAssignDoctor(doctorId, bookingId);
      toast.success(response.status);
      toast.success("Phân công thành công");

      const updatedBookings = await apiGetAllBookings();
      if (updatedBookings?.isSuccess) {
        setBookings(updatedBookings.result);
      }

      const updatedUnassignedBookings = await apiGetUnassignedBooking();
      if (updatedUnassignedBookings?.isSuccess) {
        setUnassignBookings(updatedUnassignedBookings.result);
        const assigned = updatedBookings.result.filter(
          (booking: BookingResult) =>
            !updatedUnassignedBookings.result.some(
              (unassigned: BookingResult) =>
                unassigned.bookingId === booking.bookingId
            )
        );
        setAssignedBookings(assigned);
      }

      setDoctorModalIsOpen(false);
    } catch (error) {
      console.error("Lỗi khi phân công bác sĩ:", error);
      toast.error("Phân công thất bại");
    }
  };

  const handleUnassignDoctor = async (bookingId: string) => {
    try {
      const response = await apiUnAssignDoctor(bookingId);
      toast.success(response.status);
      toast.success("Hủy phân công thành công");

      const updatedBookings = await apiGetAllBookings();
      if (updatedBookings?.isSuccess) {
        setBookings(updatedBookings.result);
      }

      const updatedUnassignedBookings = await apiGetUnassignedBooking();
      if (updatedUnassignedBookings?.isSuccess) {
        setUnassignBookings(updatedUnassignedBookings.result);
        const assigned = updatedBookings.result.filter(
          (booking: BookingResult) =>
            !updatedUnassignedBookings.result.some(
              (unassigned: BookingResult) =>
                unassigned.bookingId === booking.bookingId
            )
        );
        setAssignedBookings(assigned);
      }

      setDoctorModalIsOpen(false);
    } catch (error) {
      console.error("Lỗi khi hủy phân công bác sĩ:", error);
      toast.error("Hủy phân công thất bại");
    }
  };

  const openModal = async (booking: BookingResult) => {
    setComboDetails([]);
    setSelectedBooking(booking);
    setModalIsOpen(true);

    try {
      const bookingDetailsResponse = await apiGetBookingById(booking.bookingId);
      if (bookingDetailsResponse?.isSuccess) {
        const bookingDetails = bookingDetailsResponse.result.bookingDetails;
        const {comboDetails } =
          await getVaccineAndComboDetails(bookingDetails);
        setComboDetails(comboDetails);
      }

      if (booking.status === "Completed") {
        const vaccineRecordResponse = await apiGetVaccineRecordByBookingId(
          booking.bookingId
        );
        if (vaccineRecordResponse?.isSuccess) {
          setVaccineRecordDetails(vaccineRecordResponse);
        }
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
    setModalIsOpen(false);
  };

  const openDoctorModal = (booking: BookingResult) => {
    setSelectedBooking(booking);
    setDoctorModalIsOpen(true);
  };

  const closeDoctorModal = () => {
    setSelectedBooking(null);
    setDoctorModalIsOpen(false);
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

  // const getColumnSearchProps = (dataIndex: string) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //   }: FilterDropdownProps) => (
  //     <div style={{ padding: 8 }}>
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) =>
  //           setSelectedKeys(e.target.value ? [e.target.value] : [])
  //         }
  //         onPressEnter={() =>
  //           handleSearch(selectedKeys as string[], confirm, dataIndex)
  //         }
  //         style={{ marginBottom: 8, display: "block" }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() =>
  //             handleSearch(selectedKeys as string[], confirm, dataIndex)
  //           }
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Tìm Kiếm
  //         </Button>
  //         <Button
  //           onClick={() => clearFilters && handleReset(clearFilters)}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Reset
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered: boolean) => (
  //     <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  //   ),
  //   onFilter: (value: any, record: any) =>
  //     record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  //   render: (text: string) =>
  //     searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ""}
  //       />
  //     ) : (
  //       text
  //     ),
  // });
  const getColumnSearchProps = (dataIndex: keyof BookingResult) => ({
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
    onFilter: (value: React.Key | boolean, record: BookingResult) => {
      const recordValue = record[dataIndex];
      return recordValue
        ? recordValue
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
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
  const columns: ColumnType<BookingResult>[] = [
    {
      title: "Mã đơn",
      dataIndex: "bookingId",
      key: "bookingId",
      ...getColumnSearchProps("bookingId"),
      sorter: (a: BookingResult, b: BookingResult) =>
        Number(a.bookingId) - Number(b.bookingId),
    },
    {
      title: "Tên Trẻ",
      dataIndex: "childName",
      key: "childName",
      ...getColumnSearchProps("childName"),
      sorter: (a: BookingResult, b: BookingResult) =>
        a.childName.localeCompare(b.childName),
    },
    {
      title: "Ngày Đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"), // Chuyển từ moment -> dayjs
      sorter: (a: BookingResult, b: BookingResult) =>
        dayjs(a.bookingDate).valueOf() - dayjs(b.bookingDate).valueOf(),

      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            format="DD/MM/YYYY"
            value={
              selectedKeys.length === 2
                ? [
                    dayjs(selectedKeys[0] as string),
                    dayjs(selectedKeys[1] as string),
                  ]
                : null
            }
            onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
              if (dates && dates[0] && dates[1]) {
                setSelectedKeys([
                  dates[0].toISOString(),
                  dates[1].toISOString(),
                ]);
              } else {
                setSelectedKeys([]);
              }
              confirm({ closeDropdown: false });
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
            >
              Lọc
            </Button>
            <Button
              onClick={() => {
                clearFilters?.();
                setSelectedKeys([]);
                confirm();
              }}
              size="small"
            >
              Đặt lại
            </Button>
          </Space>
        </div>
      ),

      onFilter: (value: any, record: BookingResult) => {
        if (!value || value.length !== 2) return true;

        const [startDate, endDate] = value as [string, string];
        const bookingDate = dayjs(record.bookingDate).toISOString();

        return (
          bookingDate >= dayjs(startDate).toISOString() &&
          bookingDate <= dayjs(endDate).toISOString()
        );
      },
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
      onFilter: (value: any, record: BookingResult) =>
        record.bookingType.includes(value),
    },
    {
      title: "Giá Tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
      sorter: (a: BookingResult, b: BookingResult) =>
        Number(a.totalPrice) - Number(b.totalPrice),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Đang chờ", value: "Pending" },
        { text: "Đã xác nhận", value: "Confirmed" },
        { text: "Đang thực hiện", value: "InProgress" },
        { text: "Hoàn thành", value: "Completed" },
        { text: "Đã hủy", value: "Cancelled" },
        { text: "Yêu cầu hoàn tiền", value: "RequestRefund" },
      ],
      onFilter: (value: any, record: BookingResult) =>
        record.status === value,
      render: (status: string) => {
        const statusLabels: { [key: string]: string } = {
          Pending: "Đang chờ",
          Confirmed: "Đã xác nhận",
          InProgress: "Đang thực hiện",
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
      render: (_: undefined, record: BookingResult) => {
        const isAssigned = !unassignBookings.some(
          (unassignBooking) => unassignBooking.bookingId === record.bookingId
        );
        const hiddenButtonStatuses = [
          "Completed",
          "Cancelled",
          "RequestRefund",
        ];
        const shouldHideButtons = hiddenButtonStatuses.includes(record.status);

        return (
          <Space size="middle">
            <Button type="primary" onClick={() => openModal(record)}>
              Chi tiết
            </Button>
            {!shouldHideButtons && !isAssigned && (
              <Button
                type="primary"
                color="green"
                variant="solid"
                onClick={() => openDoctorModal(record)}
              >
                Phân công
              </Button>
            )}
            {!shouldHideButtons && isAssigned && (
              <Button
                type="primary"
                color="orange"
                variant="solid"
                onClick={() =>
                  handleUnassignDoctor(record.bookingId.toString())
                }
              >
                Hủy phân công
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Staff1Layout>
      <h1>Phân công bác sĩ</h1>
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
              format="DD/MM/YYYY"
              onChange={handleDateChange}
              style={{ marginRight: 8 }}
              placeholder="Chọn ngày"
            />
            <RangePicker
              format="DD/MM/YYYY"
              onChange={handleRangeChange}
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </div>
        )}
      </div>

      <div>
        <Title level={3}>Chưa phân công</Title>
        <Table
          dataSource={filteredUnassignBookings}
          columns={columns}
          rowKey="bookingId"
          locale={{
            emptyText: "Không có dữ liệu",
          }}
        />
      </div>

      <div style={{ marginTop: "40px" }}>
        <Title level={3}>Đã phân công</Title>
        <Table
          dataSource={filteredAssignedBookings}
          columns={columns}
          rowKey="bookingId"
          locale={{
            emptyText: "Không có dữ liệu",
          }}
        />
      </div>

      {/* Modal phân công bác sĩ */}
      <Modal
        open={modalDoctorIsOpen}
        onCancel={closeDoctorModal}
        footer={null}
        width={1200}
        className="doctor-modal"
      >
        <div className="doctorList-wraper">
          <Title level={2} className="title">
            Chọn bác sĩ muốn phân công
          </Title>
          <Row gutter={[16, 16]} className="doctor-grid">
            {doctors.map((doctor) => (
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
                  <Text type="secondary">@{doctor.userName}</Text>
                  <Text type="secondary">{doctor.email}</Text>
                  <Text type="secondary">{doctor.phoneNumber}</Text>
                  <Text type="secondary">{doctor.address}</Text>
                  <Tag color={doctor.isActive ? "green" : "red"}>
                    {doctor.isActive
                      ? "Đang hoạt động"
                      : "Đang không hoạt động"}
                  </Tag>
                  <Button
                    type="primary"
                    block
                    className="detail-btn"
                    onClick={() =>
                      handleAssignDoctor(
                        doctor.id.toString(),
                        selectedBooking!.bookingId.toString()
                      )
                    }
                  >
                    Phân công
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>

      {/* Modal chi tiết */}
      <Modal
        open={modalIsOpen}
        onCancel={closeModal}
        footer={null}
        width={900}
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
                    <strong>ID:</strong> {selectedBooking.bookingId}
                  </p>
                  <p>
                    <strong>Tên Trẻ:</strong> {selectedBooking.childName}
                  </p>
                  <p>
                    <strong>Ngày Đặt:</strong>{" "}
                    {moment(selectedBooking.bookingDate).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    <strong>Loại Tiêm:</strong> {selectedBooking.bookingType}
                  </p>
                  <p>
                    <strong>Ghi Chú:</strong> {selectedBooking.notes}
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

                {selectedBooking.bookingDetails.length > 0 && comboDetails.length === 0 && (
                  <div className="combo-section">
                    <h3>Chi Tiết Vaccine</h3>
                    {selectedBooking.bookingDetails.map((vaccine) => (
                      <div key={vaccine.vaccineId} className="vaccine-item">
                        <p>
                          <strong>Tên Vaccine:</strong> {vaccine.vaccineName}
                        </p>
                        <p>
                          <strong>Ngày tiêm:</strong> {moment(vaccine.injectionDate).format("DD/MM/YYYY")}
                        </p>
                        <p>
                          <strong>Giá:</strong>{" "}
                          {vaccine.price?.toLocaleString()} VNĐ
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedBooking.status === "Completed" &&
                vaccineRecordDetails && (
                  <div className="vaccine-record-section">
                    <h3>Chi Tiết Vaccine Record</h3>
                    <table className="vaccine-record-table">
                      <thead>
                        <tr>
                          <th>Tên Vaccine</th>
                          <th>Liều lượng</th>
                          <th>Giá</th>
                          <th>Ngày nhắc lại</th>
                          <th>Số lô</th>
                          <th>Trạng thái</th>
                          <th>Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vaccineRecordDetails.result.vaccineRecords.map(
                          (record) => (
                            <tr key={record.vaccinationRecordId}>
                              <td>{record.vaccineName}</td>
                              <td>{record.doseAmount} ml</td>
                              <td>{record.price.toLocaleString()} VNĐ</td>
                              <td>
                                {record.nextDoseDate
                                  ? record.nextDoseDate.split("T")[0]
                                  : ""}
                              </td>
                              <td>{record.batchNumber}</td>
                              <td>{record.status}</td>
                              <td>{record.notes}</td>
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
    </Staff1Layout>
  );
}

export default AssignPage;
