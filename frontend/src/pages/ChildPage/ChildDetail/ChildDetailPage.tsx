import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../../components/Footer/Footer.tsx";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import React from "react";
import {useLocation} from "react-router-dom";
import "../ChildPage.scss"
import {useChildDetail} from "../../../hooks/useChild.ts";
import {IoMdArrowRoundBack} from "react-icons/io";
import {useNavigate} from "react-router-dom";

const ChildDetailPage: React.FC = () => {

    const location = useLocation();
    const childId = location.state?.childId;
    const { childDetail, loading, error} = useChildDetail(childId);
    const navigate = useNavigate();

    return (
        <>
            <CustomerNavbar/>
            <div className={"childDetailContainer"}>
                {/*<h1>Hello {childId}</h1>*/}
                <span className={"backButton"} onClick={() => {
                    navigate("/my-childs")
                }}>
                    <IoMdArrowRoundBack/>
                    Back
                </span>
                <h2 className={"title"}>Thông tin trẻ</h2> <br/>
                {loading && ("Loading...")}
                {error && ("Dã xảy ra lỗi.")}
                {childDetail && (
                    <div style={{display: "flex"}}>
                        <div style={{width:'40%', padding: "40px", paddingRight: "40px", borderRight: "2px solid #ddd"}}>
                            <img className={"childImage"} src={childDetail.imageUrl} alt={"nihaoma"}/>
                        </div>
                        <div style={{paddingLeft: "40px", padding: "40px", width: "60%"}}>
                            <p className={"childP"}>
                                <strong style={{paddingRight: "5px"}}>Họ và tên:</strong>{childDetail.fullName}
                            </p>
                            <p className={"childP"}>
                                <strong style={{paddingRight: "5px"}}>Giới tính: </strong> {childDetail.gender === "Male" ? ("Nam") : ("Nữ")}
                            </p>
                            <p className={"childP"}>
                                <strong style={{paddingRight: "5px"}}>Ngày sinh: </strong>
                                {new Date(childDetail.dateOfBirth).toLocaleDateString()}
                            </p>
                            <p className={"childP"}>
                                <strong style={{paddingRight: "5px"}}>Chiều cao: </strong>{childDetail.height} cm
                            </p>
                            <p className={"childP"}>
                                <strong style={{paddingRight: "5px"}}>Cân nặng: </strong>{childDetail.weight} kg
                            </p>
                            <p className={"childP"}>
                                <strong style={{paddingRight: "5px"}}>Lịch sử y tế: </strong>{childDetail.medicalHistory === "yes" ? ("Có") : ("Không")}
                            </p>
                            <p className={"childP"}>
                                <strong style={{paddingRight: "5px"}}>Mối quan hệ: </strong>{childDetail.relationToUser}
                            </p>
                        </div>
                    </div>
                )}

            </div>
            <FloatingButtons/>
            <Footer/>
        </>
    );
};

export default ChildDetailPage