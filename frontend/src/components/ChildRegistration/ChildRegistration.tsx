import React, { useState } from "react";
import Select from "react-select";
import "./ChildRegistration.scss";

const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" }
];

const relationOptions = [
    { value: "child", label: "Con" },
    { value: "grandchild", label: "Cháu" },
    { value: "younger_sibling", label: "Em" }
    // { value: "grandfather", label: "Ông" },
    // { value: "grandmother", label: "Bà" },
    // { value: "aunt", label: "Cô/Dì/Thím" },
    // { value: "uncle", label: "Bác/Chú" }
];


const ChildRegistration: React.FC = () => {
    const [selectedGender, setSelectedGender] = useState<{ value: string; label: string } | null>(null);
    const [selectedRelation, setSelectedRelation] = useState<{ value: string; label: string } | null>(null);

    return (
        <div className="childRegistrationContainer">
            <h2 className="childRegistrationTitle">Đăng ký trẻ</h2>
            <form className="childRegistrationForm">
                <div className="childRegistrationFormColumn">
                    <label className="childRegistrationLabel">Họ tên trẻ</label><br/>
                    <input className="childRegistrationInput" type="text" placeholder="Họ tên trẻ" required/>
                    <br/>

                    <label className="childRegistrationLabel">Ngày sinh trẻ</label><br/>
                    <input className="childRegistrationInput" type="date" required/>
                    <br/>

                    <label className="childRegistrationLabel">Giới tính</label><br/>
                    <Select
                        options={genderOptions}
                        value={selectedGender}
                        onChange={(selectedOption) => setSelectedGender(selectedOption)}
                        placeholder="Chọn giới tính"
                        className="childRegistrationSelect"
                        menuPortalTarget={document.body} // Fix lỗi hiển thị trong một số trường hợp
                        styles={{
                            menu: (provided) => ({
                                ...provided,
                                opacity: 0,
                                animation: "fadeIn 0.3s ease-in-out forwards"
                            }),
                            option: (provide, state) => ({
                                ...provide,
                                backgroundColor: state.isSelected ? "#2A388F" : state.isFocused ? "#f0f0f0" : "white", // Màu vàng khi đã chọn
                                color: state.isSelected ? "white" : "#333", // Màu chữ
                                cursor: "pointer",
                            })
                        }}
                    />
                </div>
                <div className="childRegistrationFormColumn">
                    <label className="childRegistrationLabel">Họ tên người liên hệ</label><br/>
                    <input className="childRegistrationInput" type="text" placeholder="Họ tên người liên hệ" required/><br/>

                    <label className="childRegistrationLabel">Mối quan hệ với người tiêm</label><br/>
                    <Select
                        options={relationOptions}
                        value={selectedRelation}
                        onChange={(selectedOption) => setSelectedRelation(selectedOption)}
                        placeholder={"Chọn mối quan hệ với người dùng"}
                        className="childRegistrationSelect"
                        menuPortalTarget={document.body}
                        styles={{
                            menu: (provided) => ({
                                ...provided,
                                opacity: 0,
                                animation: "fadeIn 0.3s ease-in-out forwards"
                            }),
                            option: (provide, state) => ({
                                ...provide,
                                backgroundColor: state.isSelected ? "#2A388F" : state.isFocused ? "#f0f0f0" : "white", // Màu vàng khi đã chọn
                                color: state.isSelected ? "white" : "#333", // Màu chữ
                                cursor: "pointer",
                            })
                        }}
                    />


                    {/*<input className="childRegistrationInput" type="text" placeholder="Ví dụ: Bố, Mẹ, Anh, Chị..." required/><br/>*/}
                </div>

                <div className="childRegistrationButtonContainer">
                    <button type="submit" className="childRegistrationButton">Đăng ký</button>
                </div>
            </form>
        </div>
    );
}

export default ChildRegistration;
