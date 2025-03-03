import React from "react";
import { Form, Input, Button, InputNumber, Select, Switch } from "antd";
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout";
import { useVaccineComboForm } from "./useVaccineCombo";
import "./VaccineComboForm.scss"
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Option } = Select;

const VaccineComboForm: React.FC = () => {
    const { form, onFinish, vaccineDetail, isEditMode, navigate } = useVaccineComboForm();

    return (
        <ManagerLayout>
            <div className="vaccine-combo-form-container">
            <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate("/manager/combo-vaccines")}
                className="back-button"
                style={{marginBottom: "20px"}}
            >
                Quay lại danh sách
            </Button>
            
            <h1>{isEditMode ? "Chỉnh Sửa Combo Vaccine" : "Thêm Combo Vaccine"}</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        className="form-item"
                        label="Tên Combo"
                        name="comboName"
                        rules={[{ required: true, message: "Vui lòng nhập tên combo vaccine!" }]}
                    >
                        <Input placeholder="Nhập tên combo vaccine" />
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả combo vaccine" rows={4} />
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Tổng giá"
                        name="totalPrice"
                        rules={[{ required: true, message: "Vui lòng nhập tổng giá!" }]}
                    >
                        <InputNumber
                            min={0}
                            step={1000}
                            style={{ width: "100%" }}
                            formatter={(value) => `${value} VND`}
                        />
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Danh sách vaccine"
                        name="vaccineIds"
                    >
                        <Select mode="multiple" showSearch placeholder="Chọn vaccine" optionFilterProp="children">
                            {[...new Map(vaccineDetail.map(v => [v.vaccineId, v])).values()].map((vaccine) => (
                                <Option key={vaccine.vaccineId} value={vaccine.vaccineId}>
                                    {vaccine.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Trạng thái"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                    </Form.Item>

                    <Form.Item className="buttons">
                        <Button type="primary" htmlType="submit">
                            {isEditMode ? "Cập Nhật" : "Thêm Mới"}
                        </Button>
                        <Button onClick={() => navigate("/manager/combo-vaccines")}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </ManagerLayout>
    );
};

export default VaccineComboForm;
