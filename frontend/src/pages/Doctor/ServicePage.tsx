import React from "react";
import VaccinationRecordForm from "../../components/VaccinationRecordForm/VaccinationRecordForm.tsx";
import { useLocation } from "react-router-dom";
import DoctorLayout from "../../components/Layout/StaffLayout/DoctorLayout/DoctorLayout.tsx";

const ServicePage: React.FC = () => {
  const location = useLocation();
  const booking = location.state;
  return (
    <DoctorLayout>
      <VaccinationRecordForm booking={booking} />
    </DoctorLayout>
  );
};

export default ServicePage;
