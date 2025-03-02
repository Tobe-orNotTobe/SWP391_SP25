
import React from "react";
import StaffLayout from "../../components/Layout/StaffLayout/StaffLayout.tsx";
import VaccinationRecordForm from "../../components/VaccinationRecordForm/VaccinationRecordForm";

const ServicePage: React.FC = () => {
  return (
    <StaffLayout>
      <VaccinationRecordForm />
    </StaffLayout>
  );
};

export default ServicePage;
