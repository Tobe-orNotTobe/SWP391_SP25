import React from "react";
import { Button, Table, Modal, Form, Input, InputNumber, Switch } from "antd";
import { ColumnType } from "antd/es/table";
import { TiPlusOutline } from "react-icons/ti";
import { useVaccineDetail } from "../../../hooks/useVaccine";
import { useVaccineModal } from "./useManagerVaccine";
import { VaccineDetail } from "../../../types/Vaccine";
import ManagerLayout from "../../../components/Layout/ManagerLayout";

const ManagerVaccine: React.FC = () => {
  const { vaccineDetail, loading } = useVaccineDetail();

  const {
    isModalOpen,
    isEditMode,
    form,
    handleCreate,
    handleEdit,
    handleSubmit,
    setIsModalOpen,
  } = useVaccineModal();

  const columns: ColumnType<VaccineDetail>[] = [
    {
      title: "Tên Vaccine",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nhà sản xuất",
      dataIndex: "manufacturer",
      key: "manufacturer",
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
      render: (status: boolean) => <Switch checked={status} disabled />,
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
      title: "Cần thiết",
      dataIndex: "isNecessary",
      key: "isNecessary",
      render: (isNecessary: boolean) => (isNecessary ? "Có" : "Không"),
    },
    {
      title: "Số mũi tiêm",
      dataIndex: "injectionsCount",
      key: "injectionsCount",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: undefined, record: VaccineDetail) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <>
        <ManagerLayout/>
        <Button
            type="primary"
            icon={<TiPlusOutline />}
            onClick={handleCreate}
            style={{ marginBottom: 16 }}
        >
            Thêm Vaccine
        </Button>

        <Table
            columns={columns}
            dataSource={vaccineDetail}
            loading={loading}
            rowKey="id"
        />

        <Modal
            title={isEditMode ? "Cập nhật Vaccine" : "Thêm Vaccine"}
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
    </>
  );
};

export default ManagerVaccine;
