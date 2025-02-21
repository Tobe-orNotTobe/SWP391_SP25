import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import React, {ChangeEvent, useState} from "react";
import Select from "react-select";
import { FaUpload } from "react-icons/fa";
import "./ChildRegistration.scss"

const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" }
];

const relationOptions = [
    { value: "child", label: "Con" },
    { value: "grandchild", label: "Cháu" },
    { value: "younger_sibling", label: "Em" }
];

const ChildRegistrationPage : React.FC = () =>{

    const [selectedGender, setSelectedGender] = useState<{ value: string; label: string } | null>(null);
    const [selectedRelation, setSelectedRelation] = useState<{ value: string; label: string } | null>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Xử lý khi chọn ảnh
    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh
            setSelectedImage(imageUrl);
        }
    };

    return(
        <>
            <CustomerNavbar/>
            <div className="childRegistrationContainer">
                <h2 className="childRegistrationTitle">Đăng ký trẻ</h2>
                <form className="childRegistrationForm">
                    <div className="childRegistrationFormColumn">

                        {/* Khu vực tải ảnh lên */}
                        <label className="childRegistrationLabel">Ảnh của trẻ</label>
                        <div
                            className="imageUploadContainer"
                            onClick={() => document.getElementById("imageUpload")?.click()}
                        >
                            {selectedImage ? (
                                <img src={selectedImage} alt="Uploaded" className="uploadedImage"/>
                            ) : (
                                <FaUpload className="uploadIcon"/>
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
                        <input className="childRegistrationInput" type="text" placeholder="Họ tên trẻ" required/>

                        <label className="childRegistrationLabel">Ngày sinh trẻ</label>
                        <input className="childRegistrationInput" type="date" required/>

                        <label className="childRegistrationLabel">Giới tính</label>
                        <Select
                            options={genderOptions}
                            value={selectedGender}
                            onChange={setSelectedGender}
                            placeholder="Chọn giới tính"
                            className="childRegistrationSelect"
                        />

                        <label className="childRegistrationLabel">Họ tên người liên hệ</label>
                        <input className="childRegistrationInput" type="text" placeholder="Họ tên người liên hệ"
                               required/>

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
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export default ChildRegistrationPage