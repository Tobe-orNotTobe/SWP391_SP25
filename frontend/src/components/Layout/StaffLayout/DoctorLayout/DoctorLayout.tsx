import React from "react";
import StaffLayout from "../StaffLayout";

const groups = [
  {
    title: "Tiêm chủng",
    items: [
      { label: "Ghi nhận tiêm chủng", path: "/doctor/service" },
      { label: "Lịch tiêm chủng", path: "/doctor/vaccination-schedule" },
    ],
  },
  {
    title: "Đăng bài",
    items: [
      { label: "Đăng cẩm nang", path: "/post-guide" },
      { label: "Đăng tin tức", path: "/post-news" },
    ],
  },
  {
    title: "Quản lý",
    items: [
      { label: "Quản lý vaccine", path: "/manage-vaccine" },
      { label: "Quản lý lịch tiêm", path: "/manage-schedule" },
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
