import React from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import {Link} from "react-router-dom";
import VisionImage from "../../assets/introduction/Vision.png";
import "./Introduction.scss";

const VisionPage: React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <>
                <div className="introductionContainer">
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link>
                    <span className="separator"> » </span>
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/about-us"> Giới thiệu</Link>
                    <span className="separator"> » </span>
                    <span>Tầm nhìn</span>

                    <div style={{paddingTop: "20px"}} className="introductionTitle">
                        <h1 className="gt-title">Tầm nhìn</h1>
                    </div>

                    <p style={{textAlign: "center", paddingBottom: "10px"}}>
                    <span style={{color: "#000080", fontSize: "14pt"}}>
                        <strong>SIDE_EFFECT - TIÊN PHONG TRONG DỊCH VỤ TIÊM CHỦNG TRẺ EM</strong>
                    </span><br/>
                        <span style={{color: "#000080", fontSize: "14pt"}}><strong>AN TOÀN, UY TÍN, CHẤT LƯỢNG ĐƯỢC HÀNG CHỤC TRIỆU GIA ĐÌNH TIN TƯỞNG LỰA CHỌN!</strong></span>
                    </p>

                    <p className="introductionText">
                        Với tầm nhìn dài hạn, Side_Effect đặt mục tiêu xây dựng một nền tảng tiêm chủng thông minh, an toàn và
                        tiện lợi nhất, mang lại trải nghiệm tiêm chủng vượt trội cho mọi gia đình. Chúng tôi không ngừng đổi
                        mới, nghiên cứu và ứng dụng các công nghệ tiên tiến để nâng cao chất lượng dịch vụ, đảm bảo rằng mỗi
                        trẻ em đều được tiếp cận với những phương pháp tiêm chủng tiên tiến nhất.
                    </p>

                    <p className="introductionText">
                        Side_Effect đang từng bước mở rộng hệ thống cơ sở trên toàn quốc, hướng tới việc đưa dịch vụ tiêm
                        chủng hiện đại, tiêu chuẩn cao đến gần hơn với tất cả các gia đình, bất kể khu vực địa lý. Việc phát
                        triển các trung tâm tiêm chủng đạt chuẩn quốc tế không chỉ giúp nâng cao độ phủ của dịch vụ mà còn tối
                        ưu hóa quy trình tiêm chủng, giảm tải cho các cơ sở y tế hiện tại.
                    </p>

                    <p className="introductionText">
                        Song song với đó, Side_Effect đầu tư mạnh mẽ vào nghiên cứu và phát triển những công nghệ đột phá, mở
                        ra những hướng đi mới trong lĩnh vực tiêm chủng. Chúng tôi đang triển khai các dự án theo dõi sức khỏe
                        trẻ bằng cảm biến y tế, giúp giám sát phản ứng sau tiêm theo thời gian thực, cung cấp dữ liệu chính
                        xác để bác sĩ có thể can thiệp kịp thời nếu cần thiết. Bên cạnh đó, việc ứng dụng trí tuệ nhân tạo
                        trong phân tích dữ liệu di truyền giúp đề xuất phác đồ tiêm chủng cá nhân hóa, đảm bảo rằng mỗi trẻ em
                        không chỉ được tiêm đầy đủ mà còn phù hợp với thể trạng riêng biệt của mình.
                    </p>

                    <p className="introductionText">
                        Với những bước tiến này, Side_Effect cam kết tiếp tục phát triển và hoàn thiện hệ thống, tạo ra một
                        môi trường tiêm chủng hiện đại, nơi mà sự an toàn, chính xác và tiện lợi được đặt lên hàng đầu, giúp
                        phụ huynh hoàn toàn yên tâm khi đồng hành cùng chúng tôi trên hành trình bảo vệ sức khỏe của con mình.
                    </p>

                    <figure style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}>
                        <img src={VisionImage} width="800" height="534"/>
                        {/*<figcaption id="caption-attachment-84785" className="wp-caption-text"*/}
                        {/*            style={{fontStyle: "italic", fontSize: "17px"}}> Side_Effect đặt mục tiêu xây dựng một nền tảng tiêm chủng thông minh, an toàn và*/}
                        {/*    tiện lợi nhất.*/}
                        {/*</figcaption>*/}
                    </figure>

                </div>
            </>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export default VisionPage;