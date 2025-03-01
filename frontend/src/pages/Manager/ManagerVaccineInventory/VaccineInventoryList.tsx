import React, { useState } from "react";
import {Table, Button, Modal, Form, Input, DatePicker, InputNumber, notification, Row, Col} from "antd";
import ManagerLayout from "../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import { useVaccineInventoryStockDetail } from "../../../hooks/useVaccine.ts";
import "./VaccineInventoryList.scss";
import {VaccineInventoryResponse, VaccineInventoryStock} from "../../../interfaces/Vaccine.ts";
import {apiAddVaccineInventory, apiSearchVaccineInventory} from "../../../apis/apiVaccine.ts";
import {AxiosError} from "axios";
import {TbListDetails} from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { SearchOutlined } from "@ant-design/icons";

type GroupedVaccine = VaccineInventoryStock & { batches: VaccineInventoryStock[] };

// Type for API response


const VaccineInventoryList: React.FC = () => {
    const { vaccineInventoryStockDetail } = useVaccineInventoryStockDetail();
    const [selectedVaccine, setSelectedVaccine] = useState<GroupedVaccine | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addBatchModalVisible, setAddBatchModalVisible] = useState(false);
    const [form] = Form.useForm();

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState<GroupedVaccine[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleSearch = async () => {
        try {
            if (!searchKeyword.trim()) {
                notification.warning({
                    message: "Vui lòng nhập từ khóa tìm kiếm",
                });
                return;
            }

            setIsSearching(true);
            const response = await apiSearchVaccineInventory(searchKeyword);

            // Extract result array from the API response
            const resultData = (response as VaccineInventoryResponse).result || [];

            // Group the search results by vaccineId
            const groupedResults: Record<number, GroupedVaccine> = {};

            resultData.forEach((item) => {
                const vaccineId = item.vaccineId;

                if (!groupedResults[vaccineId]) {
                    // Initialize a new group with this vaccine
                    groupedResults[vaccineId] = {
                        ...item,
                        batches: []
                    };
                }

                // Add this item as a batch
                groupedResults[vaccineId].batches.push(item);
            });

            const finalResults = Object.values(groupedResults);
            setSearchResults(finalResults);
            setSearchPerformed(true);

            if (finalResults.length === 0) {
                notification.info({
                    message: "Không tìm thấy kết quả",
                    description: "Không có vaccine nào phù hợp với từ khóa tìm kiếm",
                });
            }
        } catch (error) {
            console.error("Search error:", error);
            notification.error({
                message: "Lỗi khi tìm kiếm vaccine",
                description: "Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại sau.",
            });
        } finally {
            setIsSearching(false);
        }
    };

    const resetSearch = () => {
        setSearchKeyword("");
        setSearchResults([]);
        setSearchPerformed(false);
    };

    const groupedData = (vaccineInventoryStockDetail ?? []).reduce((acc: Record<string, GroupedVaccine>, item: VaccineInventoryStock) => {
        if (!acc[item.vaccineId]) {
            acc[item.vaccineId] = { ...item, batches: [] };
        }
        acc[item.vaccineId].batches.push(item);
        return acc;
    }, {} as Record<string, GroupedVaccine>);

    const vaccineInventoryList = searchPerformed ? searchResults : Object.values(groupedData);

    const columns = [
        {
            title: "Vaccine ID",
            dataIndex: "vaccineId",
            key: "vaccineId",
        },
        {
            title: "Tên Vaccine",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Nơi Sản Xuất",
            dataIndex: "manufacturer",
            key: "manufacturer",
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (status: boolean) => (
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
        },
        {
            title: "Số hàng trong kho",
            dataIndex: "quantityInStock",
            key: "quantityInStock",
        },
    ];

    const handleOpenModal = (record: GroupedVaccine) => {
        setSelectedVaccine(record);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedVaccine(null);
    };

    const handleOpenAddBatchModal = (record: GroupedVaccine) => {
        setSelectedVaccine(record);
        form.resetFields();
        setAddBatchModalVisible(true);
    };

    const handleAddVaccineInventory = async () => {
        try {
            const values = await form.validateFields();

            // Thêm vaccineId và các trường cần thiết
            const batchData = {
                ...values,
                vaccineId: selectedVaccine?.vaccineId,
                manufacturingDate: values.manufacturingDate?.format('YYYY-MM-DD'),
                expiryDate: values.expiryDate?.format('YYYY-MM-DD'),
                quantityInStock: values.initialQuantity
            };

            const response = await apiAddVaccineInventory(batchData);

            if(response.isSuccess) {
                notification.success({
                    message: "Thêm lô vaccine thành công"
                });
                setAddBatchModalVisible(false);
            } else {
                notification.error({
                    message: "Thêm vaccine thất bại"
                });
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: "Thêm lô Vaccine Thất bại",
                    description: error.response?.data?.error || "Lỗi không xác định từ server",
                });
            } else {
                console.error("Lỗi không xác định:", error);
                notification.error({
                    message: "Lỗi không xác định",
                    description: "Vui lòng thử lại sau.",
                });
            }
        }
    };

    return (
        <ManagerLayout>
            <div className="vaccine-inventory-list-container">
                <div className="vaccine-inventory-list-header">
                    <h1>Quản lí kho Vaccine</h1>

                    <div className="search-container">
                        <Row gutter={16} className="search-row">
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
                        </Row>

                        {searchPerformed && (
                            <div className="search-results-info">
                                <p>Kết quả tìm kiếm cho: <strong>"{searchKeyword}"</strong> - {searchResults.length} kết quả</p>
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
                    width={800}
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