import { useEffect, useState } from "react";
import { apiGetAllDoctors } from "../../apis/apiAdmin";
import "./DoctorList.scss";
import { Doctor } from "../../interfaces/Doctor";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const loadDoctors = async () => {
      const doctorList = await apiGetAllDoctors();
      console.log(doctorList.result);
      setDoctors(doctorList.result);
    };
    loadDoctors();
  }, []);

  return (
    <div className="wraper-doctorList">
      <h1 className="doctorListtitle">Danh sách bác sĩ</h1>
      <div className="doctor-grid">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <Avatar
                size={64}
                icon={<UserOutlined />}
                //src={doctor?.imageUrl}
                alt={doctor.fullName}
                className="avatar"
              />
              <h2 className="doctor-name">{doctor.fullName}</h2>
              <p className="username">@{doctor.userName}</p>
              <p className="email">{doctor.email}</p>
              <p className="phone">{doctor.phoneNumber}</p>
              <p className="address">{doctor.address}</p>
              <span
                className={`status ${doctor.isActive ? "active" : "inactive"}`}
              >
                {doctor.isActive ? "Hoạt động" : "Ngưng hoạt động"}
              </span>
              <button className="detail-btn">Xem chi tiết</button>
            </div>
          ))
        ) : (
          <p className="no-doctor">Không có bác sĩ nào.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
