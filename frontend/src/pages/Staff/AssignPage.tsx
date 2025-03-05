//tạo bảng booking và assign cho bác sĩ
import React from "react";

import DoctorLayout from "../../components/Layout/StaffLayout/DoctorLayout/DoctorLayout";
import DoctorList from "./DoctorList";

const AssignPage : React.FC = () => {
  return (
    <DoctorLayout>
      <DoctorList />
    </DoctorLayout>
  );
}

export default AssignPage;
