import React from "react";
import { Button, Table, Modal, Tabs, Card, List, Badge } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import { TbListDetails } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";

import { VaccineDetail, VaccinationSchedule } from "../../../../interfaces/Vaccine.ts";
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import { useVaccineDetail, useVaccinationScheduleDetail, useVaccineInventoryStockDetail } from "../../../../hooks/useVaccine.ts";
import { useVaccineManagement } from "./useVaccineManagement.ts";

import "./ManagerVaccinePage.scss";

const { TabPane } = Tabs;

const ManagerVaccinePage: React.FC = () => {
    const { vaccineDetail } = useVaccineDetail();
    const { vaccinationSchedule } = useVaccinationScheduleDetail();
    const { vaccineInventoryStockDetail } = useVaccineInventoryStockDetail();

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


    const getRelevantSchedules = () => {
        if (!selectedVaccine || !vaccinationSchedule || !Array.isArray(vaccinationSchedule)) {
            return [];
        }


        return vaccinationSchedule.filter(schedule =>
            schedule.vaccineScheduleDetails &&
            schedule.vaccineScheduleDetails.some(detail =>
                detail.vaccineId === selectedVaccine.vaccineId
            )
        );
    };


    const getVaccineDetailsFromSchedule = (schedule: VaccinationSchedule) => {
        if (!selectedVaccine || !schedule.vaccineScheduleDetails) {
            return null;
        }

        return schedule.vaccineScheduleDetails.find(detail =>
            detail.vaccineId === selectedVaccine?.vaccineId
        );
    };

    // Get inventory batches for the selected vaccine
    const getVaccineBatches = () => {
        if (!selectedVaccine || !vaccineInventoryStockDetail || !Array.isArray(vaccineInventoryStockDetail)) {
            return [];
        }

        return vaccineInventoryStockDetail.filter(item =>
            item.vaccineId === selectedVaccine.vaccineId
        );
    };



    const columns = [
        {
            title: "ID",
            dataIndex: "vaccineId",
            key: "id",
            sorter: (a : VaccineDetail, b: VaccineDetail) => a.vaccineId - b.vaccineId
        },
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
            sorter: (a :VaccineDetail, b :VaccineDetail) => a.name.localeCompare(b.name),
            render: (name: string) => name.length > 20 ? `${name.slice(0, 20)}...` : name
        },
        {
            title: "Nhà sản xuất",
            dataIndex: "manufacturer",
            key: "manufacturer",
            sorter: (a : VaccineDetail, b : VaccineDetail) => a.manufacturer.localeCompare(b.manufacturer),
            render: (manufacturer: string) => manufacturer.length > 15 ? `${manufacturer.slice(0, 15)}...` : manufacturer
        },
        {
            title: "Giá (VNĐ)",
            dataIndex: "price",
            key: "price",
            sorter: (a: VaccineDetail, b: VaccineDetail) => a.price - b.price,
            render: (price: number) => new Intl.NumberFormat("vi-VN").format(price) + " VNĐ"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Có sẵn", value: true },
                { text: "Hết hàng", value: false }
            ],
            onFilter: (value : boolean | React.Key, record : VaccineDetail) => record.status === value,
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

    const batchColumns = [
        {
            title: "Số hiệu lô",
            dataIndex: "batchNumber",
            key: "batchNumber",
        },
        {
            title: "Ngày sản xuất",
            dataIndex: "manufacturingDate",
            key: "manufacturingDate",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "expiryDate",
            key: "expiryDate",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Nhà cung cấp",
            dataIndex: "supplier",
            key: "supplier",
        },
        {
            title: "Số lượng ban đầu",
            dataIndex: "initialQuantity",
            key: "initialQuantity",
            render: (value: number) => value.toLocaleString("vi-VN")
        },
        {
            title: "Số hàng trong kho",
            dataIndex: "quantityInStock",
            key: "quantityInStock",
            render: (value: number) => value.toLocaleString("vi-VN")
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
                                            <img src={selectedVaccine.image} alt="Vaccine" style={{width: "60%"}}/>
                                        </div>
                                        <p><strong>Nhà sản xuất:</strong> {selectedVaccine.manufacturer}</p>
                                        <p><strong>Giá:</strong> {selectedVaccine.price.toLocaleString()} VNĐ</p>
                                        <p><strong>Trạng thái:</strong> {selectedVaccine.status ? "Có sẵn" : "Hết hàng"}
                                        </p>
                                        <p><strong>Cần thiết:</strong> {selectedVaccine.isNecessary ? "Có" : "Không"}
                                        </p>
                                        <p><strong>Số mũi tiêm:</strong> {selectedVaccine.injectionsCount}</p>
                                    </div>

                                    <div className="vaccine-detail-mananger-popups-right">
                                        <div className="detail-section">
                                            <strong>1. Mô tả:</strong>
                                            <div dangerouslySetInnerHTML={{__html: selectedVaccine.description}}/>
                                        </div>

                                        <div className="detail-section">
                                            <strong>2. Tác dụng phụ:</strong>
                                            <div dangerouslySetInnerHTML={{__html: selectedVaccine.sideEffect}}/>
                                        </div>

                                        <div className="detail-section">
                                            <strong>3. Bệnh phòng ngừa:</strong>
                                            <div dangerouslySetInnerHTML={{__html: selectedVaccine.diseasePrevented}}/>
                                        </div>

                                        <div className="detail-section">
                                            <strong>4. Vị trí tiêm:</strong>
                                            <div style={{marginLeft: "16px"}}>{selectedVaccine.injectionSite}</div>
                                        </div>

                                        <div className="detail-section">
                                            <strong>5. Ghi chú:</strong>
                                            <div dangerouslySetInnerHTML={{__html: selectedVaccine.notes}}/>
                                        </div>

                                        <div className="detail-section">
                                            <strong>6. Tương tác Vaccine:</strong>
                                            <div
                                                dangerouslySetInnerHTML={{__html: selectedVaccine.vaccineInteractions}}/>
                                        </div>

                                        <div className="detail-section">
                                            <strong>7. Tác dụng không mong muốn:</strong>
                                            <div
                                                dangerouslySetInnerHTML={{__html: selectedVaccine.undesirableEffects}}/>
                                        </div>

                                        <div className="detail-section">
                                            <strong>8. Cách bảo quản:</strong>
                                            <div style={{marginLeft: "16px"}}>{selectedVaccine.preserve}</div>
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
                                                    <Card style={{marginBottom: "10px"}}
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
                                                                    dataSource={vaccineDetails.injectionSchedules.sort((a, b) => a.injectionNumber - b.injectionNumber)}
                                                                    renderItem={injection => (
                                                                        <List.Item>
                                                                            <div className="injection-item">
                                                                                <div>
                                                                                    <Badge
                                                                                        status={injection.isRequired ? "success" : "default"}
                                                                                        text={`Tổng Số Mũi ${injection.injectionNumber}`}
                                                                                    />
                                                                                    <span className="injection-month">{injection.injectionMonth}</span>
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
                            <TabPane tab="Kho Vaccine" key="3">
                                <div className="inventory-section">
                                    <div className="inventory-header">
                                        <h3>Thông Tin Kho Vaccine - {selectedVaccine.name}</h3>
                                    </div>
                                    <div className="inventory-content">
                                        {getVaccineBatches().length > 0 ? (
                                            <Table
                                                dataSource={getVaccineBatches()}
                                                columns={batchColumns}
                                                rowKey="batchNumber"
                                                pagination={false}
                                                bordered
                                                className="inventory-table"
                                            />
                                        ) : (
                                            <div className="no-inventory-message">
                                                <p>Chưa có thông tin lô vaccine trong kho.</p>
                                            </div>
                                        )}
                                    </div>
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