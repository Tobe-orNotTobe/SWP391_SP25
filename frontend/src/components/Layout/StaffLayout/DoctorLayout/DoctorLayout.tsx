import React from "react";
import StaffLayout from "../StaffLayout";
import { FaCalendarAlt, FaNewspaper, FaClipboardList } from "react-icons/fa";

const groups = [
  {
    title: "Tiêm chủng",
    items: [
      {
        label: "Lịch tiêm chủng",
        path: "/doctor/vaccination-schedule",
        icon: <FaCalendarAlt />,
      },
    ],
  },
  {
    title: "Bài đăng",
    items: [
      { label: "Đăng bài", path: "/doctor/blogPost", icon: <FaClipboardList /> },
      {
        label: "Quản lý bài đăng",
        path: "/doctor/blogManager",
        icon: <FaNewspaper />,
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

