import React from "react";
import { Button, Table, Modal } from "antd";
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout";
import { useVaccinationSchedule } from "./useVaccinationSchedule";
import { VaccinationSchedule } from "../../../../interfaces/Vaccine";
import { TiPlusOutline } from "react-icons/ti";
import { FiEdit2 } from "react-icons/fi";
import { TbListDetails } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import "./ScheduleVaccination.scss"

import { useVaccinationScheduleDetail } from "../../../../hooks/useVaccine";

const ScheduleVaccinationList: React.FC = () => {
   
    const {vaccinationSchedule, loading} = useVaccinationScheduleDetail()

    const {
        deletingId,
        selectedSchedule,
        isModalOpen,
        handleEdit,
        handleDelete,
        handleCreate,
        handleShowDetail,
        handleModalClose,
    } = useVaccinationSchedule();

    
    const columns = [
        {
            title: "Mã Lịch",
            dataIndex: "scheduleId",
            key: "scheduleId",
        },
        {
            title: "Độ tuổi (Từ - Đến)",
            render: (record: VaccinationSchedule) => `${record.ageRangeStart} - ${record.ageRangeEnd} tuổi`,
            key: "ageRange",
        },
        {
            title: "Ghi chú",
            dataIndex: "notes",
            key: "notes",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: VaccinationSchedule) => (
                <div className="vaccine-action-buttons">
                    <Button onClick={() => handleShowDetail(record)} className="detail-button">
                        <TbListDetails /> Chi tiết
                    </Button>
                    <Button onClick={() => handleEdit(record.scheduleId)} className="edit-button">
                        <FiEdit2 /> Chỉnh sửa
                    </Button>
                    <Button 
                        loading={deletingId === record.scheduleId} 
                        onClick={() => handleDelete(record.scheduleId)} 
                        className="delete-button"
                        danger
                    >
                        <MdDeleteOutline /> Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <ManagerLayout>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2>Quản lý Lịch Tiêm Chủng</h2>
                <Button type="primary" onClick={handleCreate}>
                    <TiPlusOutline /> Thêm Combo Vaccine
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={vaccinationSchedule}
                loading={loading}
                rowKey="scheduleId"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Chi tiết Lịch Tiêm Chủng"
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width={800}
            >
                {selectedSchedule && (
                    <div>
                        <p><strong>Mã lịch:</strong> {selectedSchedule.scheduleId}</p>
                        <p><strong>Độ tuổi áp dụng:</strong> {selectedSchedule.ageRangeStart} - {selectedSchedule.ageRangeEnd} tuổi</p>
                        <p><strong>Ghi chú:</strong> {selectedSchedule.notes}</p>

                        <h3>Chi tiết vắc xin</h3>
                        {selectedSchedule.vaccineScheduleDetails.map((vaccine) => (
                            <div key={vaccine.vaccineId} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                                <p><strong>Mã vắc xin:</strong> {vaccine.vaccineId}</p>
                                <h4>Lịch tiêm</h4>
                                <Table
                                    columns={[
                                        { title: "Số liều", dataIndex: "doseNumber", key: "doseNumber" },
                                        { title: "Tháng tiêm", dataIndex: "injectionMonth", key: "injectionMonth" },
                                        { title: "Bắt buộc", dataIndex: "isRequired", key: "isRequired", render: (value: boolean) => (value ? "Có" : "Không") },
                                        { title: "Ghi chú", dataIndex: "notes", key: "notes" },
                                    ]}
                                    dataSource={vaccine.injectionSchedules}
                                    rowKey="doseNumber"
                                    pagination={false}
                                    size="small"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </ManagerLayout>
    );
};

export default ScheduleVaccinationList;
