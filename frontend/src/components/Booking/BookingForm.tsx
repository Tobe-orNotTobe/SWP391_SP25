import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Modal } from "antd";
import "./BookingForm.scss";
import {
  Parent,
  Child,
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
  const [selectedVaccines, setSelectedVaccines] = useState<SelectedVaccine[]>(
    []
  );
  const [notes, setNotes] = useState<string>("");
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [parentVaccineMessages, setParentVaccineMessages] = useState<string[]>(
    []
  );

  // Fetch vaccine data
  const { vaccineDetail: singleVaccines, loading: vaccineLoading } =
    useVaccineDetail();
  const { comboVaccineDetail: vaccinePackages, loading: comboLoading } =
    useComboVaccineDetail();

  // State for suggested vaccines and combos
  const [suggestedVaccines, setSuggestedVaccines] = useState<string[]>([]);
  const [suggestedCombos, setSuggestedCombos] = useState<string[]>([]);

  // Track last added vaccine to prevent duplicate checks
  //const [parentVaccineChecks, setParentVaccineChecks] = useState<ParentVaccineCheck[]>([]);

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

  const isChecking = useRef(false);
  const checkParentVaccineForSelection = async (vaccineId: string) => {
    if (isChecking.current) return; // Ngăn chặn gọi lại
    isChecking.current = true;

    try {
      const response = await apiCheckParentVaccine([Number(vaccineId)]);
      if (response.result && response.result.length > 0) {
        // setParentVaccineChecks(prev => [
        //     ...prev,
        //     { vaccineId, messages: response.result, checked: false }
        // ]);
        showConfirmationModal(response.result, vaccineId);
      }
    } catch (error) {
      console.error("Error checking parent vaccine:", error);
      toast.error("Không thể kiểm tra vaccine yêu cầu trước đó.");
    } finally {
      isChecking.current = false; // Reset flag sau khi hoàn tất
    }
  };

  // Show confirmation modal
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
        // setParentVaccineChecks(prev =>
        //   prev.map(check =>
        //     check.vaccineId === vaccineId ? { ...check, checked: true } : check
        //   )
        // );
      },
      onCancel: () => {
        setSelectedVaccines((prev) =>
          prev.filter((item) => item.id !== vaccineId)
        );
        // setParentVaccineChecks(prev =>
        //   prev.filter(check => check.vaccineId !== vaccineId)
        // );
        toast.warning("Vui lòng tiêm vaccine yêu cầu trước khi tiếp tục.");
      },
    });
  };

  // Handle selecting a child
  const handleSelectChild = (child: Child | null) => {
    setSelectedChild(child);
    setIsFormSplit(!!child);
    setSelectedVaccines([]);
    setParentVaccineMessages([]);
  };

  // Handle adding a new child
  const handleAddNewChild = () => {
    navigate("/child-register");
  };

  // Handle submitting the booking
  const submitBooking = async (
    bookingDetails: BookingDetail[],
    notes: string
  ) => {
    if (!selectedChild || !parentInfo?.customerCode) return;

    setFormLoading(true);
    try {
      const bookingData: Booking = {
        childId: Number(selectedChild.childId),
        notes: notes,
        bookingDetails: bookingDetails,
      };

      const status = await apiBooking(parentInfo.customerCode, bookingData);
      console.log(status.result);
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
    setParentVaccineMessages([]);
  };

  const handleSelectVaccine = (
    vaccineId: string,
    vaccineName: string,
    type: "single" | "combo",
    price?: number
  ) => {
    setSelectedVaccines((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (item) => item.id === vaccineId
      );
      let newSelection: SelectedVaccine[];

      if (isAlreadySelected) {
        // Remove vaccine and update parent checks
        // setParentVaccineChecks((prev) =>
        //   prev.filter((check) => check.vaccineId !== vaccineId)
        // );
        newSelection = prevSelected.filter((item) => item.id !== vaccineId);
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

  // Remove a selected vaccine
  const handleRemoveVaccine = (vaccineId: string) => {
    setSelectedVaccines((prev) => prev.filter((item) => item.id !== vaccineId));
    //setParentVaccineChecks(prev => prev.filter(check => check.vaccineId !== vaccineId));
  };

  // Validate date
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

  // Update booking details when selected vaccines change
  useEffect(() => {
    const newBookingDetails = selectedVaccines.map((item) => ({
      vaccineId: item.type === "single" ? Number(item.id) : null,
      comboVaccineId: item.type === "combo" ? Number(item.id) : null,
      injectionDate: item.date || new Date().toISOString(), // Default to today if no date selected
    }));
    setBookingDetails(newBookingDetails as any);
    console.log(bookingDetails);
  }, [selectedVaccines]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Kiểm tra xem có vaccine nào chưa xác nhận parent không

    if (!selectedChild || bookingDetails.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một vaccine.");
      return;
    }

    // Check if all selected vaccines have dates
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

  // Check if a vaccine is selected
  const isVaccineSelected = (id: string) => {
    return selectedVaccines.some((item) => item.id === id);
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

                {/* Hiển thị danh sách vaccine đã chọn */}
                {selectedChild && selectedVaccines.length > 0 && (
                  <div className="selected-vaccines-section">
                    <h3>Vaccine đã chọn</h3>
                    <div className="selected-vaccines-list">
                      {selectedVaccines.map((vaccine) => (
                        <div key={vaccine.id} className="selected-vaccine-item">
                          <div className="vaccine-info">
                            <h4>{vaccine.name}</h4>
                            {vaccine.price && (
                              <p className="price">
                                Giá: {vaccine.price.toLocaleString("vi-VN")} vnđ
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
  );
};

export default BookingForm;
