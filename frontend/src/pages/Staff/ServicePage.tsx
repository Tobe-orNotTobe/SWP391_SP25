import React from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import VaccinationRecordForm from "../../components/VaccinationRecordForm/VaccinationRecordForm";


const ServicePage : React.FC  = () => {
    return(
        <AdminLayout>
           <VaccinationRecordForm/>
        </AdminLayout>
    );
}

export default ServicePage