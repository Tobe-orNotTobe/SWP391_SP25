import React from "react";
import DoctorLayout from "../../../components/Layout/StaffLayout/DoctorLayout/DoctorLayout.tsx";
import UserProfile from "../../../components/UserProfile/UserProfile.tsx";

const DoctorProfile : React.FC = () => {
    return (
        <>
            <DoctorLayout>
                <UserProfile/>
            </DoctorLayout>
        </>
    )
};

export default DoctorProfile;