import React from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import "./TermPage.scss";
import { Link } from "react-router-dom";

const TermPage: React.FC = () => {
    return (
        <>
            <CustomerNavbar />
            <div className="term-container-wrapper">
                <div className="breadcrumb">
                    <Link to="/homepage">Trang chủ</Link>
                    <span className="separator">»</span>
                    <span className="last">Điều Khoản Và Dịch Vụ</span>
                </div>

                <div className="term-title">
                    <h1 className="gt-title">Điều Khoản Và Dịch Vụ</h1>
                </div>

                <div className="term-content">
                    <h2>1. Chính sách bảo mật & bảo vệ tài khoản</h2>
                    <p>Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt để đảm bảo
                        tính bảo mật cao.</p>
                    <p>Liên kết đặt lại mật khẩu có hiệu lực trong vòng 15 phút. Sau thời gian này, bạn cần yêu cầu liên
                        kết mới.</p>
                    <p>Chỉ chủ tài khoản hoặc quản trị viên có quyền cập nhật thông tin cá nhân và thông tin liên
                        hệ.</p>
                    <p>Đăng nhập không thành công 5 lần liên tiếp sẽ khóa tài khoản tạm thời trong 30 phút.</p>
                    <p>Thông tin cá nhân của bạn được mã hóa và bảo vệ theo tiêu chuẩn bảo mật ngành y tế.</p>

                    <div className="policy-section">
                        <h3>Lưu ý quan trọng:</h3>
                        <p>Không chia sẻ mật khẩu hoặc thông tin đăng nhập với bất kỳ ai, kể cả nhân viên phòng
                            khám.</p>
                        <p>Đăng xuất khỏi tài khoản sau khi sử dụng trên các thiết bị công cộng.</p>
                    </div>

                    <h2>2. Chính sách dịch vụ & đặt lịch</h2>
                    <p>Hệ thống chỉ hiển thị các dịch vụ đang hoạt động và có sẵn để đặt lịch.</p>
                    <p>Cho phép lọc và sắp xếp theo tên dịch vụ, danh mục, giá, trạng thái sẵn có để dễ dàng tìm
                        kiếm.</p>
                    <p>Người dùng có thể hủy lịch hẹn ít nhất 24 giờ trước thời điểm hẹn và nhận thông báo xác nhận.</p>
                    <p>Lịch hẹn sẽ được xác nhận qua email và tin nhắn SMS trong vòng 2 giờ sau khi đặt.</p>
                    <p>Đặt lịch cho trẻ dưới 12 tuổi yêu cầu thông tin đầy đủ của người giám hộ.</p>

                    <div className="policy-section">
                        <h3>Quy định về thay đổi lịch hẹn:</h3>
                        <p>Hủy lịch hẹn trong vòng 24 giờ trước giờ hẹn có thể phải chịu phí hủy 10%.</p>
                        <p>Đổi lịch hẹn được phép tối đa 2 lần cho mỗi lần đặt lịch.</p>
                    </div>

                    <h2>3. Chính sách phản hồi & đánh giá</h2>
                    <p>Phản hồi phải bao gồm loại phản hồi, bình luận chi tiết và đánh giá từ 1-5 sao.</p>
                    <p>Đánh giá phải là số nguyên từ 1 đến 5, với 5 là mức độ hài lòng cao nhất.</p>
                    <p>Mỗi người dùng chỉ có thể đánh giá một dịch vụ một lần sau khi đã sử dụng.</p>
                    <p>Phản hồi tiêu cực sẽ được chuyển đến bộ phận quản lý để xem xét và phản hồi trong 48 giờ.</p>
                    <p>Chúng tôi khuyến khích phản hồi chi tiết để cải thiện chất lượng dịch vụ.</p>

                    <h2>4. Chính sách tiêm chủng & hồ sơ y tế</h2>
                    <p>Hệ thống chỉ hiển thị các loại vắc-xin phù hợp với độ tuổi và lịch sử tiêm chủng của trẻ.</p>
                    <p>Mỗi cuộc hẹn chỉ có thể có một hồ sơ tiêm chủng để đảm bảo tính chính xác của thông tin.</p>
                    <p>Bác sĩ chỉ có thể ghi nhận tiêm chủng cho lịch hẹn họ được giao phụ trách.</p>
                    <p>Hồ sơ tiêm chủng được lưu trữ bảo mật và có thể xuất ra định dạng PDF khi cần thiết.</p>
                    <p>Phụ huynh sẽ nhận được nhắc nhở tự động về lịch tiêm chủng tiếp theo cho trẻ.</p>

                    <div className="policy-section">
                        <h3>Lưu ý về bảo mật hồ sơ y tế:</h3>
                        <p>Hồ sơ y tế được mã hóa và chỉ người dùng, bác sĩ điều trị và quản trị viên được ủy quyền mới
                            có quyền truy cập.</p>
                        <p>Xuất trình giấy tờ tùy thân khi yêu cầu cung cấp bản sao hồ sơ y tế.</p>
                    </div>

                    <h2>5. Điều kiện sử dụng hệ thống</h2>
                    <p>Người dùng phải tuân thủ các chính sách bảo mật và điều khoản dịch vụ đã được quy định.</p>
                    <p>Hệ thống có quyền hạn chế hoặc chặn quyền truy cập nếu phát hiện vi phạm quy định sử dụng.</p>
                    <p>Không được sử dụng hệ thống cho mục đích bất hợp pháp hoặc làm gián đoạn dịch vụ.</p>
                    <p>Thông tin đăng ký phải chính xác, đầy đủ và được cập nhật khi có thay đổi.</p>
                    <p>Sử dụng dịch vụ đồng nghĩa với việc chấp nhận các điều khoản và chính sách của chúng tôi.</p>
                </div>
            </div>
            <FloatingButtons/>
            <Footer/>
        </>
    );
};

export default TermPage;