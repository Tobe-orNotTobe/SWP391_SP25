import React from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer.tsx";
import "./Handbook.scss";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";

const HandBookAfter: React.FC = () => {
    return (
        <>
            <CustomerNavbar />
            <div className="Handbook-container">
                <Link style={{ textDecoration: "none", color: "#2A388F" }} to="/homepage">Trang chủ</Link>
                <span className="separator"> » </span>
                <Link style={{ textDecoration: "none", color: "#2A388F" }} to="#">Cẩm Nang</Link>
                <span className="separator"> » </span>
                <span>Những Điều Cần Biết Sau Khi Tiêm Chủng</span>

                <div style={{ paddingTop: "20px" }} className="introductionTitle">
                    <h1 className="gt-title">Những điều cần biết sau khi tiêm chủng</h1>
                </div>

                <div className="image-container">
                    <img
                        src="https://tanlongmed.vn/wp-content/uploads/2022/08/phan-loai-vac-xin.png"
                        alt="Khám sàng lọc trước khi tiêm chủng"
                    />
                </div>

                <div className="content" style={{ fontSize: "18px", padding: "20px" }}>
                    <h3>Theo dõi sau tiêm chủng</h3>
                    <ul>
                        <li><strong>Ở lại cơ sở y tế 30 phút:</strong> Nhân viên y tế theo dõi phản ứng sau tiêm.</li>
                        <li><strong>Theo dõi tại nhà ít nhất 24 - 48 giờ:</strong> Phát hiện sớm dấu hiệu bất thường.</li>
                    </ul>

                    <h3>Các phản ứng thường gặp</h3>
                    <ul>
                        <li>Đau, sưng, đỏ tại vị trí tiêm.</li>
                        <li>Sốt nhẹ, mệt mỏi, đau đầu.</li>
                        <li>Đau cơ, đau khớp, ớn lạnh.</li>
                    </ul>
                    <p><strong>Cách xử lý:</strong> Uống đủ nước, nghỉ ngơi, chườm lạnh nếu đau, dùng thuốc hạ sốt nếu sốt cao.</p>

                    <h3>Khi nào cần đi khám ngay?</h3>
                    <ul>
                        <li>Sốt cao trên 39°C, co giật, bất tỉnh.</li>
                        <li>Phát ban, khó thở, đau tức ngực.</li>
                        <li>Sưng phù, tê bì tay chân kéo dài.</li>
                    </ul>
                    <p><strong>Hãy đến ngay cơ sở y tế nếu có dấu hiệu nghiêm trọng.</strong></p>

                    <h3>Chế độ sinh hoạt sau tiêm</h3>
                    <ul>
                        <li>Uống nhiều nước, ăn uống đầy đủ dinh dưỡng.</li>
                        <li>Hạn chế rượu bia, chất kích thích.</li>
                        <li>Tránh vận động mạnh trong 1-2 ngày đầu.</li>
                    </ul>

                    <h3>Lưu ý về lịch tiêm nhắc lại</h3>
                    <ul>
                        <li>Một số loại vắc xin cần tiêm nhắc lại để đảm bảo hiệu quả bảo vệ.</li>
                        <li>Theo dõi lịch tiêm và đến đúng hẹn theo hướng dẫn của bác sĩ.</li>
                    </ul>

                    <p><strong>Kết luận:</strong> Việc tiêm chủng giúp bảo vệ sức khỏe, nhưng cần theo dõi sát sao để đảm bảo an toàn.</p>
                </div>
            </div>
            <Footer />
            <FloatingButtons/>
        </>
    );
};

export default HandBookAfter;