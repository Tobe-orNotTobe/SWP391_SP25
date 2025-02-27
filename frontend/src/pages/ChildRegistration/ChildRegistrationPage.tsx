import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import React from "react";
import Select from "react-select";
import { FaUpload } from "react-icons/fa";
import "./ChildRegistration.scss";
import "./useChildRegister.ts"
import {useChildRegister} from "./useChildRegister.ts";

const genderOptions = [
    { value: "Male", label: "Nam" },
    { value: "Female", label: "Nữ" }
];

const medicalHistoryOptions = [
    { value: "yes", label: "Có"},
    { value: "no", label: "Không"}
];

const relationOptions = [
    { value: "Son", label: "Con trai" },
    { value: "Daughter", label: "Con gái" },
    { value: "Grandchild", label: "Cháu" },
    { value: "YoungerBrother", label: "Em trai" },
    { value: "YoungerSister", label: "Em gái" },
    { value: "Relative", label: "Họ hàng" },
    { value: "Other", label: "Khác" },

];

const ChildRegistrationPage: React.FC = () => {

    const {
        selectedGender,
        setSelectedGender,
        selectedRelation,
        setSelectedRelation,
        selectedMedicalHistory,
        setSelectedMedicalHistory,
        selectedImage,
        childName,
        setChildName,
        birthDate,
        height,
        weight,
        isLoading,
        error,
        formatDateForInput,
        handleDateChange,
        handleWeightChange,
        handleHeightChange,
        handleImageUpload,
        handleSubmit
    } = useChildRegister();




    return (
        <>
            <CustomerNavbar />
            <div className="childRegistrationContainer">
                <h2 className="childRegistrationTitle">Đăng ký trẻ</h2>
                <form className="childRegistrationForm" onSubmit={handleSubmit}>
                    <div className="childRegistrationFormColumn">
                        <label className="childRegistrationLabel">Ảnh của trẻ</label>
                        <div
                            className="imageUploadContainer"
                            onClick={() => document.getElementById("imageUpload")?.click()}
                        >
                            {selectedImage ? (
                                <img src={URL.createObjectURL(selectedImage)} alt="Uploaded" className="uploadedImage" />
                            ) : (
                                <FaUpload className="uploadIcon" />
                            )}
                        </div>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hiddenInput"
                        />
                    </div>
                    <div className="childRegistrationFormColumn">
                        <label className="childRegistrationLabel">Họ tên trẻ</label>
                        <input
                            className="childRegistrationInput"
                            type="text"
                            placeholder="Họ tên trẻ"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            required
                        />

                        <label className="childRegistrationLabel">Ngày sinh trẻ</label>
                        <input
                            className="childRegistrationInput"
                            type="date"
                            value={formatDateForInput(birthDate)}
                            onChange={handleDateChange}
                            required
                        />

                        <label className="childRegistrationLabel">Giới tính</label>
                        <Select
                            options={genderOptions}
                            value={selectedGender}
                            onChange={setSelectedGender}
                            placeholder="Chọn giới tính"
                            className="childRegistrationSelect"
                        />

                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div style={{paddingRight: "10px"}}>
                                <label className="childRegistrationLabel">Chiều cao</label>
                                <input
                                    className="childRegistrationInput"
                                    type="number"
                                    placeholder="Chiều cao (cm)"
                                    value={height}
                                    onChange={handleHeightChange}
                                    min={0}
                                    required
                                />
                            </div>
                            <div>
                                <label className="childRegistrationLabel">Cân nặng</label>
                                <input
                                    className="childRegistrationInput"
                                    type="number"
                                    placeholder="Cân nặng (kg)"
                                    value={weight}
                                    onChange={handleWeightChange}
                                    min={0}
                                    required
                                />
                            </div>
                        </div>

                        <label className="childRegistrationLabel">Đã từng có lích sử y tế?</label>
                        <Select
                            options={medicalHistoryOptions}
                            value={selectedMedicalHistory}
                            onChange={setSelectedMedicalHistory}
                            placeholder="Chọn có hoặc không"
                            className="childRegistrationSelect"
                        />

                        <label className="childRegistrationLabel">Mối quan hệ với người tiêm</label>
                        <Select
                            options={relationOptions}
                            value={selectedRelation}
                            onChange={setSelectedRelation}
                            placeholder="Chọn mối quan hệ"
                            className="childRegistrationSelect"
                        />
                    </div>

                    <div className="childRegistrationButtonContainer">
                        {error && <p style={{color: "red", justifyContent: "center", display: "flex"}}>{error}</p>} <br/>
                        <button type="submit" className="childRegistrationButton" disabled={isLoading}>
                            {isLoading ? "Đang Đăng Ký..." : "Đăng Ký"}
                        </button>
                    </div>
                </form>
            </div>
            <FloatingButtons/>
            <Footer/>
        </>
    );
};

export default ChildRegistrationPage;
