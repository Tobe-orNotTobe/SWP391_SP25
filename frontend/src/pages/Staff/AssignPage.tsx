//tạo bảng booking và assign cho bác sĩ
import React from "react";
import StaffLayout from "../../components/Layout/StaffLayout/StaffLayout";
import DoctorLayout from "../../components/Layout/StaffLayout/DoctorLayout/DoctorLayout";
import DoctorList from "./DoctorList";

function AssignPage() {
  return (
    <DoctorLayout>
      <DoctorList />
    </DoctorLayout>
  );
}

export default AssignPage;
