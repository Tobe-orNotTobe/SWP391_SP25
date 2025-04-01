import React from "react";
import StaffLayout from "../StaffLayout";
import {
  FaSyringe,
  FaUserMd,
  FaClipboardList,
  FaNewspaper,
} from "react-icons/fa";

const groups = [
  {
    title: "Tiêm chủng",
    items: [
      {
        label: "Ghi nhận tiêm chủng cho khách hàng",
        path: "/staff/booking",
        icon: <FaSyringe />,
      },
      {
        label: "Phân công bác sĩ",
        path: "/staff/assignDoctor",
        icon: <FaUserMd />,
      },
    ],
  },
  {
    title: "Bài đăng",
    items: [
      { label: "Đăng bài", path: "/staff/blogPost", icon: <FaClipboardList /> },
      {
        label: "Quản lý bài đăng",
        path: "/staff/blogManager",
        icon: <FaNewspaper />,
      },
    ],
  },
];

interface Staff1LayoutProps {
  children: React.ReactNode;
}

const Staff1Layout: React.FC<Staff1LayoutProps> = ({ children }) => {
  return <StaffLayout groups={groups}>{children}</StaffLayout>;
};

export default Staff1Layout;
