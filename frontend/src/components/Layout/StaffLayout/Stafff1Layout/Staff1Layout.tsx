import React from "react";
import StaffLayout from "../StaffLayout";

const groups = [
  {
    title: "Tiêm chủng",
    items: [
      { label: "Ghi nhận tiêm chủng cho khách hàng", path: "/staff/booking" },
      { label: "Phân công bác sĩ", path: "/staff/assignDoctor" },
    ],
  },
  {
    title: "Đăng bài",
    items: [
      { label: "Đăng cẩm nang", path: "/post-guide" },
      { label: "Đăng tin tức", path: "/post-news" },
    ],
  },
  // {
  //   title: "Quản lý",
  //   items: [
  //     { label: "Quản lý vaccine", path: "/manage-vaccine" },
  //     { label: "Quản lý lịch tiêm", path: "/manage-schedule" },
  //   ],
  // },
];

interface DoctorLayoutProps {
  children: React.ReactNode;
}

const Staff1Layout: React.FC<DoctorLayoutProps> = ({ children }) => {
  return <StaffLayout groups={groups}>{children}</StaffLayout>;
};

export default Staff1Layout;
