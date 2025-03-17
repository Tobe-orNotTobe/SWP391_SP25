import React from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import { Link } from "react-router-dom";
import "./Handbook.scss";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";

const BeforeHandbook: React.FC = () => {
    return (
        <>
            <CustomerNavbar />
            <div className="Handbook-container">
                <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link>
                <span className="separator"> » </span>
                <Link style={{textDecoration: "none", color: "#2A388F"}} to="#">Cẩm Nang</Link>
                <span className="separator"> » </span>
                <span>Những Điều Cần Biết Trước Khi Tiêm</span>

                <div style={{paddingTop: "20px"}} className="introductionTitle">
                    <h1 className="gt-title">Những Điều Cần Biết Trước Khi Tiêm Chủng</h1>
                </div>

                <h3>Khám Sàn Lọc Trước Khi Tiêm Chủng</h3>
                <p>Để đảm bảo an toàn cho người tiêm chủng, tất cả các cơ sở tiêm chủng vắc xin COVID-19 đều phải thực
                    hiện khám sàng lọc trước khi tiêm theo hướng dẫn của Bộ Y tế.</p>

                <div className="image-container">
                    <img src="https://quoctesannhihaiphong.vn/wp-content/uploads/2020/11/San-Nhi.jpg" alt="Khám sàng lọc trước khi tiêm chủng"/>
                </div>

                <div className="info-box">
                    <h4>Bác sĩ sẽ khám như thế nào?</h4>
                    <p>
                        Việc khám sàng lọc trước tiêm chủng được thực hiện theo đúng quy định nghiêm ngặt của Bộ Y Tế
                        (Quyết định số 2470/QĐ-BYT ban hành ngày 14/6/2019), tập trung vào việc đánh giá tình trạng sức
                        khỏe chung của cơ thể bao gồm:
                    </p>
                    <ul>
                        <li>Đo thân nhiệt</li>
                        <li>Đánh giá tri giác</li>
                        <li>Quan sát nhịp thở, nghe phổi</li>
                        <li>Nghe tim</li>
                        <li>Phát hiện các bất thường khác</li>
                    </ul>
                </div>

                <h3>Hướng dẫn trước khi tiêm chủng</h3>

                <h4>Với trẻ nhỏ:</h4>
                <ul>
                    <li>Bố mẹ cần theo dõi tình trạng sức khỏe của bé để thông báo cho bác sĩ trong quá trình khám sàng
                        lọc trước khi tiêm.
                    </li>
                    <li>Nếu trẻ chưa đạt tiêu chuẩn về cân nặng hoặc có một trong các biểu hiện bệnh lý thì phải trì
                        hoãn lịch tiêm cho đến khi trẻ đủ cân nặng, hết sốt hoặc khỏi bệnh.
                    </li>
                    <li>Nếu trẻ có các phản ứng nặng sau tiêm ở các lần tiêm trước thì sẽ ngưng tiêm các mũi tiếp theo
                        (nếu có).
                    </li>
                    <li>Khi đưa trẻ đi tiêm chủng, bố mẹ (người chăm sóc) cần mang đầy đủ sổ/phiếu tiêm chủng và thông
                        báo đầy đủ tình trạng sức khỏe, các loại thuốc đang sử dụng để bác sĩ theo dõi.
                    </li>
                    <li>Bố mẹ nên tuân thủ lịch tiêm theo lứa tuổi đã được Bộ Y Tế khuyến cáo.</li>
                </ul>

                <h4>Với người lớn:</h4>
                <p>
                    Người lớn đi tiêm chủng cũng cần thông báo cho bác sĩ các vấn đề sức khỏe của mình bao gồm các bệnh
                    đã mắc, các loại thuốc – liệu pháp điều trị đang dùng, loại vắc xin đã tiêm gần đây (trong vòng 4
                    tuần) và phản ứng của cơ thể ở những lần tiêm chủng trước.
                </p>

            </div>
            <Footer/>
            <FloatingButtons/>
        </>
    );
};

export default BeforeHandbook;
