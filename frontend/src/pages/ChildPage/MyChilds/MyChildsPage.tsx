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
// import {notification} from "antd";
import { MdOutlineMonitorWeight } from "react-icons/md";
import { GiBodyHeight } from "react-icons/gi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { VscEmptyWindow } from "react-icons/vsc";
import {toast} from "react-toastify";

const ITEMS_PER_PAGE = 4; // Số trẻ mỗi trang

const MyChildPage: React.FC = () => {
    const { myChilds, loading, error, refetch } = useMyChilds();
    const navigate = useNavigate();
    const [editingChild, setEditingChild] = useState<ChildDetailResponse | null>(null);
    const [deleteChildId, setDeleteChildId] = useState<number | null>(null);
    const [detailChild, setDetailChild] = useState<ChildDetailResponse | null>(null);

    const openEditPopup = (child: ChildDetailResponse) => {
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

    const openDetailPopup = (child: ChildDetailResponse) => {
        setDetailChild(child);
    }

    const closeDetailPopup = () => {
        setDetailChild(null);
    }

    const deleteChild = async (childId: number) => {

        const reponse = await apiChildDelete(childId);
        if (reponse.isSuccess) {
            toast.success("Xóa thành công!");
            // notification.success({message: "Xóa thành công!"});
        }else {
            toast.error("Xóa thất bại!");
            // notification.success({message: "Xóa thất bại!"});
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
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <h2 className="title">Trẻ của bạn</h2>
                    <div style={{display: "flex", justifyContent: "end"}}>
                        <button className="addChildButton" onClick={() => navigate("/child-register")}>
                            <IoMdAdd/> Đăng ký trẻ
                        </button>
                    </div>
                </div>
                <br/>

                {loading && <p>Loading...</p>}
                {error ? (
                    <div>
                        <div className={"error-icon"}>
                            <VscEmptyWindow />
                        </div>
                        <p className={"error-message"}>{error}</p>
                    </div>

                ) : (
                    <div className="childGrid">
                        {currentChildren.map((child) => (
                            <div key={child.childId} className="childCard"
                                 style={child.gender === "Male" ? {boxShadow: "0 0 0 15px rgb(169, 215, 255)"} : {boxShadow: "0 0 0 15px rgb(253, 210, 218)"}}
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     openDetailPopup(child);
                                 }}>
                                <img src={child.imageUrl} alt={child.fullName} className="childImage"/>
                                <div style={{
                                    width: "60%",
                                    display: "grid",
                                    justifyContent: "center",
                                    paddingTop: "10px",
                                    paddingBottom: "10px"
                                }}>
                                    <h3 className="childName">{child.fullName}</h3>
                                    {/*<p className="childItem">*/}
                                    {/*    <strong className="childItemTitle">Giới tính: </strong> {child.gender === "Male" ? ("Nam") : ("Nữ")}*/}
                                    {/*</p>*/}
                                    <p className="childItem" style={{justifyContent: "center"}}>
                                        <LiaBirthdayCakeSolid className={"childItemIcon"}/>
                                        {new Date(child.dateOfBirth).toLocaleDateString()}
                                    </p>
                                    <div style={{display: "flex"}}>
                                        <p className="childItem"
                                           style={child.gender === "Male" ? {borderRight: "1px solid rgb(108, 187, 255)"} : {borderRight: "1px solid rgb(251, 147, 166)"}}>
                                            <GiBodyHeight className={"childItemIcon"}/>{child.height} cm</p>
                                        <p className="childItem"><MdOutlineMonitorWeight
                                            className={"childItemIcon"}/>{child.weight} kg</p>
                                    </div>

                                    {/*<p className="childItem">*/}
                                    {/*    <strong className="childItemTitle">Lịch sử y tế: </strong>{child.medicalHistory === "yes" ? ("Có") : ("Không")}*/}
                                    {/*</p>*/}
                                    {/*<p className="childItem">*/}
                                    {/*    <strong className="childItemTitle">Mối quan hệ: </strong>{child.relationToUser}*/}
                                    {/*</p>*/}
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
                )}

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
                <div className="popupOverlay" onClick={closeEditPopup}>
                    <div className="editPopup" onClick={(e) => e.stopPropagation()}>
                        <button className="closeButton" onClick={closeEditPopup}>×</button>
                        <ChildForm isUpdate={true} defaultValues={editingChild} refetch={refetch}/>
                    </div>
                </div>
            )}

            {deleteChildId && (
                <div className="popupOverlay" onClick={closeDeletePopup}>
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

            {detailChild && (
                <div className="popupOverlay" onClick={closeDetailPopup}>
                    <div className="detailPopup" onClick={(e) => e.stopPropagation()}>
                        <div style={{paddingBottom: "40px"}}>
                            <button className="closeButton" onClick={closeDetailPopup}>×</button>
                            <h2 className={"popupTitle"}>Thông tin trẻ</h2>
                        </div>

                        <div style={{display: "flex"}}>
                            <div style={{
                                width: '40%',
                                // padding: "40px",
                                paddingRight: "30px",
                                borderRight: "2px solid #ddd"
                            }}>
                                <img className={"childImage"} style={{width: "100%", borderRadius: "50%"}}
                                     src={detailChild.imageUrl} alt={"nihaoma"}/>
                            </div>
                            <div style={{width: "60%", paddingLeft: "20px", marginLeft: "30px", borderRadius: "10px", backgroundColor: "white"}}>
                                <h2 style={{fontSize: "27px", display: "flex", justifyContent: "center", paddingTop: "30px", paddingBottom: "20px"}}>{detailChild.fullName}</h2>

                                <p className={"childP"}>
                                    <strong style={{paddingRight: "5px"}}>Giới
                                        tính: </strong> {detailChild.gender === "Male" ? ("Nam") : ("Nữ")}
                                </p>
                                <p className={"childP"}>
                                    <strong style={{paddingRight: "5px"}}>Ngày sinh: </strong>
                                    {new Date(detailChild.dateOfBirth).toLocaleDateString()}
                                </p>
                                <p className={"childP"}>
                                    <strong style={{paddingRight: "5px"}}>Chiều cao: </strong>{detailChild.height} cm
                                </p>
                                <p className={"childP"}>
                                    <strong style={{paddingRight: "5px"}}>Cân nặng: </strong>{detailChild.weight} kg
                                </p>
                                <p className={"childP"}>
                                    <strong style={{paddingRight: "5px"}}>Lịch sử y
                                        tế: </strong>{detailChild.medicalHistory === "yes" ? ("Có") : ("Không")}
                                </p>
                                <p className={"childP"}>
                                    <strong style={{paddingRight: "5px"}}>Mối quan
                                        hệ: </strong>{detailChild.relationToUser}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyChildPage;