import React from "react";
import StaffLayout from "../../components/Layout/StaffLayout/StaffLayout.tsx";
import VaccinationRecordForm from "../../components/VaccinationRecordForm/VaccinationRecordForm";
import { useLocation } from "react-router-dom";

const ServicePage: React.FC = () => {
  const location = useLocation()
  const booking = location.state
  return (
    <StaffLayout>
      <VaccinationRecordForm booking={booking}  />
    </StaffLayout>
  );
};

export default ServicePage;
