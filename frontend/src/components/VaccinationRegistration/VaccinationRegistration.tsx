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
  } = useVaccinationForm();

  const {
    vaccineType,
    selectedVaccines,
    expandedCategory,
    vaccinePackages,
    singleVaccines,
    handleVaccineTypeChange,
    handleCheckboxChange,
    toggleCategory,
  } = useVaccineSelection();

  return (
    <div className="vaccination-container">
      <form
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
            {(showNewChildForm || selectedChild) && (
              <div className="form-section">
                <h2>Thông tin {selectedChild ? "trẻ đã chọn" : "trẻ mới"}</h2>
                <div className="form-group">
                  <label>Họ tên trẻ *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Ngày sinh *</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
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
            )}

            {/* Lựa chọn vắc xin */}
            {(showNewChildForm || selectedChild) && (
              <div className="form-section">
                <div className="form-section">
                  <h2>Thông tin dịch vụ</h2>

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
                      vaccinePackages.map((group, index) => (
                        <div key={index} className="vaccine-category">
                          <div
                            className="category-header"
                            onClick={() => toggleCategory(group.category)}
                          >
                            <h3>{group.category}</h3>
                            <span>
                              {expandedCategory === group.category ? "▲" : "▼"}
                            </span>
                          </div>
                          {expandedCategory === group.category && (
                            <div className="vaccine-grid">
                              {group.vaccines.map((vaccine) => (
                                <label
                                  key={vaccine.id}
                                  className="vaccine-card"
                                >
                                  <input
                                    type="checkbox"
                                    value={vaccine.id}
                                    checked={selectedVaccines.includes(
                                      vaccine.id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(vaccine.id)
                                    }
                                  />
                                  <div className="vaccine-info">
                                    <h4>{vaccine.name}</h4>
                                    <p className="price">{vaccine.price}</p>
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
                          <label key={vaccine.id} className="vaccine-card">
                            <input
                              type="checkbox"
                              value={vaccine.id}
                              checked={selectedVaccines.includes(vaccine.id)}
                              onChange={() => handleCheckboxChange(vaccine.id)}
                            />
                            <div className="vaccine-info">
                              <h4>{vaccine.name}</h4>
                              <p className="price">{vaccine.price}</p>
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
