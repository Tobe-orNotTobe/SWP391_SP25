import React from "react";
import StaffLayout from "../../components/Layout/StaffLayout/StaffLayout.tsx";
import VaccinationRecordForm from "../../components/VaccinationRecordForm/VaccinationRecordForm";
import Staff1Layout from "../../components/Layout/StaffLayout/Stafff1Layout/Staff1Layout.tsx";

const ServicePage: React.FC = () => {
  return (
    <Staff1Layout>
      <VaccinationRecordForm />
    </Staff1Layout>
  );
};

export default ServicePage;
