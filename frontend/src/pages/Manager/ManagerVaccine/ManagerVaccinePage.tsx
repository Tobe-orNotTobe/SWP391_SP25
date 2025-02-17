import React from "react";
import { Button, Table, Modal, Form, Input, InputNumber, Switch } from "antd";
import { ColumnType } from "antd/es/table";
import { TiPlusOutline } from "react-icons/ti";

import { useVaccineModal } from "./useManagerVaccine";
import { VaccineDetail } from "../../../types/Vaccine";
import ManagerLayout from "../../../components/Layout/ManagerLayout/ManagerLayout.tsx"; // Import ManagerLayout

const ManagerVaccine: React.FC = () => {

    // Cái này sẽ có APi lấy riêng lên, do đ có dữ liệu sẵn nên t quyết định lấy đại hehe
    const vaccineDetail: VaccineDetail[] = [
        {
            id: 1,
            name: "Vaccine A",
            description: "Description A",
            manufacturer: "Manufacturer A",
            sideEffect: "Side Effect A",
            diseasePrevented: "Disease A",
            price: 100000,
            status: true,
            isNecessary: true,
            image: "imageA.jpg",
            injectionSite: "Arm",
            notes: "Note A",
            vaccineInteractions: "None",
            undesirableEffects: "None",
            preserve: "Cool",
            injectionsCount: 2,
            distance: 0,
            scheduleId: 1,
        },
    ];

    const {
        isModalOpen,
        isEditMode,
        form,
        handleDelete,
        handleCreate,
        handleEdit,
        handleSubmit,
        setIsModalOpen,
    } = useVaccineModal();

    // Chủ yếu là các thuộc tính thoi

    const columns: ColumnType<VaccineDetail>[] = [
        {
            title: "Id",
            dataIndex: "id",
            key: "Id",
        },
        {
            title: "Hình ảnh",
            dataIndex: "image",
            key: "image",
            render: (image: string) => <img src={image} alt="Vaccine" style={{ width: 50, height: 50 }} />,
        },
        {
            title: "Tên Vaccine",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Nhà sản xuất",
            dataIndex: "manufacturer",
            key: "manufacturer",
        },
        {
            title: "Tác dụng phụ",
            dataIndex: "sideEffect",
            key: "sideEffect",
        },
        {
            title: "Bệnh phòng ngừa",
            dataIndex: "diseasePrevented",
            key: "diseasePrevented",
        },
        {
            title: "Giá (VNĐ)",
            dataIndex: "price",
            key: "price",
            render: (price: number) => price.toLocaleString() + " VNĐ",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: boolean) => <span>{status ? "Có sẵn" : "Hết hàng"}</span>,
        },
        {
            title: "Cần thiết",
            dataIndex: "isNecessary",
            key: "isNecessary",
            render: (isNecessary: boolean) => (isNecessary ? "Có" : "Không"),
        },
        {
            title: "Vị trí tiêm",
            dataIndex: "injectionSite",
            key: "injectionSite",
        },
        {
            title: "Ghi chú",
            dataIndex: "notes",
            key: "notes",
        },
        {
            title: "Tương tác Vaccine",
            dataIndex: "vaccineInteractions",
            key: "vaccineInteractions",
        },
        {
            title: "Tác dụng không mong muốn",
            dataIndex: "undesirableEffects",
            key: "undesirableEffects",
        },
        {
            title: "Cách bảo quản",
            dataIndex: "preserve",
            key: "preserve",
        },
        {
            title: "Số mũi tiêm",
            dataIndex: "injectionsCount",
            key: "injectionsCount",
        },
        {
            title: "Khoảng cách",
            dataIndex: "distance",
            key: "distance",
        },
        {
            title: "Lịch tiêm",
            dataIndex: "scheduleId",
            key: "scheduleId",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: VaccineDetail) => (
                <>
                    <Button
                        onClick={() => handleEdit(record)}
                        style={{ color: "white", marginLeft: 10, backgroundColor: "green" }}  // Nút Chỉnh sửa màu xanh lá
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        onClick={() => handleDelete(record.id)}  // Thêm chức năng Xóa
                        style={{ color: "white", marginLeft: 10, backgroundColor: "red" }}  // Nút Xóa màu đỏ
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
                dataSource={vaccineDetail}
                rowKey="id"
                pagination={{
                    pageSize: 6,  // Số vaccine hiển thị mỗi trang
                    showSizeChanger: false,  // Không cho phép thay đổi số lượng vaccine mỗi trang
                }}
            />

            <Modal
                title={isEditMode ? "Thêm Vaccine" : "Cập nhật Vaccine"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Tên Vaccine"
                        rules={[{ required: true, message: "Vui lòng nhập tên vaccine" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="manufacturer"
                        label="Nhà sản xuất"
                        rules={[{ required: true, message: "Vui lòng nhập nhà sản xuất" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[{ required: true, message: "Vui lòng nhập giá vaccine" }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái" valuePropName="checked">
                        <Switch checkedChildren="Có sẵn" unCheckedChildren="Hết hàng" />
                    </Form.Item>
                    <Form.Item name="sideEffect" label="Tác dụng phụ">
                        <Input />
                    </Form.Item>
                    <Form.Item name="diseasePrevented" label="Bệnh phòng ngừa">
                        <Input />
                    </Form.Item>
                    <Form.Item name="isNecessary" label="Cần thiết" valuePropName="checked">
                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                    </Form.Item>
                    <Form.Item name="injectionsCount" label="Số mũi tiêm">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </ManagerLayout>
    );
};

export default ManagerVaccine;
