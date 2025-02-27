import React from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar";
import Footer from "../../components/Footer/Footer.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import {useMyChilds} from "../../hooks/useChild.ts";
import "./ChildPage.scss"

const MyChildPage: React.FC = () => {

    const {myChilds, loading, error} = useMyChilds();

    return (
        <>
            <CustomerNavbar />
            <div className={"childPageContainer"}>
                <h2 className={"title"}>Trẻ của bạn</h2>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {myChilds.map((child) => (
                        <div key={child.childId} className="p-4 border rounded-lg shadow-md bg-white">
                            <h2 className="text-lg font-semibold">{child.fullName}</h2>
                            <p>Heigth: {child.height}</p>
                            <p>Gender: {child.gender}</p>
                            {/* Thêm các thông tin khác của child nếu cần */}
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
            <FloatingButtons />
        </>
    );
};

export default MyChildPage;
