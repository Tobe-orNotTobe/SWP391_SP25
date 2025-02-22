import React from "react";
import { Button, Table, Modal } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import { TbListDetails } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { VaccineDetail } from "../../../../interfaces/Vaccine";
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout";
import { useVaccineDetail } from "../../../../hooks/useVaccine";
import { useVaccineManagement } from "./useVaccineManagement.ts";
import "./ManagerVaccinePage.scss";

const ManagerVaccinePage: React.FC = () => {
    const { vaccineDetail } = useVaccineDetail();
    const {
        isDetailModalOpen,
        selectedVaccine,
        deletingId,
        handleCreate,
        handleEdit,
        handleDelete,
        handleDetailClick,
        handleDetailModalClose
    } = useVaccineManagement();

    const columns = [
        { title: "ID", dataIndex: "vaccineId", key: "id" },
        {
            title: "Hình ảnh",
            dataIndex: "image",
            key: "image",
            render: (image: string) => <img src={image} alt="Vaccine" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "4px" }} />
        },
        {
            title: "Tên Vaccine",
            dataIndex: "name",
            key: "name",
            render: (name: string) => name.length > 20 ? `${name.slice(0, 20)}...` : name
        },
        {
            title: "Nhà sản xuất",
            dataIndex: "manufacturer",
            key: "manufacturer",
            render: (manufacturer: string) => manufacturer.length > 15 ? `${manufacturer.slice(0, 15)}...` : manufacturer
        },
        {
            title: "Giá (VNĐ)",
            dataIndex: "price",
            key: "price",
            render: (price: number) => price.toLocaleString() + " VNĐ"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: boolean) => (
                <span className={`status-badge ${status ? 'available' : 'unavailable'}`}>
                    {status ? "Có sẵn" : "Hết hàng"}
                </span>
            )
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: VaccineDetail) => (
                <div className="vaccine-action-buttons">
                    <Button
                        onClick={() => handleDetailClick(record)}
                        className="detail-button"
                    >
                        <TbListDetails/>Chi tiết
                    </Button>
                    <Button
                        onClick={() => handleEdit(record)}
                        className="edit-button"
                    >
                        <FiEdit2/>Chỉnh sửa
                    </Button>
                    <Button
                        loading={deletingId === record.vaccineId}
                        onClick={() => handleDelete(record.vaccineId)}
                        className="delete-button"
                    >
                       <MdDeleteOutline/> Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <ManagerLayout>
            <div className="manager-vaccine-page-container">
                <div className="page-header">
                    <h1>Quản lý Vaccine</h1>
                    <Button
                        type="primary"
                        icon={<TiPlusOutline />}
                        onClick={handleCreate}
                        className="add-button"
                    >
                        Thêm Vaccine
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={Array.isArray(vaccineDetail) ? vaccineDetail : []}
                    rowKey="vaccineId"
                    pagination={{ pageSize: 8, showSizeChanger: false }}
                    className="vaccine-table"
                />

                <Modal
                    title="Chi Tiết Vaccine"
                    open={isDetailModalOpen}
                    onCancel={handleDetailModalClose}
                    footer={null}
                    width={1000}
                    className="vaccine-detail-modal"
                >
                    {selectedVaccine && (
                        <div className="vaccine-detail-mananger-popups">
                            <div className="vaccine-detail-mananger-popups-left">
                                <h3>{selectedVaccine.name}</h3>
                                <div className="vaccine-image">
                                    <img src={selectedVaccine.image} alt="Vaccine" style={{width :"60%"}}/>
                                </div>
                                <p><strong>Nhà sản xuất:</strong> {selectedVaccine.manufacturer}</p>
                                <p><strong>Giá:</strong> {selectedVaccine.price.toLocaleString()} VNĐ</p>
                                <p><strong>Trạng thái:</strong> {selectedVaccine.status ? "Có sẵn" : "Hết hàng"}</p>
                                <p><strong>Cần thiết:</strong> {selectedVaccine.isNecessary ? "Có" : "Không"}</p>
                                <p><strong>Số mũi tiêm:</strong> {selectedVaccine.injectionsCount}</p>
                            </div>

                            <div className="vaccine-detail-mananger-popups-right">
                                <div className="detail-section">
                                    <p><strong>Mô tả: </strong>{selectedVaccine.description}</p>
                                </div>
                                <div className="detail-section">
                                    <p><strong>Tác dụng phụ: </strong>{selectedVaccine.sideEffect}</p>
                                </div>
                                <div className="detail-section">
                                    <p><strong>Bệnh phòng ngừa: </strong>{selectedVaccine.diseasePrevented}</p>
                                </div>
                                <div className="detail-section">
                                    <p><strong>Vị trí tiêm: </strong>{selectedVaccine.injectionSite}</p>
                                </div>
                                <div className="detail-section">
                                    <p><strong>Ghi chú: </strong>{selectedVaccine.notes}</p>
                                </div>
                                <div className="detail-section">
                                    <p><strong>Tương tác Vaccine: </strong>{selectedVaccine.vaccineInteractions}</p>
                                </div>
                                <div className="detail-section">
                                    <p><strong>Tác dụng không mong muốn: </strong>{selectedVaccine.undesirableEffects}</p>
                                </div>
                                <div className="detail-section">
                                    <p><strong>Cách bảo quản: </strong>{selectedVaccine.preserve}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </ManagerLayout>
    );
};

export default ManagerVaccinePage;