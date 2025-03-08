import React from "react";
import ManagerLayout from "../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import UserProfile from "../../../components/UserProfile/UserProfile.tsx";

const ManagerProfile : React.FC = () => {
    return (
        <>
            <ManagerLayout>
                <UserProfile/>
            </ManagerLayout>

        </>
    )
}

export default ManagerProfile