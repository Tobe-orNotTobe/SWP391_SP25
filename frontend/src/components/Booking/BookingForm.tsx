import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import "./BookingForm.scss";
import {
  Parent,
  Child,
  BookingDetail,
  Booking,
} from "../../interfaces/VaccineRegistration.ts";
import { apiBooking } from "../../apis/apiBooking";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully";
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

const BookingForm = () => {
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
  const [formError, setFormError] = useState<string | null>(null);

  // State for vaccine selection
  const [vaccineType, setVaccineType] = useState<"Gói" | "Lẻ">("Gói");
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);

  // State for suggested vaccines and combos
  const [suggestedVaccines, setSuggestedVaccines] = useState<string[]>([]);
  const [suggestedCombos, setSuggestedCombos] = useState<string[]>([]);

  // Fetch vaccine data
  const { vaccineDetail: singleVaccines, loading: vaccineLoading } =
    useVaccineDetail();
  const { comboVaccineDetail: vaccinePackages, loading: comboLoading } =
    useComboVaccineDetail();

  // Fetch parent and children info
  useEffect(() => {
    const fetchParentAndChildrenInfo = async () => {
      setFormLoading(true);
      setFormError(null);

      try {
        const data = await apiGetMyChilds();

        if (data.isSuccess && data.result) {
          const children = data.result.map((child: ChildDetailResponse) => ({
            childId: child.childId,
            fullName: child.fullName,
            dateOfBirth: child.dateOfBirth,
            gender: child.gender === "Female" ? "Nữ" : "Nam",
            imageUrl: child.imageUrl,
          }));

          setParentInfo({
            customerCode: sub,
            parentName: username,
            children: children as Child[],
          });
        } else {
          setFormError("Không có trẻ.");
          toast.warning("Không có dữ liệu trẻ.");
        }
      } catch (error) {
        const errorMessage = error || "Lỗi không xác định";
        console.error("Lỗi khi lấy thông tin phụ huynh:", error);
        setFormError(errorMessage.toString());
        toast.warning(errorMessage.toString());
      } finally {
        setFormLoading(false);
      }
    };

    fetchParentAndChildrenInfo();
  }, [sub, username]);

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
              (vaccine) => vaccine.vaccineId
            );
            const comboIds = response.result.comboVaccines.map(
              (combo) => combo.comboId
            );

            console.log("Vaccine IDs:", vaccineIds);
            console.log("Combo IDs:", comboIds);

            setSuggestedVaccines(vaccineIds);
            setSuggestedCombos(comboIds);
          } else {
            console.error("Error: Invalid response structure", response);
          }
        } catch (error) {
          console.error("Error fetching vaccination schedule:", error);
        }
      };

      fetchVaccinationSchedule();
    }
  }, [selectedChild]);

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
    bookingDetails: BookingDetail[]
  ) => {
    if (!selectedChild) {
      toast.warning("Vui lòng chọn trẻ để đặt lịch.");
      return;
    }

    if (!parentInfo?.customerCode) {
      toast.warning("Không tìm thấy thông tin phụ huynh.");
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const bookingData: Booking = {
        childId: Number(selectedChild.childId),
        bookingDate: bookingDate,
        notes: "Ghi chú đặt lịch",
        bookingDetails: bookingDetails,
      };

      const status = await apiBooking(parentInfo.customerCode, bookingData);
      console.log(status.result);
      navigate("/payment", { state: { bookingResult: status.result } });
    } catch (error) {
      const errorMessage = error || "Lỗi không xác định";
      console.error("Error submitting booking:", errorMessage);
      setFormError("Có lỗi xảy ra khi gửi dữ liệu.");
      toast.error(errorMessage.toString());
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
    setBookingDate(date.toISOString());
  };

  // Update booking details when selected vaccines change
  useEffect(() => {
    const newBookingDetails = selectedVaccines.map((id) => ({
      vaccineId: vaccineType === "Lẻ" ? Number(id) : null,
      comboVaccineId: vaccineType === "Gói" ? Number(id) : null,
    }));
    setBookingDetails(newBookingDetails);
  }, [selectedVaccines, vaccineType]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedChild) {
      toast.warning("Vui lòng chọn trẻ để đặt lịch.");
      return;
    }

    if (!bookingDate) {
      toast.warning("Vui lòng chọn ngày đặt lịch.");
      return;
    }

    if (bookingDetails.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một vaccine.");
      return;
    }

    await submitBooking(bookingDate, bookingDetails);
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
                      vaccinePackages.map((vaccinePackage) => (
                        <div
                          key={vaccinePackage.comboId}
                          className="vaccine-category"
                        >
                          <div
                            className="category-header"
                            onClick={() => {
                              toggleCategory(vaccinePackage.comboName);
                              if (
                                expandedCategory !== vaccinePackage.comboName
                              ) {
                                handleSelectVaccine(
                                  vaccinePackage.comboId.toString()
                                );
                              }
                            }}
                          >
                            <h3>{vaccinePackage.comboName}</h3>
                            {suggestedCombos.includes(
                              vaccinePackage.comboId
                            ) && (
                              <span className="recommendation-badge">
                                Đề xuất
                              </span>
                            )}
                            <span>
                              {expandedCategory === vaccinePackage.comboName
                                ? "▲"
                                : "▼"}
                            </span>
                          </div>
                          {expandedCategory === vaccinePackage.comboName && (
                            <div className="vaccine-grid">
                              {vaccinePackage.vaccines.map((vaccine) => (
                                <label
                                  key={vaccine.vaccineId}
                                  className="vaccine-card"
                                >
                                  <input
                                    disabled
                                    type="checkbox"
                                    value={vaccine.vaccineId}
                                    checked={true}
                                  />
                                  <div className="vaccine-info">
                                    <h4>{vaccine.name}</h4>
                                    <p className="price">
                                      Giá:{" "}
                                      {vaccine.price?.toLocaleString("vi-VN")}{" "}
                                      vnđ
                                    </p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
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
                              <p className="price">
                                Giá: {vaccine.price?.toLocaleString("vi-VN")}{" "}
                                vnđ
                              </p>
                            </div>
                            {suggestedVaccines.includes(vaccine.vaccineId) && (
                              <span className="recommendation-badge">
                                Đề xuất
                              </span>
                            )}
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
