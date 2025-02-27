import React from "react";

import ManagerLayout from "../../../components/Layout/ManagerLayout/ManagerLayout.tsx";


const VaccineInventoryList : React.FC = () => {

    return (
        <>
            <ManagerLayout>
            <div className="vaccine-inventory-list-container">
                <div className="vaccine-inventory-list-header">
                    <h1>Quản lí kho Vaccine</h1>

                </div>

            </div>

            </ManagerLayout>
        </>
    )
}

export default VaccineInventoryList;