import React from "react";
import StaffLayout from "../StaffLayout";
import { FaCalendarCheck, FaUserMd, FaEdit, FaListAlt } from "react-icons/fa";

const groups = [
  {
    title: "Lịch tiêm chủng",
    items: [
      { 
        label: "Xem lịch tiêm", 
        path: "/doctor/vaccination-schedule",
        icon: <FaCalendarCheck />
      },
    ],
  },
  {
    title: "Hồ sơ bác sĩ",
    items: [
      { 
        label: "Thông tin cá nhân", 
        path: "/doctor/profile", 
        icon: <FaUserMd />
      },
    ],
  },
  {
    title: "Quản lý bài viết",
    items: [
      { 
        label: "Tạo bài viết", 
        path: "/doctor/blogPost", 
        icon: <FaEdit /> 
      },
      {
        label: "Danh sách bài viết",
        path: "/doctor/blogManager",
        icon: <FaListAlt />,
      },
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
