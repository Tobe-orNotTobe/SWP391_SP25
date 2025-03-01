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

const ITEMS_PER_PAGE = 4; // Số trẻ mỗi trang

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

    const [currentPage, setCurrentPage] = useState(1);

    // Tính số trang
    const totalPages = Math.ceil(myChilds.length / ITEMS_PER_PAGE);

    // Lấy danh sách trẻ con cho trang hiện tại
    const currentChildren = myChilds.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <>
            <CustomerNavbar />
            <div className="childPageContainer">
                <h2 className="title">Trẻ của bạn</h2>
                <div style={{display: "flex", justifyContent: "end"}}>
                    <button className="addChildButton" onClick={() => navigate("/child-register")}>
                        <IoMdAdd/> Đăng ký trẻ
                    </button>
                </div>
                <br/>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="childGrid">
                    {currentChildren.map((child) => (
                        <div key={child.childId} className="childCard" onClick={() => {
                            navigate("/child-detail", { state: { childId: child.childId }})
                        }}>
                            <img src={child.imageUrl} alt={child.fullName} className="childImage"/>
                            <div style={{width: "100%"}}>
                                <h3 className="childName">{child.fullName}</h3>
                                <p className="childItem">
                                    <strong className="childItemTitle">Giới tính: </strong> {child.gender === "Male" ? ("Nam") : ("Nữ")}
                                </p>
                                <p className="childItem">
                                    <strong className="childItemTitle">Ngày sinh: </strong>
                                    {new Date(child.dateOfBirth).toLocaleDateString()}
                                </p>
                                <p className="childItem">
                                    <strong className="childItemTitle">Chiều cao: </strong>{child.height} cm
                                </p>
                                <p className="childItem">
                                    <strong className="childItemTitle">Cân nặng: </strong>{child.weight} kg
                                </p>
                                <p className="childItem">
                                    <strong className="childItemTitle">Lịch sử y tế: </strong>{child.medicalHistory === "yes" ? ("Có") : ("Không")}
                                </p>
                                <p className="childItem">
                                    <strong className="childItemTitle">Mối quan hệ: </strong>{child.relationToUser}
                                </p>
                            </div>
                            <div className="childButton">
                                <button
                                    className="childEdit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditPopup(child);
                                    }}
                                >
                                    <FaEdit/>
                                </button>
                                <button
                                    className="childDelete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeletePopup(child.childId);
                                    }}
                                >
                                    <MdDeleteOutline/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Hiển thị nút phân trang nếu số lượng trẻ > 6 */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ← Trước
                        </button>
                        {Array.from({length: totalPages}, (_, index) => (
                            <button
                                key={index + 1}
                                className={currentPage === index + 1 ? "active" : ""}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Tiếp →
                        </button>
                    </div>
                )}
            </div>
            <Footer/>
            <FloatingButtons/>

            {editingChild && (
                <div className="editPopupOverlay" onClick={closeEditPopup}>
                    <div className="editPopup" onClick={(e) => e.stopPropagation()}>
                        <button className="closeButton" onClick={closeEditPopup}>×</button>
                        <ChildForm isUpdate={true} defaultValues={editingChild} refetch={refetch}/>
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