import React from "react";
import "./Handbook.scss"
import { Link } from "react-router-dom";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";

const VaccinationProcess: React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <div className="Handbook-container">
                <Link style={{ textDecoration: "none", color: "#2A388F" }} to="/homepage">Trang chủ</Link>
                <span className="separator"> » </span>
                <Link style={{ textDecoration: "none", color: "#2A388F" }} to="#">Cẩm Nang</Link>
                <span className="separator"> » </span>
                <span>Quy trình tiêm chủng</span>

                <div style={{ paddingTop: "20px" }} className="introductionTitle">
                    <h1 className="gt-title">Quy trình tiêm chủng</h1>
                </div>

                <div className="image-container">
                    <img
                        src="https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/tiem_vac_xin_thuong_quy_o_dau_cach_thuc_dang_ky_tiem_chung_va_quy_trinh_tiem_vac_xin_an_toan_1_eec60703b7.jpg"
                        alt="Khám sàng lọc trước khi tiêm chủng"/>
                </div>

                <div style={{ fontSize: "25px" }}>
                    <h3>Quy trình chi tiết</h3>
                    <form className="vaccination-form">
                        <ul style={{ lineHeight: "2" }}>
                            <li>
                                <strong>Bước 1: Đăng ký thông tin Khách hàng tại quầy lễ tân.</strong>
                                <div style={{paddingLeft: "16px"}}>
                                    Đối với Khách hàng mới chưa có thông tin tại VNVC: Lấy số thứ tự hoặc theo hướng dẫn
                                    tới quầy đăng ký thông tin để lập hồ sơ tiêm chủng, mã số Khách hàng.
                                </div>
                                <div style={{paddingLeft: "16px"}}>
                                    Đối với Khách hàng đã có thông tin tiêm chủng tại VNVC: Lấy số thứ tự hoặc theo
                                    hướng dẫn để tới quầy đăng ký khám trước tiêm.
                                </div>
                                <div style={{paddingLeft: "16px"}}>
                                    Đối với Khách hàng mua Gói vắc xin: Được ưu tiên phục vụ tại các khu vực/ vị trí riêng, Khách hàng vui lòng thông báo với nhân viên Lễ tân để được ưu tiên phục
                                    vụ.
                                </div>
                            </li>
                            <li>
                                <strong>Bước 2:</strong>
                                <div style={{paddingLeft: "16px"}}>
                                    Khám sàng lọc tại phòng khám, theo thứ tự trên màn hình hiển thị.
                                </div>
                            </li>
                            <li>
                                <strong>Bước 3:</strong>
                                <div style={{ paddingLeft: "16px" }}>
                                    Bác sĩ khám và chỉ định tiêm các vắc xin.
                                </div>
                            </li>
                            <li>
                                <strong>Bước 4:</strong>
                                <div style={{ paddingLeft: "16px" }}>
                                    Khách hàng nộp tiền tại quầy thu ngân (đối với khách hàng chưa nộp tiền).
                                </div>
                            </li>
                            <li>
                                <strong>Bước 5:</strong>
                                <div style={{ paddingLeft: "16px" }}>
                                    Tiêm vắc xin tại phòng tiêm, theo thứ tự trên màn hình hiển thị.
                                </div>
                            </li>
                            <li>
                                <strong>Bước 6:</strong>
                                <div style={{ paddingLeft: "16px" }}>
                                    Nghỉ ngơi tại khu vực theo dõi sau tiêm trong khoảng 30 phút.
                                </div>
                            </li>
                            <li>
                                <strong>Bước 7:</strong>
                                <div style={{ paddingLeft: "16px" }}>
                                    Nhân viên y tế kiểm tra sức khỏe cho người được tiêm và hướng dẫn chăm sóc.
                                </div>
                            </li>
                            <li>
                                <strong>Bước 8:</strong>
                                <div style={{ paddingLeft: "16px" }}>
                                    Hỗ trợ, tư vấn khách hàng về phản ứng sau tiêm hoặc các yêu cầu khác.
                                </div>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
            <Footer/>
            <FloatingButtons/>
        </>
    );
};

export default VaccinationProcess;