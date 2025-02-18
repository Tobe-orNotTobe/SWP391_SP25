import React from "react";
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Upload } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import { useVaccineModal} from "./useManagerVaccine";
import { VaccineDetail } from "../../../types/Vaccine.ts";
import ManagerLayout from "../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import "./ManagerVaccinePage.scss"

import { useVaccineDetail } from "../../../hooks/useVaccine.ts";

const ManagerVaccine: React.FC = () => {

    const {
        form,

        file,
        imageUrl,
        deletingId,

        isModalOpen,
        isEditMode,
        isDetailModalOpen,

        selectedVaccine,
        setIsModalOpen,
        setFile,

        handleDelete,
        handleCreate,
        handleEdit,
        handleSubmit,
        handleUploadImage,
        handleDetailClick,
        handleDetailModalClose,
    } = useVaccineModal();

    const { vaccineDetail } = useVaccineDetail();

    const columns = [
        { title: "ID", dataIndex: "vaccineId", key: "id" },
        {
            title: "Hình ảnh",
            dataIndex: "image",
            key: "image",
            render: (image: string) => <img src={image} alt="Vaccine" style={{ width: 50, height: 50 }} />
        },
        {
            title: "Tên Vaccine",
            dataIndex: "name",
            key: "name",
            render: (name: string) => name.slice(0, 10) + "..."
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (description: string) => description.slice(0, 10) + "..."
        },
        {
            title: "Nhà sản xuất",
            dataIndex: "manufacturer",
            key: "manufacturer",
            render: (manufacturer: string) => manufacturer.slice(0, 10) + "..."
        },
        {
            title: "Tác dụng phụ",
            dataIndex: "sideEffect",
            key: "sideEffect",
            render: (sideEffect: string) => sideEffect.slice(0, 10) + "..."
        },
        {
            title: "Bệnh phòng ngừa",
            dataIndex: "diseasePrevented",
            key: "diseasePrevented",
            render: (diseasePrevented: string) => diseasePrevented.slice(0, 10) + "..."
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
            render: (status: boolean) => (status ? "Có sẵn" : "Hết hàng")
        },
        {
            title: "Cần thiết",
            dataIndex: "isNecessary",
            key: "isNecessary",
            render: (isNecessary: boolean) => (isNecessary ? "Có" : "Không")
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: VaccineDetail) => (
                <>
                    <Button
                        onClick={() => handleDetailClick(record)}
                        style={{ color: "white", marginLeft: 10, backgroundColor: "#007bff" }}
                    >
                        Chi tiết
                    </Button>
                    <Button
                        onClick={() => handleEdit(record)}
                        style={{ color: "white", marginLeft: 10, backgroundColor: "#28a745" }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        loading={deletingId === record.vaccineId}
                        onClick={() => handleDelete(record.vaccineId)}
                        style={{ color: "white", marginLeft: 10, backgroundColor: "#dc3545" }}
                    >
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <ManagerLayout>
            <Button
                type="primary"
                icon={<TiPlusOutline />}
                onClick={handleCreate}
                style={{ marginBottom: 16, float: "right" }}
            >
                Thêm Vaccine
            </Button>

            <Table
                columns={columns}
                dataSource={Array.isArray(vaccineDetail) ? vaccineDetail : []}
                rowKey="id"
                pagination={{ pageSize: 6, showSizeChanger: false }}
            />

            {/* Modal Chi Tiết Vaccine */}
            <Modal
                title="Chi Tiết Vaccine"
                open={isDetailModalOpen}
                onCancel={handleDetailModalClose}
                footer={null}
                width={1000}
            >
                {selectedVaccine && (
                    <div className="vaccine-detail-mananger-popups">
                        <div className="vaccine-detail-mananger-popups-left">
                            <h3>{selectedVaccine.name}</h3>
                            <img src={selectedVaccine.image} alt="Vaccine"/>
                            <p><strong>Nhà sản xuất:</strong> {selectedVaccine.manufacturer}</p>
                            <p><strong>Giá:</strong> {selectedVaccine.price.toLocaleString()} VNĐ</p>
                            <p><strong>Trạng thái:</strong> {selectedVaccine.status ? "Có sẵn" : "Hết hàng"}</p>
                            <p><strong>Cần thiết:</strong> {selectedVaccine.isNecessary ? "Có" : "Không"}</p>
                            <p><strong>Số mũi tiêm:</strong> {selectedVaccine.injectionsCount}</p>
                        </div>

                        <div className="vaccine-detail-mananger-popups-right">
                            <p><strong>Mô tả:</strong> {selectedVaccine.description}</p>

                            <p><strong>Tác dụng phụ:</strong> {selectedVaccine.sideEffect}</p>
                            <p><strong>Bệnh phòng ngừa:</strong> {selectedVaccine.diseasePrevented}</p>
                            <p><strong>Vị trí tiêm:</strong> {selectedVaccine.injectionSite}</p>
                            <p><strong>Ghi chú:</strong> {selectedVaccine.notes}</p>
                            <p><strong>Tương tác Vaccine:</strong> {selectedVaccine.vaccineInteractions}</p>
                            <p><strong>Tác dụng không mong muốn:</strong> {selectedVaccine.undesirableEffects}</p>
                            <p><strong>Cách bảo quản:</strong> {selectedVaccine.preserve}</p>

                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Thêm/Sửa Vaccine */}
            <Modal
                title={isEditMode ? "Cập nhật Vaccine" : "Thêm Vaccine"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={1000}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div className="vaccine-detail-manager-container">
                        {/* Phần upload ảnh */}
                        <div className="vaccine-detail-mananger-left">
                            <Form.Item
                                label="Hình ảnh"
                                name="image"
                                rules={[{ required: true, message: "Vui lòng tải ảnh lên" }]}
                            >
                            <div>
                                <Upload
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={async (file: File) => {
                                        setFile(file);
                                        await handleUploadImage(file);  // Upload ảnh khi người dùng chọn
                                        return false;  // Không để file được tự động upload
                                    }}
                                >
                                    <Button>Upload ảnh</Button>
                                </Upload>
                                {file && <p>{file.name}</p>}
                                {imageUrl && <img src={imageUrl} alt="Vaccine" style={{ width: "100%", marginTop: 10 }} />}
                            </div>
                            </Form.Item>
                        </div>

                        {/* Phần nhập thông tin */}
                        <div  className="vaccine-detail-mananger-right" >
                            <Form.Item name="name" label="Tên Vaccine" rules={[{ required: true, message: "Vui lòng nhập tên vaccine" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label="Mô Tả" rules={[{ required: true, message: "Vui lòng nhập mô tả cho vaccine" }]}>
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="vaccine-detail-mananger-right">
                            <Form.Item name="manufacturer" label="Nhà sản xuất" rules={[{ required: true, message: "Vui lòng nhập nhà sản xuất" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="sideEffect" label="Tác dụng phụ" rules={[{ required: true, message: "Vui lòng nhập tác dụng phụ của vaccine" }]}>
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="vaccine-detail-mananger-right">
                            <Form.Item name="diseasePrevented" label="Bệnh phòng ngừa" rules={[{ required: true, message: "Vui lòng nhập bênh phòng ngừa của vaccine" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="price" label="Giá" rules={[{ required: true, message: "Vui lòng nhập giá vaccine" }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </div>

                        <div className="vaccine-detail-mananger-right">
                            <Form.Item name="status" label="Trạng thái" valuePropName="checked">
                                <Switch checkedChildren="Có sẵn" unCheckedChildren="Hết hàng" />
                            </Form.Item>
                            <Form.Item name="isNecessary" label="Cần thiết" valuePropName="checked">
                                <Switch checkedChildren="Có" unCheckedChildren="Không" />
                            </Form.Item>
                        </div>


                        <div className="vaccine-detail-mananger-right">
                            <Form.Item name="injectionSite" label="Vị trí tiêm" rules={[{ required: true, message: "Vui lòng nhập vị trí tiêm" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="notes" label="Ghi Chú" rules={[{ required: true, message: "vui lòng nhập  các lưu ý" }]}>
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="vaccine-detail-mananger-right">
                            <Form.Item name="vaccineInteractions" label="Tương Tác Vaccine" rules={[{ required: true, message: "Vui lòng nhập tương tác vaccine" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="undesirableEffects" label="Tác Dụng Không Mong Muốn" rules={[{ required: true, message: "vui lòng nhập tác dụng không mong muốn" }]}>
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="vaccine-detail-mananger-right">
                            <Form.Item name="preserve" label="Cách bảo quản"  rules={[{ required: true, message: "Vui lòng nhập cách bảo quản" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="injectionsCount" label="Số Mũi Tiêm" rules={[{ required: true, message: "Vui lòngs số mũi tiêm" }]} >
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </ManagerLayout>
    );
};

export default ManagerVaccine;
