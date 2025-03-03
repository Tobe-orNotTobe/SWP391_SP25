import React, { useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import Select from "react-select";
import "./ChildForm.scss";
import { ChildDetailResponse } from "../../interfaces/Child.ts";
import { useChildForm } from "../../hooks/useChild.ts";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate} from "react-router-dom";

const genderOptions = [
    { value: "Male", label: "Nam" },
    { value: "Female", label: "Nữ" }
];

const medicalHistoryOptions = [
    { value: "yes", label: "Có" },
    { value: "no", label: "Không" }
];

const relationOptions = [
    { value: "Son", label: "Con trai" },
    { value: "Daughter", label: "Con gái" },
    { value: "Grandchild", label: "Cháu" },
    { value: "YoungerBrother", label: "Em trai" },
    { value: "YoungerSister", label: "Em gái" },
    { value: "Relative", label: "Họ hàng" },
    { value: "Other", label: "Khác" }
];

interface ChildFormProps {
    isUpdate?: boolean;
    defaultValues?: ChildDetailResponse;
    refetch?: () => void;
}

const ChildForm: React.FC<ChildFormProps> = ({ isUpdate = false, defaultValues, refetch }) => {
    const {
        form,
        updateForm,
        isLoading,
        error,
        formatDateForInput,
        handleDateChange,
        handleWeightChange,
        handleHeightChange,
        handleImageUpload,
        handleRegister,
        handleUpdate
    } = useChildForm(refetch ?? (() => {}));

    const navigate = useNavigate();

    useEffect(() => {
        if (isUpdate && defaultValues) {
            updateForm("childId", defaultValues.childId);
            updateForm("childName", defaultValues.fullName);
            updateForm("birthDate", new Date(defaultValues.dateOfBirth));
            updateForm("selectedGender", genderOptions.find(opt => opt.value === defaultValues.gender) || null);
            updateForm("height", defaultValues.height);
            updateForm("weight", defaultValues.weight);
            updateForm("selectedMedicalHistory", medicalHistoryOptions.find(opt => opt.value === defaultValues.medicalHistory) || null);
            updateForm("selectedRelation", relationOptions.find(opt => opt.value === defaultValues.relationToUser) || null);
            updateForm("imageUrl", defaultValues.imageUrl);
        }
    }, [isUpdate, defaultValues]);

    return (
        <>
            {!isUpdate && (
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <span className={"navigateButton"} onClick={() => {
                        navigate("/my-childs")
                    }}>
                    <IoMdArrowRoundBack/>
                    Trở về trẻ của tôi
                </span>
                    <span style={{display: "flex", justifyContent: "end", width: "18%"}} className={"navigateButton"} onClick={() => {
                        navigate("/booking")
                    }}>
                        Đăng ký tiêm
                    <FaArrowRight/>
                </span>
                </div>


            )}
            <h2 className="childTitle">{isUpdate ? "Cập Nhật Thông Tin Trẻ" : "Đăng Ký Trẻ"}</h2>
            <form className="childRegistrationForm" onSubmit={isUpdate ? handleUpdate : handleRegister}>
                <div className="childRegistrationFormColumn">
                    <label className="childRegistrationLabel">Ảnh của trẻ</label>
                    <div className="imageUploadContainer" onClick={() => document.getElementById("imageUpload")?.click()}>
                        {form.selectedImage ? (
                            <img src={URL.createObjectURL(form.selectedImage)} alt="Uploaded" className="uploadedImage" />
                        ) : form.imageUrl ? (
                            <img src={form.imageUrl} alt="Uploaded" className="uploadedImage" />
                        ) : (
                            <FaUpload className="uploadIcon" />
                        )}
                    </div>
                    <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hiddenInput" />
                </div>
                <div className="childRegistrationFormColumn">
                    <label className="childRegistrationLabel">Họ tên trẻ</label>
                    <input className="childRegistrationInput" type="text" placeholder="Họ tên trẻ" value={form.childName} onChange={(e) => updateForm("childName", e.target.value)} required />

                    <label className="childRegistrationLabel">Ngày sinh trẻ</label>
                    <input className="childRegistrationInput" type="date" value={formatDateForInput(form.birthDate)} onChange={handleDateChange} required />

                    <label className="childRegistrationLabel">Giới tính</label>
                    <Select options={genderOptions} value={form.selectedGender} onChange={(option) => updateForm("selectedGender", option)} placeholder="Chọn giới tính" className="childRegistrationSelect" />

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ paddingRight: "10px" }}>
                            <label className="childRegistrationLabel">Chiều cao</label>
                            <input className="childRegistrationInput" type="number" placeholder="Chiều cao (cm)" value={form.height} onChange={handleHeightChange} min={0} required />
                        </div>
                        <div>
                            <label className="childRegistrationLabel">Cân nặng</label>
                            <input className="childRegistrationInput" type="number" placeholder="Cân nặng (kg)" value={form.weight} onChange={handleWeightChange} min={0} required />
                        </div>
                    </div>

                    <label className="childRegistrationLabel">Đã từng có lịch sử y tế?</label>
                    <Select options={medicalHistoryOptions} value={form.selectedMedicalHistory} onChange={(option) => updateForm("selectedMedicalHistory", option)} placeholder="Chọn có hoặc không" className="childRegistrationSelect" />

                    <label className="childRegistrationLabel">Mối quan hệ với người tiêm</label>
                    <Select options={relationOptions} value={form.selectedRelation} onChange={(option) => updateForm("selectedRelation", option)} placeholder="Chọn mối quan hệ" className="childRegistrationSelect" />
                </div>

                <div className="childRegistrationButtonContainer">
                    {error && <p style={{ color: "red", justifyContent: "center", display: "flex" }}>{error}</p>}
                    <br />
                    <button type="submit" className="childRegistrationButton" disabled={isLoading}>
                        {isLoading ? (isUpdate ? "Đang Cập Nhật..." : "Đang Đăng Ký...") : isUpdate ? "Cập Nhật" : "Đăng Ký"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default ChildForm;
