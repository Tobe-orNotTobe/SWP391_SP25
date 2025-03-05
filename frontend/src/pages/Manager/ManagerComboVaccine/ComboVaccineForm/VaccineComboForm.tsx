import React from "react";
import {Form, Input, Button, Select, Switch, InputNumber} from "antd";
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
                        rules={[{ required: true, message: "Vui lòng nhập  giá tiền cho combo" }]}
                    >
                        <InputNumber placeholder="Nhập Giá Tiền của combo"></InputNumber>

                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Danh sách vaccine"
                        name="vaccineIds"
                    >
                        <Select mode="multiple" showSearch placeholder="Chọn vaccine" optionFilterProp="children">
                            {[...new Map(vaccineDetail.map(v => [v.vaccineId, v])).values()].map((vaccine) => (
                                <Option key={vaccine.vaccineId} value={vaccine.vaccineId}>
                                    {vaccine.name} ({vaccine.price})
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