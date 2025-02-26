import React from "react";
import { Button, Table, Modal, Tabs, Card, List, Badge } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import { TbListDetails } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { VaccineDetail, VaccinationSchedule} from "../../../../interfaces/Vaccine.ts";
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import { useVaccineDetail, useVaccinationScheduleDetail } from "../../../../hooks/useVaccine.ts";
import { useVaccineManagement } from "./useVaccineManagement.ts";
import "./ManagerVaccinePage.scss";

const { TabPane } = Tabs;

const ManagerVaccinePage: React.FC = () => {
    const { vaccineDetail } = useVaccineDetail();
    const { vaccinationSchedule } = useVaccinationScheduleDetail();
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

    // Find relevant vaccination schedules for the selected vaccine
    const getRelevantSchedules = () => {
        if (!selectedVaccine || !vaccinationSchedule || !Array.isArray(vaccinationSchedule)) {
            return [];
        }

        // Find schedules that contain the selected vaccine in their vaccineScheduleDetails
        return vaccinationSchedule.filter(schedule => 
            schedule.vaccineScheduleDetails && 
            schedule.vaccineScheduleDetails.some(detail => 
                detail.vaccineId === selectedVaccine.vaccineId
            )
        );
    };

    // Get the specific vaccine details from a schedule
    const getVaccineDetailsFromSchedule = (schedule: VaccinationSchedule) => {
        if (!selectedVaccine || !schedule.vaccineScheduleDetails) {
            return null;
        }
        
        return schedule.vaccineScheduleDetails.find(detail => 
            detail.vaccineId === selectedVaccine?.vaccineId
        );
    };

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
                    <Button onClick={() => handleDetailClick(record)} className="detail-button">
                        <TbListDetails/>Chi tiết
                    </Button>
                    <Button onClick={() => handleEdit(record)} className="edit-button">
                        <FiEdit2/>Chỉnh sửa
                    </Button>
                    <Button loading={deletingId === record.vaccineId} onClick={() => handleDelete(record.vaccineId)} className="delete-button">
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
                    <Button type="primary" icon={<TiPlusOutline />} onClick={handleCreate} className="add-button">
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
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Thông tin Vaccine" key="1">
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
                            </TabPane>
                            <TabPane tab="Lịch Tiêm Chủng" key="2">
                                <div className="vaccination-schedule-section">
                                    <h3>Lịch Tiêm Chủng cho {selectedVaccine.name}</h3>
                                    
                                    {getRelevantSchedules().length > 0 ? (
                                        <div className="schedule-cards">
                                            {getRelevantSchedules().map(schedule => {
                                                const vaccineDetails = getVaccineDetailsFromSchedule(schedule);
                                                
                                                return (
                                                    <Card style={{marginBottom : "10px"}}
                                                        key={schedule.scheduleId} 
                                                        title={`Nhóm tuổi: ${schedule.ageRangeStart} - ${schedule.ageRangeEnd} tháng`}
                                                        className="schedule-card"
                                                    >
                                                        {schedule.notes && (
                                                            <p className="schedule-notes"><strong>Ghi chú chung:</strong> {schedule.notes}</p>
                                                        )}
                                                        
                                                        {vaccineDetails && vaccineDetails.injectionSchedules && (
                                                            <>
                                                                <h4>Lịch tiêm:</h4>
                                                                <List
                                                                    dataSource={vaccineDetails.injectionSchedules.sort((a, b) => a.doseNumber - b.doseNumber)}
                                                                    renderItem={injection => (
                                                                        <List.Item>
                                                                            <div className="injection-item">
                                                                                <div>
                                                                                    <Badge 
                                                                                        status={injection.isRequired ? "success" : "default"} 
                                                                                        text={`Mũi ${injection.doseNumber}`} 
                                                                                    />
                                                                                    <span className="injection-month">{injection.injectionMonth} tháng tuổi</span>
                                                                                </div>
                                                                                {injection.isRequired && (
                                                                                    <span className="required-badge">Bắt buộc</span>
                                                                                )}
                                                                                {injection.notes && (
                                                                                    <div className="injection-notes">
                                                                                        <strong>Ghi chú:</strong> {injection.notes}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </List.Item>
                                                                    )}
                                                                />
                                                            </>
                                                        )}
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="no-schedule-message">
                                            <p>Chưa có lịch tiêm chủng cho loại vaccine này.</p>
                                        </div>
                                    )}
                                </div>
                            </TabPane>
                        </Tabs>
                    )}
                </Modal>
            </div>
        </ManagerLayout>
    );
};

export default ManagerVaccinePage;