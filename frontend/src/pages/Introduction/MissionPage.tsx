import React from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import {Link} from "react-router-dom";
import MissionImage from "../../assets/introduction/Mission.png";
import "./Introduction.scss";

const MissionPage: React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <>
                <div className="introductionContainer">
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link>
                    <span className="separator"> » </span>
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/about-us"> Giới thiệu</Link>
                    <span className="separator"> » </span>
                    <span>Sứ mệnh</span>

                    <div style={{paddingTop: "20px"}} className="introductionTitle">
                        <h1 className="gt-title">Sứ mệnh</h1>
                    </div>

                    <p style={{textAlign: "center", paddingBottom: "10px"}}>
                    <span style={{color: "#000080", fontSize: "14pt"}}>
                        <strong>SIDE_EFFECT - TIÊN PHONG TRONG DỊCH VỤ TIÊM CHỦNG TRẺ EM</strong>
                    </span><br/>
                        <span style={{color: "#000080", fontSize: "14pt"}}><strong>AN TOÀN, UY TÍN, CHẤT LƯỢNG ĐƯỢC HÀNG CHỤC TRIỆU GIA ĐÌNH TIN TƯỞNG LỰA CHỌN!</strong></span>
                    </p>

                    <p className="introductionText">
                        Tại Side_Effect, chúng tôi tin rằng mỗi trẻ em đều xứng đáng có một khởi đầu khỏe mạnh và được bảo
                        vệ toàn diện trước các bệnh truyền nhiễm. Sứ mệnh của chúng tôi không chỉ là cung cấp dịch vụ tiêm
                        chủng mà còn tạo ra một hệ thống chăm sóc y tế hiện đại, giúp phụ huynh dễ dàng theo dõi, quản lý và
                        đảm bảo lịch trình tiêm chủng cho con em mình.
                    </p>

                    <p className="introductionText">
                        Chúng tôi cam kết đặt sự an toàn và sức khỏe của trẻ em lên hàng đầu. Mỗi mũi tiêm không chỉ là một
                        liều vắc-xin mà còn là lá chắn bảo vệ, mang đến sự an tâm cho gia đình và góp phần xây dựng một cộng
                        đồng khỏe mạnh. Để hiện thực hóa điều này, Side_Effect luôn đảm bảo quy trình tiêm chủng đạt tiêu
                        chuẩn cao nhất, từ việc tuyển chọn vắc-xin đến quy trình lưu trữ, vận chuyển và thực hiện tiêm.
                    </p>

                    <p className="introductionText">
                        Bên cạnh đó, chúng tôi không ngừng ứng dụng công nghệ tiên tiến để nâng cao trải nghiệm người dùng
                        và tối ưu hóa hiệu quả của hệ thống tiêm chủng. Công nghệ dữ liệu lớn (Big Data) giúp phân tích và
                        nhắc lịch tiêm tự động, trí tuệ nhân tạo (AI) hỗ trợ cá thể hóa lộ trình tiêm phù hợp với từng trẻ,
                        và hồ sơ sức khỏe điện tử (EHR) giúp theo dõi toàn diện lịch sử tiêm chủng.
                    </p>

                    <p className="introductionText">
                        Sứ mệnh của Side_Effect không dừng lại ở việc bảo vệ sức khỏe cá nhân mà còn mở rộng ra tầm nhìn
                        cộng đồng. Chúng tôi mong muốn góp phần nâng cao nhận thức về tầm quan trọng của tiêm chủng, giúp xã
                        hội chủ động phòng ngừa dịch bệnh, hướng tới một tương lai nơi tất cả trẻ em đều được tiếp cận dịch
                        vụ y tế chất lượng cao.
                    </p>

                    <p className="introductionText">
                        Với tinh thần không ngừng đổi mới và phát triển, chúng tôi sẽ tiếp tục mở rộng hệ thống, hợp tác với
                        các tổ chức y tế và nghiên cứu những phương pháp tiên tiến nhất để nâng cao hiệu quả của quá trình
                        tiêm chủng. Side_Effect không chỉ là một cơ sở tiêm chủng mà còn là một đối tác đồng hành cùng gia
                        đình trên hành trình bảo vệ sức khỏe cho thế hệ tương lai.
                    </p>

                    <figure style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}>
                        <img src={MissionImage} width="800" height="534"/>
                        <figcaption id="caption-attachment-84785" className="wp-caption-text"
                                    style={{fontStyle: "italic", fontSize: "17px"}}> Sứ mệnh của chúng tôi là tạo ra một hệ thống y tế chăm sóc hiện đại.
                        </figcaption>
                    </figure>

                </div>
            </>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export default MissionPage;