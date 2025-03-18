import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Modal } from "antd"; // Thêm Modal từ Ant Design để hiển thị thông báo
import "./BookingForm.scss";
import {
  Parent,
  Child,
  BookingDetail,
  Booking,
  Vaccine,
  VaccinePackage,
} from "../../interfaces/VaccineRegistration.ts";
import { apiBooking, apiCheckParentVaccine } from "../../apis/apiBooking";
import { apiGetMyChilds } from "../../apis/apiChild.ts";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  useVaccineDetail,
  useComboVaccineDetail,
} from "../../hooks/useVaccine";
import { toast } from "react-toastify";
import { ChildDetailResponse } from "../../interfaces/Child.ts";
import { apiGetVaccinationScheduleByChildrenId } from "../../apis/apiVaccine.ts";
import { apiGetProfileUser } from "../../apis/apiAccount.ts";

const BookingForm = () => {
  const navigate = useNavigate();

  // State for vaccination form
  const [isFormSplit, setIsFormSplit] = useState(false);
  const [username, setUsername] = useState("");
  const [sub, setSub] = useState("");
  const [parentInfo, setParentInfo] = useState<Parent>({
    customerCode: sub,
    parentName: username || "Không rõ",
    children: [],
  });
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // State for vaccine selection
  const [vaccineType, setVaccineType] = useState<"Gói" | "Lẻ">("Gói");
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [parentVaccineMessages, setParentVaccineMessages] = useState<string[]>(
    []
  ); // State để lưu thông báo ParentVaccine

  // Fetch vaccine data
  const { vaccineDetail: singleVaccines, loading: vaccineLoading } =
    useVaccineDetail();
  const { comboVaccineDetail: vaccinePackages, loading: comboLoading } =
    useComboVaccineDetail();

  // State for suggested vaccines and combos
  const [suggestedVaccines, setSuggestedVaccines] = useState<string[]>([]);
  const [suggestedCombos, setSuggestedCombos] = useState<string[]>([]);

  // Fetch parent and children info
  useEffect(() => {
    const fetchParentAndChildrenInfo = async () => {
      setFormLoading(true);
      try {
        const profileData = await apiGetProfileUser();
        if (!profileData.isSuccess || !profileData.result) {
          toast.warning(
            "Không thể lấy thông tin profile. Vui lòng đăng nhập lại."
          );
          navigate("/login");
          return;
        }

        const fetchedUsername = profileData.result.fullName;
        const fetchedSub = profileData.result.id;

        setUsername(fetchedUsername);
        setSub(fetchedSub);

        const data = await apiGetMyChilds();
        if (!data.isSuccess || !data.result) {
          toast.warning("Không có dữ liệu trẻ.");
          return;
        }

        const children = data.result.map((child: ChildDetailResponse) => ({
          childId: child.childId,
          fullName: child.fullName,
          dateOfBirth: child.dateOfBirth,
          gender: child.gender === "Female" ? "Nữ" : "Nam",
          imageUrl: child.imageUrl,
        }));

        setParentInfo({
          customerCode: fetchedSub,
          parentName: fetchedUsername,
          children: children as Child[],
        });
      } catch (error) {
        navigate("/login");
      } finally {
        setFormLoading(false);
      }
    };

    fetchParentAndChildrenInfo();
  }, [navigate]);

  // Fetch vaccination schedule for selected child
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

  // Check ParentVaccine when selectedVaccines change
  useEffect(() => {
    const checkParentVaccines = async (newVaccineId: string) => {
      try {
        const vaccineId = Number(newVaccineId); // Chuyển đổi ID sang số
        const response = await apiCheckParentVaccine([vaccineId]); // Chỉ kiểm tra vaccine mới được chọn
        if (response.result && response.result.length > 0) {
          setParentVaccineMessages(response.result); // Lưu thông báo từ API
          showConfirmationModal(response.result, newVaccineId); // Truyền ID vaccine mới vào modal
        } else {
          setParentVaccineMessages([]); // Không có thông báo
        }
      } catch (error) {
        console.error("Error checking parent vaccine:", error);
        toast.error("Không thể kiểm tra vaccine yêu cầu trước đó.");
      }
    };
  
    // Chỉ gọi API khi có vaccine mới được chọn và loại vaccine là "Lẻ" (không phải combo)
    if (selectedVaccines.length > 0 && vaccineType === "Lẻ") {
      const lastSelectedVaccineId = selectedVaccines[selectedVaccines.length - 1]; // Lấy vaccine cuối cùng được chọn
      checkParentVaccines(lastSelectedVaccineId);
    } else {
      setParentVaccineMessages([]); // Reset nếu không có vaccine được chọn hoặc là combo
    }
  }, [selectedVaccines, vaccineType]); // Thêm vaccineType vào dependency array

  // Show confirmation modal
  const showConfirmationModal = (messages: string[], newVaccineId: string) => {
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
        // Người dùng xác nhận đã tiêm, tiếp tục xử lý
        setParentVaccineMessages([]); // Xóa thông báo sau khi xác nhận
      },
      onCancel: () => {
        // Người dùng chưa tiêm, chỉ bỏ chọn vaccine mới được chọn
        setSelectedVaccines((prevSelected) =>
          prevSelected.filter((id) => id !== newVaccineId)
        );
        toast.warning("Vui lòng tiêm vaccine yêu cầu trước khi tiếp tục.");
      },
    });
  };

  // Handle selecting a child
  const handleSelectChild = (child: Child | null) => {
    setSelectedChild(child);
    setIsFormSplit(!!child);
  };

  // Handle adding a new child
  const handleAddNewChild = () => {
    navigate("/child-register");
  };

  // Handle submitting the booking
  const submitBooking = async (
    bookingDate: string,
    bookingDetails: BookingDetail[],
    notes: string
  ) => {
    if (!selectedChild || !parentInfo?.customerCode) return;

    setFormLoading(true);
    try {
      const bookingData: Booking = {
        childId: Number(selectedChild.childId),
        bookingDate: bookingDate,
        notes: notes,
        bookingDetails: bookingDetails,
      };

      const status = await apiBooking(parentInfo.customerCode, bookingData);
      navigate("/payment", { state: { bookingResult: status.result } });
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      toast.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle vaccine type change
  const handleVaccineTypeChange = (type: "Gói" | "Lẻ") => {
    setVaccineType(type);
    setSelectedVaccines([]);
  };

  // Handle selecting a vaccine
  const handleSelectVaccine = (vaccineId: string) => {
    setSelectedVaccines((prevSelected) => {
      if (prevSelected.includes(vaccineId)) {
        return prevSelected.filter((id) => id !== vaccineId);
      } else {
        return [...prevSelected, vaccineId];
      }
    });
  };

  // Toggle vaccine category
  const toggleCategory = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  // Handle selecting booking date
  const handleSelectBookingDate = (date: unknown) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      toast.error("Ngày không hợp lệ.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      toast.error("Không thể chọn ngày trong quá khứ.");
      return;
    }
    setBookingDate(date.toISOString());
  };

  // Update booking details when selected vaccines change
  useEffect(() => {
    const newBookingDetails = selectedVaccines.map((id) => ({
      vaccineId: vaccineType === "Lẻ" ? Number(id) : null,
      comboVaccineId: vaccineType === "Gói" ? Number(id) : null,
    }));
    setBookingDetails(newBookingDetails as any);
  }, [selectedVaccines, vaccineType]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedChild || !bookingDate || bookingDetails.length === 0) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (parentVaccineMessages.length > 0) {
      toast.warning("Vui lòng xác nhận tình trạng tiêm chủng trước đó.");
      return;
    }

    await submitBooking(bookingDate, bookingDetails, notes);
  };

  return (
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
                {parentInfo && (
                  <div className="parent-info">
                    <h3>Thông tin phụ huynh</h3>
                    <p>
                      <strong>Tên phụ huynh:</strong> {username}
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
                              checked={selectedChild?.childId === child.childId}
                              onChange={() => {
                                if (selectedChild?.childId === child.childId) {
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
                                    child.imageUrl ? child.imageUrl : undefined
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
              </div>
            </div>

            <div className="splited-part">
              {selectedChild && (
                <div className="form-section">
                  <h3>Thông tin dịch vụ</h3>
                  <div className="form-group">
                    <label>Ngày muốn đặt lịch tiêm *</label>
                    <input
                      required
                      type="date"
                      name="bookingDate"
                      value={bookingDate ? bookingDate.split("T")[0] : ""}
                      onChange={(e) =>
                        handleSelectBookingDate(new Date(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Ghi chú</label>
                    <textarea
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
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
                          <label
                            key={vaccinePackage.comboId}
                            className="vaccine-card"
                          >
                            <input
                              type="checkbox"
                              value={vaccinePackage.comboId}
                              checked={selectedVaccines.includes(
                                vaccinePackage.comboId.toString()
                              )}
                              onChange={() =>
                                handleSelectVaccine(
                                  vaccinePackage.comboId.toString()
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
                        ))}
                      </div>
                    ) : (
                      <div className="vaccine-grid">
                        {singleVaccines.map((vaccine) => (
                          <label
                            key={vaccine.vaccineId}
                            className="vaccine-card"
                          >
                            <input
                              type="checkbox"
                              value={vaccine.vaccineId}
                              checked={selectedVaccines.includes(
                                vaccine.vaccineId.toString()
                              )}
                              onChange={() =>
                                handleSelectVaccine(
                                  vaccine.vaccineId.toString()
                                )
                              }
                            />
                            <div className="vaccine-info">
                              <h4>{vaccine.name}</h4>
                              <p className="description">
                                {vaccine.description}
                              </p>
                              <p className="price">
                                Giá: {vaccine.price?.toLocaleString("vi-VN")}{" "}
                                vnđ
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
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedChild && (
            <button type="submit" className="submit-button">
              Hoàn thành đăng ký
            </button>
          )}
        </form>
      </div>
    </Spin>
  );
};

export default BookingForm;
