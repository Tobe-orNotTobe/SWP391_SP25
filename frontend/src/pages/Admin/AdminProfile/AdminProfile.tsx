import React from "react";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.tsx";
import UserProfile from "../../../components/UserProfile/UserProfile.tsx";

const AdminProfile : React.FC  = () => {
    return (
        <>
            <AdminLayout>
                <UserProfile/>
            </AdminLayout>
        </>
    )
}
export default AdminProfile