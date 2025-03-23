import React from "react";
import StaffLayout from "../StaffLayout";
import {FaClipboardList, FaNewspaper} from "react-icons/fa";

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
    title: "Bài đăng",
    items: [
      // { label: "Ghi nhận tiêm chủng", path: "/doctor/service" },
      { label: "Thông tin của bác sĩ", path: "/doctor/profile" },
    ],
  },
  {
    title: "Đăng bài",
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
