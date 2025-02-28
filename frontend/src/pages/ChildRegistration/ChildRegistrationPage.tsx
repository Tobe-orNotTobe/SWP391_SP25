import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Select from "react-select";
import { FaUpload } from "react-icons/fa";
import "./ChildRegistration.scss";

const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" }
];

const relationOptions = [
    { value: "child", label: "Con" },
    { value: "grandchild", label: "Cháu" },
    { value: "younger_sibling", label: "Em" }
];

const ChildRegistrationPage: React.FC = () => {
    const [selectedGender, setSelectedGender] = useState<{ value: string; label: string } | null>(null);
    const [selectedRelation, setSelectedRelation] = useState<{ value: string; label: string } | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [childName, setChildName] = useState<string>("");
    const [birthDate, setBirthDate] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [contactName, setContactName] = useState<string>("");

    // Xử lý chọn ảnh
    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    // Xử lý gửi form
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!childName || !birthDate || !selectedGender || !height || !weight || !contactName || !selectedRelation) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const formData = new FormData();
        formData.append("childName", childName);
        formData.append("birthDate", birthDate);
        formData.append("gender", selectedGender.value);
        formData.append("height", height);
        formData.append("weight", weight);
        formData.append("contactName", contactName);
        formData.append("relation", selectedRelation.value);
        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        try {
            const response = await fetch("https://your-api-url.com/register-child", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Có lỗi xảy ra, vui lòng thử lại!");
            }

            alert("Đăng ký thành công!");
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Đăng ký thất bại!");
        }
    };

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
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
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

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ paddingRight: "10px" }}>
                                <label className="childRegistrationLabel">Chiều cao</label>
                                <input
                                    className="childRegistrationInput"
                                    type="text"
                                    placeholder="Chiều cao (cm)"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="childRegistrationLabel">Cân nặng</label>
                                <input
                                    className="childRegistrationInput"
                                    type="text"
                                    placeholder="Cân nặng (kg)"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <label className="childRegistrationLabel">Họ tên người liên hệ</label>
                        <input
                            className="childRegistrationInput"
                            type="text"
                            placeholder="Họ tên người liên hệ"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            required
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
                        <button type="submit" className="childRegistrationButton">Đăng ký</button>
                    </div>
                </form>
            </div>
            <FloatingButtons />
            <Footer />
        </>
    );
};

export default ChildRegistrationPage;
