import React from "react";
import { Link } from "react-router-dom";
import { useVaccineDetailById } from "./useVaccineDetail.ts";
import { Card, Spin} from "antd";
import Footer from "../../../components/Footer/Footer.tsx";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import "./VaccineDetailPage.scss";

const VaccineDetailPage: React.FC = () => {
  const { vaccine, loading } = useVaccineDetailById();

  if (loading) return (
      <div className="loading-container">
        <Spin tip="Đang tải dữ liệu..." size="large" />
      </div>
  );

  return (
      <>
        <CustomerNavbar />
        <div className="vaccineDetailContainer">
          <div className="vaccineDetailTitle">
            <Link to="/homepage">Trang chủ</Link>
            <span className="separator">»</span>
            <span>Thông tin sản phẩm vaccine</span>
            <span className="separator">»</span>
            <span className="last">Vắc xin {vaccine?.name}</span>
          </div>

          <div className="vaccine-Title">
            <h1 className="gt-vaccine-title ">Thông tin chi tiết của vaccine {vaccine?.name}</h1>
          </div>

          <div className="vaccineDetailContent">
            <div className="vaccineDetailLeft">
              <Card className="vaccine-left-card">
                <img
                    src={`/images/${vaccine?.image}`}
                    alt={vaccine?.name}
                    className="vaccineImage"
                />
                <h1>Vắc Xin {vaccine?.name}</h1>

                <p>
                  <strong>Trạng thái:</strong>
                  <span className={vaccine?.status ? "status-available" : "status-unavailable"}>
                  {vaccine?.status ? "Có sẵn" : "Không có sẵn"}
                </span>
                </p>

                <p>
                  <strong>Cần thiết:</strong>
                  {vaccine?.isNecessary ? "Có" : "Không"}
                </p>

                <p>
                  <strong>Giá:</strong>
                  <span style={{ color: "#2A388F", fontWeight: "600" }}>
                  {vaccine?.price.toLocaleString()} VND
                </span>
                </p>
              </Card>
            </div>

            <div className="vaccineDetailRight">
              <Card
                  className="vaccineDetailCard"
                  title="Thông tin chi tiết"
              >
                <div className="numbered-detail-section">
                  <div className="section-number">1</div>
                  <strong>Nhà sản xuất:</strong>
                  <div className="detail-content">{vaccine?.manufacturer}</div>
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">2</div>
                  <strong>Vị trí tiêm:</strong>
                  <div className="detail-content">{vaccine?.injectionSite}</div>
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">3</div>
                  <strong>Số mũi tiêm:</strong>
                  <div className="detail-content">{vaccine?.injectionsCount}</div>
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">4</div>
                  <strong>Bảo quản:</strong>
                  <div className="detail-content">{vaccine?.preserve}</div>
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">5</div>
                  <strong>Mô tả:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccine?.description ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">6</div>
                  <strong>Phòng bệnh:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccine?.diseasePrevented ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">7</div>
                  <strong>Ghi chú:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccine?.notes ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">8</div>
                  <strong>Phản ứng phụ:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccine?.sideEffect ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">9</div>
                  <strong>Tương tác thuốc:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccine?.vaccineInteractions ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">10</div>
                  <strong>Tác dụng không mong muốn:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccine?.undesirableEffects ?? ""}}
                  />
                </div>
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