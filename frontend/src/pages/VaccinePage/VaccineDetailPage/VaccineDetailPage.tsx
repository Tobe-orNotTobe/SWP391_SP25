import React from "react";
import {Link, useParams} from "react-router-dom";
import {useVaccineDetailById} from "../../../hooks/useVaccine.ts";
import { Card, Spin} from "antd";
import Footer from "../../../components/Footer/Footer.tsx";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import "./VaccineDetailPage.scss";

const VaccineDetailPage: React.FC = () => {

  const {id} = useParams();
  const {vaccineDetail, loading} = useVaccineDetailById(Number(id));
  const {vaccineDetail: VaccineDetailParent} = useVaccineDetailById(Number(vaccineDetail?.isParentId));

  if (loading) return (
      <div className="loading-container">
        <div className="loading-wrapper">
          <Spin tip="Đang tải dữ liệu..." size="large" />
        </div>
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
            <span className="last">Vắc xin {vaccineDetail?.name}</span>
          </div>

          <div className="vaccine-Title">
            <h1 className="gt-vaccine-title ">Thông tin chi tiết của vaccine {vaccineDetail?.name}</h1>
          </div>

          <div className="vaccineDetailContent">
            <div className="vaccineDetailLeft">
              <Card className="vaccine-left-card">
                <img
                    src={`${vaccineDetail?.image}`}
                    alt={vaccineDetail?.name}
                    className="vaccineImage"
                />
                <h1>Vắc Xin {vaccineDetail?.name}</h1>

                <p>
                  <strong>Trạng thái:</strong>
                  <span className={vaccineDetail?.status ? "status-available" : "status-unavailable"}>
                      {vaccineDetail?.status ? "Có sẵn" : "Không có sẵn"}
                    </span>
                </p>

                <p>
                  <strong>Cần thiết:</strong>
                  {vaccineDetail?.isNecessary ? "Có" : "Không"}
                </p>
                {VaccineDetailParent && (
                    <p>
                      <strong style={{color: "#2A388F"}}>Cần tiêm trước Vaccine {VaccineDetailParent?.name}</strong>
                    </p>
                )}
                <p>
                  <strong>{vaccineDetail?.isNecessary ? "Được" : "Không"}</strong> chích kèm các vaccine khác
                </p>

                <p>
                  <strong>Số mũi tiêm: </strong> {vaccineDetail?.injectionsCount}
                </p>

                <p>
                  <strong>Giá:</strong>
                  <span style={{color: "#2A388F", fontWeight: "600"}}>
                        {vaccineDetail?.price.toLocaleString()} VND
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
                  <div className="detail-content">{vaccineDetail?.manufacturer}</div>
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">2</div>
                  <strong>Vị trí tiêm:</strong>
                  <div className="detail-content">{vaccineDetail?.injectionSite}</div>
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">4</div>
                  <strong>Bảo quản:</strong>
                  <div className="detail-content">{vaccineDetail?.preserve}</div>
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">5</div>
                  <strong>Mô tả:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccineDetail?.description ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">6</div>
                  <strong>Phòng bệnh:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccineDetail?.diseasePrevented ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">7</div>
                  <strong>Ghi chú:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccineDetail?.notes ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">8</div>
                  <strong>Phản ứng phụ:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccineDetail?.sideEffect ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">9</div>
                  <strong>Tương tác thuốc:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccineDetail?.vaccineInteractions ?? ""}}
                  />
                </div>

                <div className="numbered-detail-section">
                  <div className="section-number">10</div>
                  <strong>Tác dụng không mong muốn:</strong>
                  <div className="detail-content"
                       dangerouslySetInnerHTML={{__html: vaccineDetail?.undesirableEffects ?? ""}}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>

        <FloatingButtons/>
        <Footer/>
      </>
  );
};

export default VaccineDetailPage;