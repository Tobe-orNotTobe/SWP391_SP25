import React from "react";
import { Table, Button, Modal } from "antd";
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout";
import { GetVaccineComboDetail } from "../../../../interfaces/Vaccine";
import { useComboVaccineList } from "./useVaccineComboList";
import { useComboVaccineDetail } from "../../../../hooks/useVaccine";
import { TbListDetails } from "react-icons/tb";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { TiPlusOutline } from "react-icons/ti";
import "./VaccineComboList.scss"

const VaccineComboList: React.FC = () => {

    const {comboVaccineDetail} = useComboVaccineDetail();

    console.log(comboVaccineDetail);
    const {
        deletingId,
        isDetailModalOpen,
        selectedCombo,
        handleCreate,
        handleEdit,
        handleDelete,
        handleDetailClick,
        handleDetailModalClose
    } = useComboVaccineList();

    // Function to render HTML content safely
    const renderHtmlContent = (htmlContent: string) => {
        return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    const columns = [
        {
            title: "ComboId",
            dataIndex: "comboId",
            key: "comboId",
        },
        {
            title: "Tên Combo",
            dataIndex: "comboName",
            key: "comboName",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (description: string) => {
                // Create a truncated version for the table (strip HTML and limit length)
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = description;
                const textContent = tempDiv.textContent || tempDiv.innerText || "";
                return textContent.length > 50 ? textContent.substring(0, 50) + "..." : textContent;
            }
        },
        {
            title: "Tổng giá",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price: number) => `${price.toLocaleString()} VND`,
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (isActive ? "Đang hoạt động" : "Ngừng hoạt động"),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_: undefined, record: GetVaccineComboDetail) => (
                <div className="vaccine-action-buttons">
                    <Button onClick={() => handleDetailClick(record)} className="detail-button">
                        <TbListDetails /> Chi tiết
                    </Button>
                    <Button onClick={() => handleEdit(record)} className="edit-button">
                        <FiEdit2 /> Chỉnh sửa
                    </Button>
                    <Button
                        loading={deletingId === record.comboId}
                        onClick={() => handleDelete(record.comboId)}
                        className="delete-button"
                    >
                        <MdDeleteOutline /> Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <ManagerLayout>
            <div className="manager-vaccine-page-container">
                <div className="page-header">
                    <h1>Quản lý Combo Vaccine</h1>
                    <Button
                        type="primary"
                        icon={<TiPlusOutline />}
                        onClick={handleCreate}
                        className="add-button"
                    >
                        Thêm Combo Vaccine
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={Array.isArray(comboVaccineDetail) ? comboVaccineDetail : []}
                    rowKey="comboId"
                    pagination={{ pageSize: 8, showSizeChanger: false }}
                    className="vaccine-table"
                />
            </div>
            {/* Modal chi tiết combo vaccine */}
            <Modal
                title="Chi tiết Combo Vaccine"
                open={isDetailModalOpen}
                onCancel={handleDetailModalClose}
                footer={null}
                width={1000}
                className="combo-vaccine-modal"
            >
                {selectedCombo && (
                    <div className="combo-vaccine-content">
                        <div className="combo-vaccine-info">
                            <div className="combo-vaccine-info-item">
                                <div className="combo-vaccine-info-label">Tên Combo</div>
                                <div className="combo-vaccine-info-value">{selectedCombo.comboName}</div>
                            </div>

                            <div className="combo-vaccine-info-item">
                                <div className="combo-vaccine-info-label">Mô tả</div>
                                <div className="combo-vaccine-info-value">
                                    {renderHtmlContent(selectedCombo.description)}
                                </div>
                            </div>

                            <div className="combo-vaccine-info-item">
                                <div className="combo-vaccine-info-label">Tổng giá</div>
                                <div className="combo-vaccine-info-value">{selectedCombo.totalPrice.toLocaleString()} VND</div>
                            </div>

                            <div className="combo-vaccine-info-item">
                                <div className="combo-vaccine-info-label">Trạng thái</div>
                                <div className="combo-vaccine-info-value">
                                    {selectedCombo.isActive ? "Có" : "Không"}
                                </div>
                            </div>
                        </div>

                        <div className="combo-vaccine-list">
                            <div className="combo-vaccine-list-title">Danh sách Vaccine</div>
                            <div className="combo-vaccine-grid">
                                {selectedCombo.vaccines && selectedCombo.vaccines.map((vaccine) => (
                                    <div key={vaccine.vaccineId} className="combo-vaccine-item">
                                        <div className="combo-vaccine-item-name">{vaccine.name}</div>
                                        <div className="combo-vaccine-item-image">
                                            <img src={vaccine.image} alt={vaccine.name} />
                                        </div>
                                        <div className="combo-vaccine-item-price">
                                            {vaccine.price.toLocaleString()} VND
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

        </ManagerLayout>
    );
};

export default VaccineComboList;