import React from "react";
import { Link } from "react-router-dom";
import { useVaccineDetailById } from "./useVaccineDetail.ts";
import { Card, Spin, Alert } from "antd";
import Footer from "../../../components/Footer/Footer.tsx";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import "./VaccineDetailPage.scss";

const VaccineDetailPage: React.FC = () => {
  const { vaccine, loading, error } = useVaccineDetailById();

  if (loading) return <Spin tip="Đang tải dữ liệu..." />;
  if (error) return <Alert message="Lỗi" description={error} type="error" showIcon />;

  return (
    <>
      <CustomerNavbar />
      <div className="vaccineDetailContainer">
        <span className="vaccineDetailTitle">
          <Link style={{ textDecoration: "none", color: "#2A388F" }} to="/homepage">Trang chủ</Link>
          <span className="separator"> » </span>
          <span className="last">Thông tin sản phẩm vaccine</span>
          <span className="separator"> » </span>
          <span className="last">{vaccine?.name}</span>
        </span>

        <div className="vaccineDetailContent">
          <div className="vaccineDetailLeft">
            <img src={`/images/${vaccine?.image}`} alt={vaccine?.name} className="vaccineImage" />
            <h1>{vaccine?.name}</h1>
            <p className="vaccineStatus">Trạng thái: {vaccine?.status ? "Có" : "Không"}</p>
            <p className="vaccineStatus">Cần thiết: {vaccine?.isNecessary ? "Có" : "Không"}</p>
            <p className="vaccinePrice">Giá: {vaccine?.price.toLocaleString()} VND</p>
          </div>

          <div className="vaccineDetailRight">
            <Card className="vaccineDetailCard">
              <h2>Thông tin chi tiết</h2>
              <p><strong>Mô tả:</strong> {vaccine?.description}</p>
              <p><strong>Nhà sản xuất:</strong> {vaccine?.manufacturer}</p>
              <p><strong>Phòng bệnh:</strong> {vaccine?.diseasePrevented}</p>
              <p><strong>Vị trí tiêm:</strong> {vaccine?.injectionSite}</p>
              <p><strong>Ghi chú:</strong> {vaccine?.notes}</p>
              <p><strong>Bảo quản:</strong> {vaccine?.preserve}</p>
              <p><strong>Số mũi tiêm:</strong> {vaccine?.injectionsCount}</p>
              <p><strong>Phản ứng phụ:</strong> {vaccine?.sideEffect}</p>
              <p><strong>Tương tác thuốc:</strong> {vaccine?.vaccineInteractions}</p>
              <p><strong>Tác dụng không mong muốn:</strong> {vaccine?.undesirableEffects}</p>
            </Card>
          </div>
        </div>
      </div>

      <FloatingButtons />
      <Footer />
    </>
  );
};

export default VaccineDetailPage;
