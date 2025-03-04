import { useEffect, useState } from "react";
import { apiGetAllDoctors } from "../../apis/apiAdmin"; // Đường dẫn đúng với file API
import "./DoctorList.scss"; // Import CSS thuần

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const loadDoctors = async () => {
      const doctorList = await apiGetAllDoctors();
      setDoctors(doctorList);
    };
    loadDoctors();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Danh sách bác sĩ</h1>
      <div className="doctor-grid">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <img
                src={doctor.imageUrl || "/default-avatar.png"}
                alt={doctor.fullName}
                className="avatar"
              />
              <h2 className="doctor-name">{doctor.fullName}</h2>
              <p className="username">@{doctor.userName}</p>
              <p className="email">{doctor.email}</p>
              <p className="phone">{doctor.phoneNumber}</p>
              <p className="address">{doctor.address}</p>
              <span className={`status ${doctor.isActive ? "active" : "inactive"}`}>
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
