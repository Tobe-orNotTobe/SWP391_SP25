import React, {useState} from "react";
import { Table, Button, Modal, Input } from "antd";
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

    const [searchText, setSearchText] = useState<string>("");

    // console.log(comboVaccineDetail);
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
            sorter: (a: GetVaccineComboDetail, b: GetVaccineComboDetail) => a.comboId - b.comboId,
        },
        {
            title: "Tên Combo",
            dataIndex: "comboName",
            key: "comboName",
            sorter: (a: GetVaccineComboDetail, b: GetVaccineComboDetail) => a.comboName.localeCompare(b.comboName),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            sorter: (a : any, b : any) => a.description.localeCompare(b.description),
            render: (text : any) => <div dangerouslySetInnerHTML={{ __html: text }} />
        },
        {
            title: "Tổng giá",
            dataIndex: "totalPrice",
            key: "totalPrice",
            sorter: (a: GetVaccineComboDetail, b: GetVaccineComboDetail) => a.totalPrice - b.totalPrice,
            render: (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            filters: [
                { text: "Đang hoạt động", value: true },
                { text: "Ngừng hoạt động", value: false },
            ],
            onFilter: (value: boolean | React.Key, record: GetVaccineComboDetail) => record.isActive === value,
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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const comboVaccinedetailCheck  = Array.isArray(comboVaccineDetail) ? comboVaccineDetail : [];

    const filteredData = comboVaccinedetailCheck.filter(
        (item: GetVaccineComboDetail) =>
            item.comboName.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText)
    );


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

                <Input.Search
                    placeholder="Tìm kiếm theo tên hoặc mô tả"
                    onChange={handleSearch}
                    style={{ marginBottom: 16, width: 300 }}
                />
                <Table
                    columns={columns}
                    dataSource={filteredData}
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
                                <div className="combo-vaccine-info-value">{new Intl.NumberFormat("vi-VN").format(selectedCombo.totalPrice)} VNĐ</div>
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
                                    <div key={vaccine.vaccine.id} className="combo-vaccine-item">
                                        <div className="combo-vaccine-item-price">
                                            <strong>Thứ tự:</strong> {vaccine.order}
                                        </div>

                                        <div className="combo-vaccine-item-name">
                                            {vaccine.vaccine.name}
                                        </div>

                                        <div className="combo-vaccine-item-image">
                                            <img src={vaccine.vaccine.image} alt={vaccine.vaccine.name}/>
                                        </div>

                                        <div className="combo-vaccine-item-price">
                                            <strong>Khoảng cách ngày:</strong> {vaccine.intervalDays} ngày
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