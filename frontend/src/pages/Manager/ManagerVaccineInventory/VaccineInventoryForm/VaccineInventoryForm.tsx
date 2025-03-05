import React from "react";
import { Form, Input, DatePicker, InputNumber, Button, Card, Row, Col, Typography, Divider, Select } from "antd";
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import {useVaccineInventoryForm} from "./useVaccineInventoryForm.ts";
import "./VaccineInventoryForm.scss";
import {ArrowLeftOutlined} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const VaccineInventoryForm: React.FC = () => {
    const { navigate, form, isEditMode, vaccineDetail, vaccineInventoryDetailById, vaccineDetailById, onFinish } = useVaccineInventoryForm();

    return (
        <ManagerLayout>
            <Card className="vaccine-inventory-form-card">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/manager/inventory-vaccines")}
                    className="back-button"
                    style={{marginBottom: "20px"}}
                >
                    Quay lại danh sách
                </Button>
                <Title level={2}>{isEditMode ? `Chỉnh sửa lô vaccine ${vaccineDetailById?.name}` : "Thêm lô vaccine mới"}</Title>
                <Divider />

                <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={true}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12}>
                                {isEditMode && vaccineInventoryDetailById ? (
                                    <h3> Vắc Xin : {vaccineDetailById?.name}</h3>
                                ) : (
                                    <Form.Item name="vaccineId" label="Vaccine" rules={[{ required: true, message: "Vui lòng chọn vaccine" }]}>
                                        <Select placeholder="Chọn vaccine" disabled={isEditMode} loading={!vaccineDetail}>
                                            {vaccineDetail?.map(vaccine => (
                                                <Option key={vaccine.vaccineId} value={vaccine.vaccineId}>
                                                    {vaccine.name} ({vaccine.manufacturer})
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )}
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item name="batchNumber" label="Số hiệu lô" rules={[{ required: true, message: "Vui lòng nhập số hiệu lô" }]}>
                                <Input placeholder="Nhập số hiệu lô" className="input-field" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="manufacturingDate" label="Ngày sản xuất" rules={[{ required: true, message: "Vui lòng chọn ngày sản xuất" }]}>
                                <DatePicker className="date-picker" format="YYYY-MM-DD" placeholder="Chọn ngày sản xuất" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item name="expiryDate" label="Ngày hết hạn" rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}>
                                <DatePicker className="date-picker" format="YYYY-MM-DD" placeholder="Chọn ngày hết hạn" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="initialQuantity" label="Số lượng ban đầu" rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}>
                                <InputNumber className="input-number" min={1} placeholder="Nhập số lượng ban đầu" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item name="supplier" label="Nhà cung cấp" rules={[{ required: true, message: "Vui lòng nhập nhà cung cấp" }]}>
                                <Input placeholder="Nhập tên nhà cung cấp" className="input-field" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Form.Item>
                        <Row justify="end" gutter={16}>
                            <Col>
                                <Button className="cancel-button">Hủy</Button>
                            </Col>
                            <Col>
                                <Button type="primary" htmlType="submit" className="submit-button">
                                    {isEditMode ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Card>
        </ManagerLayout>
    );
};

export default VaccineInventoryForm;
