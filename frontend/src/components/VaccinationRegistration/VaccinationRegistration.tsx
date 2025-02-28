import React from "react";
import "./VaccinationRegistration.scss";
import useVaccinationForm from "../../hooks/useVaccinationForm";
import useVaccineSelection from "../../hooks/useVaccineSelection";

const VaccinationRegistrationPage = () => {
  const {
    formData,
    searchInput,
    parentInfo,
    selectedChild,
    showNewChildForm,
    isFormSplit,
    setSearchInput,
    handleChange,
    handleGenderChange,
    handleSearch,
    handleSelectChild,
    handleAddNewChild,
    submitBooking,
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
  } = useVaccineSelection();

  return (
    <div className="vaccination-container">
      <form
        onSubmit={(event) => {
          event.preventDefault(); // Ngăn chặn hành động mặc định của form
          submitBooking(bookingDate, bookingDetails);
        }}
        className={`vaccination-form ${
          isFormSplit ? "vaccination-form-splited" : ""
        }`}
      >
        <h1>Đăng ký tiêm chủng</h1>
        <div className="split-form">
          <div className="splited-part">
            {/* Tìm kiếm thông tin phụ huynh */}
            <div className="form-section">
              {/* <h2>Tìm kiếm thông tin phụ huynh</h2> */}
              <div className="form-group">
                <label>Nhập mã khách hàng của phụ huynh*</label>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Mã khách hàng"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                  <button
                    className="rouded-button"
                    type="button"
                    onClick={handleSearch}
                  >
                    Tìm kiếm
                  </button>
                </div>
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
                      <li key={child.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedChild?.id === child.id}
                            onChange={() => {
                              if (selectedChild?.id === child.id) {
                                // Nếu đã chọn, bỏ chọn
                                handleSelectChild(null);
                              } else {
                                // Nếu chưa chọn, chọn trẻ này
                                handleSelectChild(child);
                              }
                            }}
                          />
                          <div className="child-info">
                            <span>{child.name}</span> -{" "}
                            <span>{child.birthDate}</span>
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
            {/* Form thông tin trẻ */}
            {/* {(selectedChild) && (
              <div className="form-section">
                <h2>Thông tin trẻ đã chọn</h2>
                <div className="form-group">
                  <label>Họ tên trẻ :</label>
                  <p>{formData.fullName}</p>
                </div>
                <div className="form-group">
                  <label>Ngày sinh :</label>
                  <p>{formData.birthDate}</p>
                </div>
                <div className="form-group">
                  <label className="required">* Giới tính</label>
                  <div className="gender-selection">
                    <button
                      type="button"
                      className={formData.gender === "Nam" ? "active" : ""}
                      onClick={() => handleGenderChange("Nam")}
                    >
                      Nam
                    </button>
                    <button
                      type="button"
                      className={formData.gender === "Nữ" ? "active" : ""}
                      onClick={() => handleGenderChange("Nữ")}
                    >
                      Nữ
                    </button>
                  </div>
                </div>
              </div>
            )} */}

            {/* Lựa chọn vắc xin */}
            {(showNewChildForm || selectedChild) && (
              <div className="form-section">
                <div className="form-section">
                  <h3>Thông tin dịch vụ</h3>

                  {/* Chọn loại vắc xin */}
                  <div className="form-group">
                    <label>Ngày muốn đặt lịch tiêm *</label>
                    <input
                      required
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate} // Đảm bảo sử dụng đúng state (Không phải birthDate)
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
                                    // onChange={() =>
                                    //   handleSelectVaccine(
                                    //     String(vaccinePackage.comboId)
                                    //   )
                                    // }
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
        {(showNewChildForm || selectedChild) && (
          <button type="submit" className="submit-button">
            Hoàn thành đăng ký
          </button>
        )}
      </form>
    </div>
  );
};

export default VaccinationRegistrationPage;
