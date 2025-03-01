import React from "react";
import "./BookingForm.scss";
import useVaccinationForm from "../../hooks/useVaccinationForm";
import useVaccineSelection from "../../hooks/useVaccineSelection";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully";

const VaccinationRegistrationPage = () => {


  const {
    searchInput,
    parentInfo,
    selectedChild,
    isFormSplit,
    setSearchInput,
    handleSelectChild,
    handleAddNewChild,
    submitBooking,
    loading: formLoading,
    error: formError,
  } = useVaccinationForm();

  const {
    vaccineType,
    selectedVaccines,
    expandedCategory,
    vaccinePackages,
    singleVaccines,
    bookingDetails,
    bookingDate,
    handleVaccineTypeChange,
    handleSelectVaccine,
    toggleCategory,
    handleSelectBookingDate,
    loading: vaccineLoading,
    error: vaccineError,
  } = useVaccineSelection();

  // Xử lý khi form được submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedChild) {
      alert("Vui lòng chọn trẻ để đặt lịch.");
      return;
    }

    if (!bookingDate) {
      alert("Vui lòng chọn ngày đặt lịch.");
      return;
    }

    if (bookingDetails.length === 0) {
      alert("Vui lòng chọn ít nhất một vaccine.");
      return;
    }

    // Gọi hàm submitBooking
    await submitBooking(bookingDate, bookingDetails);
  };

  return (
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
            {/* Tìm kiếm thông tin phụ huynh */}
            <div className="form-section">
              <div className="form-group">
                {/* <div className="search-container">
                  <input
                    type="text"
                    placeholder="Mã khách hàng"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch(sub);
                      }
                    }}
                  />
                  <button
                    className="rouded-button"
                    type="button"
                    onClick={() => handleSearch(sub)}
                  >
                    Tìm kiếm
                  </button>
                </div> */
                }
              </div>

              {/* Hiển thị thông tin phụ huynh */}
              {parentInfo && (
                <div className="parent-info">
                  <h3>Thông tin phụ huynh</h3>
                  <p>
                    <strong>Tên phụ huynh:</strong> {parentInfo.parentName}
                  </p>
                </div>
              )}

              {/* Hiển thị danh sách trẻ */}
              {parentInfo && parentInfo.children.length > 0 && (
                <div className="registered-children">
                  <h3>Danh sách trẻ</h3>
                  <ul>
                    {parentInfo.children.map((child) => (
                      <li key={child.childId} className="child-card">
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedChild?.childId === child.childId}
                            onChange={() => {
                              if (selectedChild?.childId === child.childId) {
                                console.log(child);
                                handleSelectChild(null);
                              } else {
                                console.log(child);
                                handleSelectChild(child);
                              }
                            }}
                          />
                          <div className="child-info">
                            <p>Tên: {child.fullName}</p>
                            <p>Ngày sinh: {child.dateOfBirth}</p>
                          </div>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="rouded-button"
                    type="button"
                    onClick={handleAddNewChild}
                  >
                    Đăng ký thêm trẻ
                  </button>
                </div>
              )}

              {/* Không có trẻ nào */}
              {parentInfo && parentInfo.children.length === 0 && (
                <div className="no-children-found">
                  <p>Không tìm thấy trẻ nào.</p>
                  <button type="button" onClick={handleAddNewChild}>
                    Đăng ký trẻ mới
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="splited-part">
            {/* Lựa chọn vắc xin */}
            {selectedChild && (
              <div className="form-section">
                <div className="form-section">
                  <h3>Thông tin dịch vụ</h3>

                  {/* Chọn ngày đặt lịch */}
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

                  {/* Chọn loại vắc xin */}
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

                  {/* Danh sách vắc xin */}
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
                                handleSelectVaccine(vaccinePackage.comboId);
                              }
                            }}
                          >
                            <h3>{vaccinePackage.comboName}</h3>
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
                                vaccine.vaccineId
                              )}
                              onChange={() =>
                                handleSelectVaccine(vaccine.vaccineId)
                              }
                            />
                            <div className="vaccine-info">
                              <h4>{vaccine.name}</h4>
                              <p className="price">
                                Giá: {vaccine.price?.toLocaleString("vi-VN")}{" "}
                                vnđ
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nút hoàn thành đăng ký */}
        {selectedChild && (
          <button type="submit" className="submit-button">
            Hoàn thành đăng ký
          </button>
        )}
      </form>
    </div>
  );
};

export default VaccinationRegistrationPage;
