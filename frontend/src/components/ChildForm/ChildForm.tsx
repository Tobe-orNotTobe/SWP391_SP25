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
    { value: "SonOrDaughter", label: "Con (bao gồm Con trai, Con gái)" },
    { value: "Grandchild", label: "Cháu" },
    { value: "Sibling", label: "Anh chị em (bao gồm Em trai, Em gái)" },
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
        isSucessfull,
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
                    {isSucessfull && (
                        <span style={{display: "flex", justifyContent: "end", width: "18%"}}
                              className={"navigateButton"} onClick={() => {
                            navigate("/booking")
                        }}>
                        Đăng ký tiêm
                    <FaArrowRight/>
                </span>
                    )}
                </div>

            )}
            <h2 className="childTitle">{isUpdate ? "Cập Nhật Thông Tin Trẻ" : "Đăng Ký Trẻ"}</h2>
            <form className="childRegistrationForm" onSubmit={isUpdate ? handleUpdate : handleRegister}>
                <div className="childRegistrationFormColumn">
                    <label className="childRegistrationLabel">Ảnh của trẻ</label>
                    <div className="imageUploadContainer" style={{borderRadius : "50%"}}
                         onClick={() => document.getElementById("imageUpload")?.click()}>
                        {form.selectedImage ? (
                            <img src={URL.createObjectURL(form.selectedImage)} alt="Uploaded"
                                 className="uploadedImage"/>
                        ) : form.imageUrl ? (
                            <img src={form.imageUrl} alt="Uploaded" className="uploadedImage"/>
                        ) : (
                            <FaUpload className="uploadIcon"/>
                        )}
                    </div>
                    <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload}
                           className="hiddenInput"/>
                </div>
                <div className="childRegistrationFormColumn">
                    <label className="childRegistrationLabel">Họ tên trẻ</label>
                    <input className="childRegistrationInput" type="text" placeholder="Họ tên trẻ"
                           value={form.childName} onChange={(e) => updateForm("childName", e.target.value)} required/>

                    <label className="childRegistrationLabel">Ngày sinh trẻ</label>
                    <input className="childRegistrationInput"
                           type="date"
                           value={formatDateForInput(form.birthDate)}
                           onChange={handleDateChange}
                           max={new Date().toISOString().split("T")[0]}
                           required/>


                    <label className="childRegistrationLabel">Giới tính</label>

                    <div className={"childRegistrationRadioGroup"}>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={form.selectedGender?.value === "Male"}
                                onChange={() => updateForm("selectedGender", {value: "Male", label: "Nam"})}
                            /> Nam
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={form.selectedGender?.value === "Female"}
                                onChange={() => updateForm("selectedGender", {value: "Female", label: "Nữ"})}
                            /> Nữ
                        </label>
                    </div>

                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{paddingRight: "10px"}}>
                            <label className="childRegistrationLabel">Chiều cao</label>
                            <input className="childRegistrationInput" type="number" placeholder="Chiều cao (cm)"
                                   value={form.height} onChange={handleHeightChange} min={0} required/>
                        </div>
                        <div>
                            <label className="childRegistrationLabel">Cân nặng</label>
                            <input className="childRegistrationInput" type="number" placeholder="Cân nặng (kg)"
                                   value={form.weight} onChange={handleWeightChange} min={0} required/>
                        </div>
                    </div>

                    <label className="childRegistrationLabel">Đã từng có lịch sử y tế?</label>
                    <div className="childRegistrationRadioGroup">
                        <label>
                            <input type="radio" name="medicalHistory" value="yes"
                                   checked={form.selectedMedicalHistory?.value === "yes"}
                                   onChange={() => updateForm("selectedMedicalHistory", {
                                       value: "yes",
                                       label: "Có"
                                   })}/> Có
                        </label>
                        <label>
                            <input type="radio" name="medicalHistory" value="no"
                                   checked={form.selectedMedicalHistory?.value === "no"}
                                   onChange={() => updateForm("selectedMedicalHistory", {
                                       value: "no",
                                       label: "Không"
                                   })}/> Không
                        </label>
                    </div>

                    <label className="childRegistrationLabel">Mối quan hệ với người tiêm</label>
                    <Select options={relationOptions} value={form.selectedRelation}
                            onChange={(option) => updateForm("selectedRelation", option)} placeholder="Chọn mối quan hệ"
                            className="childRegistrationSelect"/>
                </div>

                <div className="childRegistrationButtonContainer">
                    {error && <p style={{color: "red", justifyContent: "center", display: "flex"}}>{error}</p>}
                    <br/>
                    <button type="submit" className="childRegistrationButton" disabled={isLoading}>
                        {isLoading ? (isUpdate ? "Đang Cập Nhật..." : "Đang Đăng Ký...") : isUpdate ? "Cập Nhật" : "Đăng Ký"}
                    </button>
                </div>

            </form>
        </>
    );
};

export default ChildForm;
