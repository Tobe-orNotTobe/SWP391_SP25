import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notification, Spin, Modal } from "antd";
import {
  Parent,
  Child,
  Vaccine,
  VaccinePackage,
} from "../../interfaces/VaccineRegistration.ts";
import { apiBooking, apiCheckParentVaccine } from "../../apis/apiBooking";
import { apiPostVNPayTransaction } from "../../apis/apiTransaction";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully";
import { apiGetMyChilds } from "../../apis/apiChild.ts";
import {
  useVaccineDetail,
  useComboVaccineDetail,
} from "../../hooks/useVaccine";
import Staff1Layout from "../../components/Layout/StaffLayout/Stafff1Layout/Staff1Layout.tsx";
import { toast } from "react-toastify";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { apiGetVaccinationScheduleByChildrenId } from "../../apis/apiVaccine.ts";
import { apiFindUser } from "../../apis/apiAccount.ts";
import { Booking, BookingDetail } from "../../interfaces/Booking.ts";

interface SelectedVaccine {
  id: string;
  name: string;
  date: string | null;
  price?: number;
  type: "single" | "combo";
}

// interface ParentVaccineCheck {
//   vaccineId: string;
//   messages: string[];
//   checked: boolean;
// }

const BookingForStaff = () => {
  const navigate = useNavigate();
  const { username, sub } = IsLoginSuccessFully();

  // State for vaccination form
  const [isFormSplit, setIsFormSplit] = useState(false);
  const [parentInfo, setParentInfo] = useState<Parent>({
    customerCode: sub,
    parentName: username || "Không rõ",
    children: [],
  });
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");

  // State for vaccine selection
  const [vaccineType, setVaccineType] = useState<"Gói" | "Lẻ">("Gói");
  const [selectedVaccines, setSelectedVaccines] = useState<SelectedVaccine[]>(
    []
  );
  const [notes, setNotes] = useState<string>("");
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  // const [parentVaccineChecks, setParentVaccineChecks] = useState<
  //   ParentVaccineCheck[]
  // >([]);
  const [parentVaccineMessages, setParentVaccineMessages] = useState<string[]>(
    []
  );

  // Suggested vaccines
  const [suggestedVaccines, setSuggestedVaccines] = useState<string[]>([]);
  const [suggestedCombos, setSuggestedCombos] = useState<string[]>([]);

  // Fetch vaccine data
  const { vaccineDetail: singleVaccines, loading: vaccineLoading } =
    useVaccineDetail();
  const { comboVaccineDetail: vaccinePackages, loading: comboLoading } =
    useComboVaccineDetail();

  const searchParentAndChildrenInfo = async (searchInput: string) => {
    if (!searchInput) {
      toast.warn("Vui lòng nhập số điện thoại hoặc email.");
      return;
    }

    setFormLoading(true);

    try {
      const userSearchResult = await apiFindUser(searchInput);

      if (userSearchResult && userSearchResult.id) {
        const data = await apiGetMyChilds(userSearchResult.id);

        if (data.isSuccess && data.result) {
          const children = data.result.map((child: any) => ({
            childId: child.childId,
            fullName: child.fullName,
            dateOfBirth: child.dateOfBirth?.split("T")[0] || "",
            gender: child.gender === "Female" ? "Nữ" : "Nam",
            imageUrl: child.imageUrl,
          }));

          setParentInfo({
            customerCode: userSearchResult.id,
            parentName: userSearchResult.fullName,
            children: children as Child[],
          });
        } else {
          toast.warn("Không có dữ liệu trẻ.");
        }
      } else {
        toast.warn(
          "Không tìm thấy người dùng với số điện thoại hoặc email này."
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phụ huynh:", error);
      toast.error("Đã xảy ra lỗi khi tìm kiếm thông tin phụ huynh");
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChild) {
      const fetchVaccinationSchedule = async () => {
        try {
          const response = await apiGetVaccinationScheduleByChildrenId(
            selectedChild.childId
          );

          if (response.statusCode === "OK" && response.isSuccess) {
            const vaccineIds = response.result.vaccines.map(
              (vaccine: Vaccine) => vaccine.vaccineId
            );
            const comboIds = response.result.comboVaccines.map(
              (combo: VaccinePackage) => combo.comboId
            );
            setSuggestedVaccines(vaccineIds);
            setSuggestedCombos(comboIds);
          }
        } catch (error) {
          console.error("Error fetching vaccination schedule:", error);
        }
      };

      fetchVaccinationSchedule();
    }
  }, [selectedChild]);

const isChecking = useRef(false);
  const checkParentVaccineForSelection = async (vaccineId: string) => {
    if (isChecking.current) return; // Ngăn chặn gọi lại
    isChecking.current = true;
    
    try {
      const response = await apiCheckParentVaccine([Number(vaccineId)]);
      if (response.result && response.result.length > 0) {
        // setParentVaccineChecks(prev => [
        //   ...prev,
        //   { vaccineId, messages: response.result, checked: false }
        // ]);
        showConfirmationModal(response.result, vaccineId);
        console.log("Checking");
        }
    } catch (error) {
        console.error("Error checking parent vaccine:", error);
        toast.error("Không thể kiểm tra vaccine yêu cầu trước đó.");
    } finally {
        isChecking.current = false; // Reset flag sau khi hoàn tất
    }
};

  const showConfirmationModal = (messages: string[], vaccineId: string) => {
    Modal.confirm({
      title: "Xác nhận tiêm chủng trước đó",
      content: (
        <div>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      ),
      okText: "Đã tiêm",
      cancelText: "Chưa tiêm",
      onOk: () => {
        // setParentVaccineChecks((prev) =>
        //   prev.map((check) =>
        //     check.vaccineId === vaccineId ? { ...check, checked: true } : check
        //   )
        // );
      },
      onCancel: () => {
        setSelectedVaccines((prev) =>
          prev.filter((item) => item.id !== vaccineId)
        );
        // setParentVaccineChecks((prev) =>
        //   prev.filter((check) => check.vaccineId !== vaccineId)
        // );
        toast.warning("Vui lòng tiêm vaccine yêu cầu trước khi tiếp tục.");
      },
    });
  };

  const handleSelectChild = (child: Child | null) => {
    setSelectedChild(child);
    setIsFormSplit(!!child);
    setSelectedVaccines([]);
    setParentVaccineMessages([]);
  };

  const handleAddNewChild = () => {
    navigate("/child-register");
  };

  const submitBooking = async (
    bookingDetails: BookingDetail[],
    notes: string
  ) => {
    if (!selectedChild || !parentInfo?.customerCode) return;

    setFormLoading(true);
    try {
      const bookingData: Booking = {
        childId: selectedChild.childId,
        notes: notes,
        bookingDetails: bookingDetails,
      };

      const status = await apiBooking(parentInfo.customerCode, bookingData);

      const paymentResponse = await apiPostVNPayTransaction(
        status.result?.bookingId
      );

      if (paymentResponse.isSuccess) {
        window.location.href = paymentResponse.result?.paymentUrl;
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không lấy được đường dẫn thanh toán.",
        });
      }
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      notification.error({
        message: "Lỗi",
        description: error.toString(),
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleVaccineTypeChange = (type: "Gói" | "Lẻ") => {
    setVaccineType(type);
    setSelectedVaccines([]);
    setParentVaccineMessages([]);
  };

  const handleSelectVaccine = (
    vaccineId: string,
    vaccineName: string,
    type: "single" | "combo",
    price?: number
  ) => {
    setSelectedVaccines((prevSelected) => {
      const isAlreadySelected = prevSelected.some(item => item.id === vaccineId);
      let newSelection: SelectedVaccine[];

      if (isAlreadySelected) {
        // Remove vaccine and update parent checks
        // setParentVaccineChecks(prev => prev.filter(check => check.vaccineId !== vaccineId));
        newSelection = prevSelected.filter(item => item.id !== vaccineId);
      } else {
        // Add new vaccine
        newSelection = [
          ...prevSelected,
          { id: vaccineId, name: vaccineName, date: null, type, price },
        ];
        if (type === "single") {
          checkParentVaccineForSelection(vaccineId);
        }
      }

      // Immediately update bookingDetails based on the new selection
      const newBookingDetails = newSelection.map((item) => ({
        vaccineId: item.type === "single" ? Number(item.id) : null,
        comboVaccineId: item.type === "combo" ? Number(item.id) : null,
        injectionDate: item.date || new Date().toISOString(),
      }));
      setBookingDetails(newBookingDetails as any); // Update bookingDetails synchronously

      return newSelection;
    });
  };

  // Handle date change for a specific vaccine
  const handleVaccineDateChange = (vaccineId: string, date: string) => {
    setSelectedVaccines((prevSelected) =>
      prevSelected.map((item) =>
        item.id === vaccineId ? { ...item, date } : item
      )
    );
  };

  const handleRemoveVaccine = (vaccineId: string) => {
    setSelectedVaccines((prev) => prev.filter((item) => item.id !== vaccineId));
    // setParentVaccineChecks((prev) =>
    //   prev.filter((check) => check.vaccineId !== vaccineId)
    // );
  };

  const validateDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      toast.error("Ngày không hợp lệ.");
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      toast.error("Không thể chọn ngày trong quá khứ.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const newBookingDetails = selectedVaccines.map((item) => ({
      vaccineId: item.type === "single" ? Number(item.id) : null,
      comboVaccineId: item.type === "combo" ? Number(item.id) : null,
      injectionDate: item.date || new Date().toISOString(),
    }));
    setBookingDetails(newBookingDetails as any);
  }, [selectedVaccines]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedChild) {
      notification.warning({
        message: "Cảnh báo",
        description: "Vui lòng chọn trẻ để đặt lịch.",
      });
      return;
    }

    if (bookingDetails.length === 0) {
      notification.warning({
        message: "Cảnh báo",
        description: "Vui lòng chọn ít nhất một vaccine.",
      });
      return;
    }

    const hasMissingDates = selectedVaccines.some((item) => !item.date);
    if (hasMissingDates) {
      toast.warning("Vui lòng chọn ngày tiêm cho tất cả các vaccine đã chọn.");
      return;
    }

    if (parentVaccineMessages.length > 0) {
      toast.warning("Vui lòng xác nhận tình trạng tiêm chủng trước đó.");
      return;
    }

    await submitBooking(bookingDetails, notes);
  };

  const isVaccineSelected = (id: string) => {
    return selectedVaccines.some((item) => item.id === id);
  };

  return (
    <Staff1Layout>
      <Spin spinning={formLoading || vaccineLoading || comboLoading}>
        <div className="vaccination-container">
          <form
            onSubmit={handleSubmit}
            className={`vaccination-form ${
              isFormSplit ? "vaccination-form-splited" : ""
            }`}
          >
            <h1>Đăng ký tiêm chủng</h1>
            <div className="split-form">
              <div className="splited-part">
                <div className="form-section">
                  <div className="form-group">
                    <label>Nhập email hoặc số điện thoại của phụ huynh*</label>
                    <div className="search-container">
                      <input
                        type="text"
                        placeholder="Email hoặc số điện thoại khách hàng"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            searchParentAndChildrenInfo(searchInput);
                          }
                        }}
                      />
                      <button
                        className="rounded-button"
                        type="button"
                        onClick={() => searchParentAndChildrenInfo(searchInput)}
                      >
                        Tìm kiếm
                      </button>
                    </div>
                  </div>

                  {parentInfo && (
                    <div className="parent-info">
                      <h3>Thông tin phụ huynh</h3>
                      <p>
                        <strong>Mã khách hàng:</strong>{" "}
                        {parentInfo.customerCode}
                      </p>
                      <p>
                        <strong>Tên phụ huynh:</strong> {parentInfo.parentName}
                      </p>
                    </div>
                  )}

                  {parentInfo && parentInfo.children.length > 0 ? (
                    <div className="registered-children">
                      <h3>Danh sách trẻ</h3>
                      <ul>
                        {parentInfo.children.map((child) => (
                          <li
                            key={child.childId}
                            className={`child-card ${
                              selectedChild?.childId === child.childId
                                ? "selected"
                                : ""
                            }`}
                          >
                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  selectedChild?.childId === child.childId
                                }
                                onChange={() => {
                                  if (
                                    selectedChild?.childId === child.childId
                                  ) {
                                    handleSelectChild(null);
                                  } else {
                                    handleSelectChild(child);
                                  }
                                }}
                              />
                              <div className="child-info">
                                <div>
                                  <Avatar
                                    size={64}
                                    src={
                                      child.imageUrl
                                        ? child.imageUrl
                                        : undefined
                                    }
                                    icon={
                                      !child.imageUrl ? <UserOutlined /> : null
                                    }
                                  />
                                </div>
                                <div>
                                  <p>
                                    <strong>Tên:</strong> {child.fullName}
                                  </p>
                                  <p>
                                    <strong>Ngày sinh:</strong>{" "}
                                    {child.dateOfBirth
                                      ? new Date(
                                          child.dateOfBirth
                                        ).toLocaleDateString("vi-VN")
                                      : "Không xác định"}
                                  </p>
                                </div>
                              </div>
                            </label>
                          </li>
                        ))}
                      </ul>
                      <button
                        className="rounded-button"
                        type="button"
                        onClick={handleAddNewChild}
                      >
                        Đăng ký thêm trẻ
                      </button>
                    </div>
                  ) : (
                    <div className="no-children-found">
                      <p>Không có trẻ nào được đăng ký.</p>
                      <button
                        className="rounded-button"
                        type="button"
                        onClick={handleAddNewChild}
                      >
                        Đăng ký thêm trẻ
                      </button>
                    </div>
                  )}

                  {selectedChild && selectedVaccines.length > 0 && (
                    <div className="selected-vaccines-section">
                      <h3>Vaccine đã chọn</h3>
                      <div className="selected-vaccines-list">
                        {selectedVaccines.map((vaccine) => (
                          <div
                            key={vaccine.id}
                            className="selected-vaccine-item"
                          >
                            <div className="vaccine-info">
                              <h4>{vaccine.name}</h4>
                              {vaccine.price && (
                                <p className="price">
                                  Giá: {vaccine.price.toLocaleString("vi-VN")}{" "}
                                  vnđ
                                </p>
                              )}
                            </div>
                            <div className="vaccine-date-picker">
                              <label>Ngày tiêm *</label>
                              <input
                                type="date"
                                required
                                value={vaccine.date?.split("T")[0] || ""}
                                onChange={(e) => {
                                  const date = new Date(e.target.value);
                                  if (validateDate(date)) {
                                    handleVaccineDateChange(
                                      vaccine.id,
                                      date.toISOString()
                                    );
                                  }
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              className="remove-vaccine-btn"
                              onClick={() => handleRemoveVaccine(vaccine.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="splited-part">
                {selectedChild && (
                  <div className="form-section">
                    <h3>Thông tin dịch vụ</h3>

                    <div className="form-group">
                      <label>Ghi chú cho toàn bộ đăng ký</label>
                      <textarea
                        name="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Nhập ghi chú nếu có..."
                      />
                    </div>

                    <div className="form-group">
                      <label>* Loại vắc xin muốn đăng ký</label>
                      <div className="vaccine-selection">
                        <button
                          type="button"
                          className={vaccineType === "Gói" ? "active" : ""}
                          onClick={() => handleVaccineTypeChange("Gói")}
                        >
                          Vắc xin gói
                        </button>
                        <button
                          type="button"
                          className={vaccineType === "Lẻ" ? "active" : ""}
                          onClick={() => handleVaccineTypeChange("Lẻ")}
                        >
                          Vắc xin lẻ
                        </button>
                      </div>
                    </div>

                    <div className="vaccine-list">
                      <label>* Chọn vắc xin</label>
                      {vaccineType === "Gói" ? (
                        <div className="vaccine-grid">
                          {vaccinePackages.map((vaccinePackage) => (
                            <div
                              key={vaccinePackage.comboId}
                              className={`vaccine-card ${
                                isVaccineSelected(
                                  vaccinePackage.comboId.toString()
                                )
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  value={vaccinePackage.comboId}
                                  checked={isVaccineSelected(
                                    vaccinePackage.comboId.toString()
                                  )}
                                  onChange={() =>
                                    handleSelectVaccine(
                                      vaccinePackage.comboId.toString(),
                                      vaccinePackage.comboName,
                                      "combo",
                                      vaccinePackage.totalPrice
                                    )
                                  }
                                />
                                <div className="vaccine-info">
                                  <h4>{vaccinePackage.comboName}</h4>
                                  <p className="description">
                                    {vaccinePackage.description}
                                  </p>
                                  <p className="price">
                                    Giá:{" "}
                                    {vaccinePackage.totalPrice?.toLocaleString(
                                      "vi-VN"
                                    )}{" "}
                                    vnđ
                                  </p>
                                  {suggestedCombos.includes(
                                    vaccinePackage.comboId as any
                                  ) && (
                                    <span className="recommendation-badge">
                                      Đề xuất
                                    </span>
                                  )}
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="vaccine-grid">
                          {singleVaccines.map((vaccine) => (
                            <div
                              key={vaccine.vaccineId}
                              className={`vaccine-card ${
                                isVaccineSelected(vaccine.vaccineId.toString())
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  value={vaccine.vaccineId}
                                  checked={isVaccineSelected(
                                    vaccine.vaccineId.toString()
                                  )}
                                  onChange={() =>
                                    handleSelectVaccine(
                                      vaccine.vaccineId.toString(),
                                      vaccine.name,
                                      "single",
                                      vaccine.price
                                    )
                                  }
                                />
                                <div className="vaccine-info">
                                  <h4>{vaccine.name}</h4>
                                  <p className="description">
                                    {vaccine.description}
                                  </p>
                                  <p className="price">
                                    Giá:{" "}
                                    {vaccine.price?.toLocaleString("vi-VN")} vnđ
                                  </p>
                                  {suggestedVaccines.includes(
                                    vaccine.vaccineId as any
                                  ) && (
                                    <span className="recommendation-badge">
                                      Đề xuất
                                    </span>
                                  )}
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedChild && selectedVaccines.length > 0 && (
              <button type="submit" className="submit-button">
                Hoàn thành đăng ký
              </button>
            )}
          </form>
        </div>
      </Spin>
    </Staff1Layout>
  );
};

export default BookingForStaff;
