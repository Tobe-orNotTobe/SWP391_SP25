import React, { useState } from "react";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../../components/Footer/Footer.tsx";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import { useMyChilds } from "../../../hooks/useChild.ts";
import "../ChildPage.scss";
import {FaEdit} from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ChildDetailResponse } from "../../../interfaces/Child.ts";
import ChildForm from "../../../components/ChildForm/ChildForm.tsx"
import {apiChildDelete} from "../../../apis/apiChild.ts";
import {notification} from "antd";

const MyChildPage: React.FC = () => {
    const { myChilds, loading, error, refetch } = useMyChilds();
    const navigate = useNavigate();
    const [editingChild, setEditingChild] = useState<ChildDetailResponse | null>(null);
    const [deleteChildId, setDeleteChildId] = useState<number | null>(null);

    const openEditPopup = (child: ChildDetailResponse) => {
        console.log("Opening popup for:", child);
        setEditingChild(child);
    };

    const closeEditPopup = () => {
        setEditingChild(null);
    };

    const openDeletePopup = (childId: number) => {
        setDeleteChildId(childId);
    }

    const closeDeletePopup = () => {
        setDeleteChildId(null);
    }

    const deleteChild = async (childId: number) => {

        const reponse = await apiChildDelete(childId);
        if (reponse.isSuccess) {
            notification.success({message: "Xóa thành công!"});
        }else {
            notification.success({message: "Xóa thất bại!"});
        }
        closeDeletePopup();
        await refetch();
    }

    return (
        <>
            <CustomerNavbar />
            <div className="childPageContainer">
                <h2 className="title">Trẻ của bạn</h2>
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <button className="addChildButton" onClick={() => navigate("/child-register")}>
                        <IoMdAdd /> Đăng ký trẻ
                    </button>
                </div> <br />

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="childGrid">
                    {myChilds &&
                        myChilds.map((child) => (
                            <div key={child.childId} className="childCard">
                                <img src={child.imageUrl} alt={child.fullName} className="childImage" />
                                <div style={{width: '100%'}}>
                                    <h3 className="childName">{child.fullName}</h3>
                                    <p className="childItem"><strong className="childItemTitle">Giới
                                        tính: </strong>{child.gender}</p>
                                    <p className="childItem"><strong className="childItemTitle">Ngày
                                        sinh: </strong>{new Date(child.dateOfBirth).toLocaleDateString()}</p>
                                    <p className="childItem"><strong className="childItemTitle">Chiều
                                        cao: </strong>{child.height} cm</p>
                                    <p className="childItem"><strong className="childItemTitle">Cân
                                        nặng: </strong>{child.weight} kg</p>
                                    <p className="childItem"><strong className="childItemTitle">Lịch sử y tế:
                                    </strong>{child.medicalHistory}</p>
                                    <p className="childItem"><strong className="childItemTitle">Mối quan hệ:
                                    </strong>{child.relationToUser}</p>
                                </div>
                                <div className="childButton">
                                    <button className="childEdit" onClick={() => openEditPopup(child)}>
                                    <FaEdit />
                                    </button>
                                    <button className="childDelete" onClick={() => openDeletePopup(child.childId)}>
                                        <MdDeleteOutline />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <Footer />
            <FloatingButtons />

            {editingChild && (
                <div className="editPopupOverlay" onClick={closeEditPopup}>
                    <div className="editPopup" onClick={(e) => e.stopPropagation()}>
                        <button className="closeButton" onClick={closeEditPopup}>×</button>
                        <ChildForm isUpdate={true} defaultValues={editingChild} refetch={refetch} />
                    </div>
                </div>
            )}

            {deleteChildId && (
                <div className="deletePopupOverlay" onClick={closeDeletePopup}>
                    <div className="deletePopup" onClick={(e) => e.stopPropagation()}>
                        <button className="closeButton" onClick={closeDeletePopup}>×</button>
                        <h2 className={"deleteTitle"}>Bạn có muốn xóa không?</h2>
                        <div style={{display: "flex", justifyContent: "space-around", paddingTop: "20px"}}>
                            <button className={"yesButton"} onClick={() => deleteChild(deleteChildId)}>Đồng ý</button>
                            <button className={"cancleButton"} onClick={closeDeletePopup}>Không</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyChildPage;