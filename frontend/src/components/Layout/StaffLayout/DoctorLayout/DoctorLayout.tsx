import React from "react";
import StaffLayout from "../StaffLayout";

const groups = [
  {
    title: "Tiêm chủng",
    items: [
     // { label: "Ghi nhận tiêm chủng", path: "/doctor/service" },
      { label: "Lịch tiêm chủng", path: "/doctor/vaccination-schedule" },
    ],
  },
  {
    title: "Thông tin cá nhân",
    items: [
      // { label: "Ghi nhận tiêm chủng", path: "/doctor/service" },
      { label: "Thông tin của bác sĩ", path: "/doctor/profile" },
    ],
  },
  {
    title: "Đăng bài",
    items: [
      { label: "Đăng cẩm nang", path: "/post-guide" },
      { label: "Đăng tin tức", path: "/post-news" },
    ],
  },

];

interface DoctorLayoutProps {
  children: React.ReactNode;
}

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  return <StaffLayout groups={groups}>{children}</StaffLayout>;
};

export default DoctorLayout;
