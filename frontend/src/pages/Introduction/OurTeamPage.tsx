import React from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import {Link} from "react-router-dom";
import "./Introduction.scss";

const OurTeamPage: React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <>
                <div className="introductionContainer">
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link>
                    <span className="separator"> » </span>
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/about-us"> Giới thiệu</Link>
                    <span className="separator"> » </span>
                    <span>Đội ngũ</span>

                    <div style={{paddingTop: "20px"}} className="introductionTitle">
                        <h1 className="gt-title">Đội ngũ</h1>
                    </div>

                    <p style={{textAlign: "center", paddingBottom: "10px"}}>
                    <span style={{color: "#000080", fontSize: "14pt"}}>
                        <strong>SIDE_EFFECT - TIÊN PHONG TRONG DỊCH VỤ TIÊM CHỦNG TRẺ EM</strong>
                    </span><br/>
                        <span style={{color: "#000080", fontSize: "14pt"}}><strong>AN TOÀN, UY TÍN, CHẤT LƯỢNG ĐƯỢC HÀNG CHỤC TRIỆU GIA ĐÌNH TIN TƯỞNG LỰA CHỌN!</strong></span>
                    </p>

                    <p className="introductionText">
                        Tại Side_Effect, chúng tôi tự hào sở hữu đội ngũ y bác sĩ và chuyên gia y tế có trình độ chuyên môn
                        cao, luôn đặt sự an toàn và hiệu quả lên hàng đầu. Mỗi bác sĩ tại Side_Effect không chỉ là những
                        người giàu kinh nghiệm trong lĩnh vực nhi khoa và miễn dịch học, mà còn thường xuyên tham gia các
                        chương trình đào tạo, hội thảo quốc tế để cập nhật kiến thức về vắc-xin và phương pháp tiêm chủng
                        tiên tiến nhất.
                    </p>

                    <p className="introductionText">
                        Sự khác biệt của Side_Effect đến từ việc xây dựng một quy trình tuyển chọn và đào tạo nghiêm ngặt.
                        Chúng tôi chỉ hợp tác với các bác sĩ, chuyên gia có chứng chỉ hành nghề được công nhận bởi các tổ
                        chức y tế hàng đầu thế giới. Không chỉ có chuyên môn vững vàng, họ còn được huấn luyện về kỹ năng
                        giao tiếp, tâm lý trẻ em và quy trình chăm sóc sau tiêm để mang đến trải nghiệm nhẹ nhàng, thoải mái
                        nhất cho cả bé và phụ huynh.
                    </p>

                    <p className="introductionText">
                        Mọi quy trình tiêm chủng tại Side_Effect đều được kiểm soát chặt chẽ theo tiêu chuẩn của Tổ chức Y
                        tế Thế giới (WHO) và Bộ Y tế, đảm bảo từ khâu bảo quản vắc-xin, chuẩn bị dụng cụ y tế, đến thao tác
                        tiêm đều tuân thủ quy trình an toàn tuyệt đối. Chúng tôi cũng áp dụng các công nghệ tiên tiến như hệ
                        thống theo dõi nhiệt độ tự động, đảm bảo vắc-xin luôn được bảo quản ở điều kiện lý tưởng để giữ
                        nguyên hiệu quả.
                    </p>

                    <p className="introductionText">
                        Bên cạnh đó, đội ngũ chuyên gia của Side_Effect không chỉ dừng lại ở việc thực hiện tiêm chủng mà
                        còn đóng vai trò là những người tư vấn tận tâm, đồng hành cùng phụ huynh trong suốt hành trình bảo
                        vệ sức khỏe cho con. Chúng tôi sẵn sàng giải đáp mọi thắc mắc về lịch tiêm, giúp phụ huynh lựa chọn
                        những loại vắc-xin phù hợp nhất với thể trạng của bé, cũng như hướng dẫn chi tiết cách theo dõi và
                        xử lý các phản ứng sau tiêm nếu có.
                    </p>

                    <p className="introductionText">
                        Với triết lý đặt trẻ em và gia đình lên hàng đầu, đội ngũ y bác sĩ của Side_Effect không ngừng cải
                        tiến dịch vụ, nâng cao tay nghề và ứng dụng công nghệ tiên tiến để mang đến trải nghiệm tiêm chủng
                        an toàn, hiện đại và toàn diện nhất.
                    </p>
                </div>
            </>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export default OurTeamPage;