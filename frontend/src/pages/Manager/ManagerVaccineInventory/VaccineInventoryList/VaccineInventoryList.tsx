import React from "react";
import {Table, Button, Modal, Form, Input, DatePicker, InputNumber, Row, Col} from "antd";
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import {useVaccineInventoryStockDetail} from "../../../../hooks/useVaccine.ts";
import {useVaccineInventoryList} from "./useVaccineInventoryList.ts";
import "./VaccineInventoryList.scss";
import {VaccineInventoryStock} from "../../../../interfaces/Vaccine.ts";
import {TbListDetails} from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { SearchOutlined } from "@ant-design/icons";
import {FiEdit2} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";

type GroupedVaccine = VaccineInventoryStock & { batches: VaccineInventoryStock[] };

const VaccineInventoryList: React.FC = () => {
    const { vaccineInventoryStockDetail } = useVaccineInventoryStockDetail();
    const {
        form,
        selectedVaccine,
        modalVisible,
        addBatchModalVisible,
        searchKeyword,
        isSearching,
        searchPerformed,
        vaccineInventoryList,
        setSearchKeyword,
        handleSearch,
        resetSearch,
        handleCreateBatch,
        handleEditBatch,
        handleDeleteBatch,
        handleOpenModal,
        handleCloseModal,
        handleOpenAddBatchModal,
        setAddBatchModalVisible,
        handleAddVaccineInventory
    } = useVaccineInventoryList(vaccineInventoryStockDetail);

    const columns = [
        {
            title: "Vaccine ID",
            dataIndex: "vaccineId",
            key: "vaccineId",
            sorter: (a: VaccineInventoryStock, b: VaccineInventoryStock) => a.vaccineId - b.vaccineId,
        },
        {
            title: "Tên Vaccine",
            dataIndex: "name",
            key: "name",
            sorter: (a : VaccineInventoryStock, b :VaccineInventoryStock) => a.name.localeCompare(b.name),
        },
        {
            title: "Nơi Sản Xuất",
            dataIndex: "manufacturer",
            key: "manufacturer",
            sorter: (a :VaccineInventoryStock, b :VaccineInventoryStock) => a.manufacturer.localeCompare(b.manufacturer),
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Còn hàng", value: true },
                { text: "Hết hàng", value: false },
            ],
            onFilter: (value :boolean | React.Key, record : VaccineInventoryStock) => record.status === value,
            render: (status : boolean) => (
                <span className={status ? "status-active" : "status-inactive"}>
                {status ? "Còn hàng" : "Hết hàng"}
            </span>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_: unknown, record: GroupedVaccine) => (
                <div className="vaccine-action-buttons">
                    <Button onClick={() => handleOpenModal(record)} className="detail-button">
                        <TbListDetails/>Chi tiết
                    </Button>
                    <Button onClick={() => handleOpenAddBatchModal(record)} className="add-button">
                        <FaPlus/>Thêm Lô Vaccine
                    </Button>
                </div>
            ),
        },
    ];

    const batchColumns = [
        {
            title: "Vaccine Inventory Id",
            dataIndex: "vaccineInventoryId",
            key: "vaccineInventoryId",
        },
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
            render: (initialQuantity: number) => initialQuantity.toLocaleString("vi-VN")
        },
        {
            title: "Số hàng trong kho",
            dataIndex: "quantityInStock",
            key: "quantityInStock",
            render: (quantityInStock: number) => quantityInStock.toLocaleString("vi-VN")
        },
        {
            title: "Thao Tác",
            key: "batchAction",
            render: (_: unknown, record: VaccineInventoryStock) => (
                <div className="vaccine-action-buttons">
                    <Button onClick={() => handleEditBatch(record)} className="edit-button">
                        <FiEdit2 />Chỉnh sửa
                    </Button>
                    <Button onClick={() => handleDeleteBatch(record)} className="delete-button">
                        <MdDeleteOutline/>Xóa
                    </Button>
                </div>
            )
        }
    ];

    return (
        <ManagerLayout>
            <div className="vaccine-inventory-list-container">
                <div className="vaccine-inventory-list-header">
                    <h1>Quản lí kho Vaccine</h1>

                    <div className="search-container">
                        <Row gutter={16} className="search-row" align="middle" justify="space-between">
                            <Col xs={24} sm={16} md={12} lg={8}>
                                <Input.Search
                                    placeholder="Tìm kiếm theo tên, mã vaccine, nhà sản xuất..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onSearch={handleSearch}
                                    enterButton={
                                        <Button type="primary" style={{color: "#2A388F"}} icon={<SearchOutlined  style={{color: "white"}} />}>
                                            <span style={{color : "white"}}>Tim Kiem</span>
                                        </Button>}
                                    loading={isSearching}
                                />
                            </Col>
                            {searchPerformed && (
                                <Col>
                                    <Button onClick={resetSearch}>Xóa tìm kiếm</Button>
                                </Col>
                            )}
                            <Col className="create-batch-button-container">
                                <Button
                                    type="primary"
                                    icon={<FaPlus />}
                                    onClick={handleCreateBatch}
                                    className="create-batch-button"
                                >
                                    Tạo Lô Vaccine Mới
                                </Button>
                            </Col>
                        </Row>

                        {searchPerformed && (
                            <div className="search-results-info">
                                <p>Kết quả tìm kiếm cho: <strong>"{searchKeyword}"</strong> - {vaccineInventoryList.length} kết quả</p>
                            </div>
                        )}
                    </div>
                </div>

                <Table
                    dataSource={vaccineInventoryList}
                    columns={columns}
                    rowKey="vaccineId"
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: true }}
                    locale={{ emptyText: searchPerformed ? "Không tìm thấy kết quả phù hợp" : "Không có dữ liệu" }}
                />

                <Modal
                    title={`Chi tiết Vaccine: ${selectedVaccine?.name || ""}`}
                    open={modalVisible}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={1400}
                >
                    <Table
                        dataSource={selectedVaccine?.batches || []}
                        columns={batchColumns}
                        rowKey="batchNumber"
                        pagination={false}
                        bordered
                    />
                </Modal>

                <Modal
                    title={`Thêm Lô Mới - ${selectedVaccine?.name || ""}`}
                    open={addBatchModalVisible}
                    onCancel={() => setAddBatchModalVisible(false)}
                    onOk={handleAddVaccineInventory}
                    okText="Thêm"
                    cancelText="Hủy"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="batchNumber" label="Số hiệu lô" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="manufacturingDate" label="Ngày sản xuất" rules={[{ required: true }]}>
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item name="expiryDate" label="Ngày hết hạn" rules={[{ required: true }]}>
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item name="initialQuantity" label="Số lượng ban đầu" rules={[{ required: true }]}>
                            <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item name="supplier" label="Nhà cung cấp" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ManagerLayout>
    );
};

export default VaccineInventoryList;