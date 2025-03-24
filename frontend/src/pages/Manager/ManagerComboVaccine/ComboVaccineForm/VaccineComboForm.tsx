import React from "react";
import {Form, Input, Button, Select, Switch, InputNumber, Space} from "antd";
import { Editor } from '@tinymce/tinymce-react';
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout";
import { useVaccineComboForm } from "./useVaccineCombo";
import "./VaccineComboForm.scss"
import { ArrowLeftOutlined } from "@ant-design/icons";
import {TinyMCEE_API_KEY} from "../../../../config/cloudinaryConfig.ts";

const { Option } = Select;

const VaccineComboForm: React.FC = () => {
    const {
        form,
        onFinish,
        vaccineDetail,
        isEditMode,
        navigate,
        handleEditorChange,
        initialEditorContent
    } = useVaccineComboForm();

    return (
        <ManagerLayout>
            <div className="vaccine-combo-form-container">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/manager/combo-vaccines")}
                    className="back-button"
                    style={{ marginBottom: "20px" }}
                >
                    Quay lại danh sách
                </Button>

                <h1>{isEditMode ? "Chỉnh Sửa Combo Vaccine" : "Thêm Combo Vaccine"}</h1>
                <Form form={form} layout="vertical" onFinish={onFinish}>
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
                        <Editor
                            apiKey={TinyMCEE_API_KEY}
                            initialValue={initialEditorContent}
                            init={{
                                height: 300,
                                menubar: true,
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                ],
                                toolbar:
                                    'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                images_upload_handler: () => {
                                    return Promise.reject('Upload không được hỗ trợ');
                                },
                                images_upload_url: '',
                                automatic_uploads: false,
                            }}
                            onEditorChange={(content) => handleEditorChange('description', content)}
                        />
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Tổng giá tiền"
                        name="totalPrice"
                        rules={[{ required: true, message: "Vui lòng nhập giá tiền cho combo!" }]}
                    >
                        <InputNumber
                            placeholder="Nhập Giá Tiền của combo"
                            style={{ width: "100%" }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>

                    <Form.List name="vaccines">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Space key={key} align="baseline" style={{ display: "flex", width: "100%" }}>
                                        <span>{index + 1}</span> {/* 🔹 Tự động đánh số thứ tự */}

                                        <Form.Item
                                            {...restField}
                                            name={[name, "vaccineId"]}
                                            label="Chọn Vaccine"
                                            rules={[{ required: true, message: "Vui lòng chọn vaccine!" }]}
                                        >
                                            <Select placeholder="Chọn vaccine" style={{ width: 200 }}>
                                                {vaccineDetail.map((vaccine) => (
                                                    <Option key={vaccine.vaccineId} value={vaccine.vaccineId}>
                                                        {vaccine.name} ({new Intl.NumberFormat('vi-VN').format(vaccine.price)} VNĐ)
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, "order"]}
                                            label="Thứ tự"
                                            initialValue={index + 1} // 🔹 Đặt thứ tự mặc định
                                            rules={[{ required: true, message: "Vui lòng nhập thứ tự!" }]}
                                        >
                                            <InputNumber min={1} style={{ width: 80 }} />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, "intervalDays"]}
                                            label="Khoảng cách ngày"
                                            rules={[
                                                { required: true, message: "Vui lòng nhập khoảng cách ngày!" },
                                                { type: "number", max: 365, message: "Khoảng cách ngày không được quá 365!" }
                                            ]}
                                        >
                                            <InputNumber min={0} max={365} style={{ width: 100 }} />
                                        </Form.Item>

                                        <Button type="text" danger onClick={() => remove(name)} />
                                    </Space>
                                ))}

                                <Button type="dashed" onClick={() => add()} block>
                                    + Thêm Vaccine
                                </Button>
                            </>
                        )}
                    </Form.List>

                    <Form.Item
                        className="form-item"
                        label="Trạng thái"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                    </Form.Item>

                    <Form.Item className="buttons">
                        <Button type="primary" htmlType="submit" style={{marginRight : "10px"}}>
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