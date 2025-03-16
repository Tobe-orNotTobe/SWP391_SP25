import React from "react";
import { Button, Form, Input, InputNumber, Switch, Upload, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Editor } from '@tinymce/tinymce-react';
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import { useVaccineForm } from "./useManagerVaccine.ts";
import "./ManagerFormVaccine.scss";
import {TinyMCEE_API_KEY} from "../../../../config/cloudinaryConfig.ts";
import {useVaccineDetail} from "../../../../hooks/useVaccine.ts";


const VaccineFormPage: React.FC = () => {
    const {
        navigate,
        isEditMode,
        form,
        handleSubmit,
        previewUrl,
        handleFileChange,
        loading,
        handleEditorChange,
    } = useVaccineForm();

    const {vaccineDetail} = useVaccineDetail();
    return (
        <ManagerLayout>
            <div className="vaccine-form-page">
                <div className="vaccine-form-header">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/manager/vaccines")}
                        className="back-button"
                    >
                        Quay lại danh sách
                    </Button>
                    <h1>{isEditMode ? "Cập nhật Vaccine" : "Thêm Vaccine Mới"}</h1>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="vaccine-form"
                >
                    <div className="vaccine-form-container">
                        <div className="vaccine-form-left">
                            <Form.Item
                                label="Hình ảnh"
                                name="image"
                                rules={[{ required: true, message: "Vui lòng tải ảnh lên" }]}
                                className="image-upload-container"
                            >
                                <div className="image-upload">
                                    <Upload
                                        name="image"
                                        accept="image/*"
                                        showUploadList={false}
                                        beforeUpload={(file: File) => {
                                            handleFileChange(file);
                                            return false;
                                        }}
                                    >
                                        <Button className="upload-button">Chọn ảnh</Button>
                                    </Upload>

                                    {/* Hiển thị ảnh preview */}
                                    {previewUrl && (
                                        <div className="image-preview">
                                            <img
                                                src={previewUrl}
                                                alt="Xem trước ảnh"
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "200px",
                                                    marginTop: "10px"
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Form.Item>
                        </div>

                        {/* Right column - Form fields */}
                        <div className="vaccine-form-right">
                            <div className="form-row">
                                <Form.Item
                                    name="name"
                                    label="Tên Vaccine"
                                    rules={[{ required: true, message: "Vui lòng nhập tên vaccine" }]}
                                    className="form-item"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="manufacturer"
                                    label="Nhà sản xuất"
                                    rules={[{ required: true, message: "Vui lòng nhập nhà sản xuất" }]}
                                    className="form-item"
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="description"
                                label="Mô Tả"
                                rules={[{ required: true, message: "Vui lòng nhập mô tả cho vaccine" }]}
                            >
                                <Editor
                                    apiKey={TinyMCEE_API_KEY}
                                    initialValue=""
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: [
                                            "lists", "code", "link"
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help',
                                        images_upload_handler: () => {
                                            return Promise.reject('Upload không được hỗ trợ');
                                        },
                                        images_upload_url: '',
                                        automatic_uploads: false,
                                    }}
                                    onEditorChange={(content) => handleEditorChange('description', content)}
                                />
                            </Form.Item>

                            <div className="form-row">
                                <Form.Item
                                    name="price"
                                    label="Giá (VNĐ)"
                                    rules={[{ required: true, message: "Vui lòng nhập giá vaccine" }]}
                                    className="form-item"
                                >
                                    <InputNumber style={{ width: "100%" }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                </Form.Item>

                                <Form.Item
                                    name="injectionsCount"
                                    label="Số Mũi Tiêm"
                                    rules={[{ required: true, message: "Vui lòng nhập số mũi tiêm" }]}
                                    className="form-item"
                                >
                                    <InputNumber
                                        style={{ width: "20%" }}
                                        min={1}
                                        max={100}
                                        step={1}
                                        precision={0}
                                        controls
                                    />
                                </Form.Item>
                            </div>

                            <div className="form-row status-row">
                                <Form.Item
                                    name="status"
                                    label="Trạng thái"
                                    valuePropName="checked"
                                    className="form-item"
                                >
                                    <Switch checkedChildren="Có sẵn" unCheckedChildren="Hết hàng" />
                                </Form.Item>

                                <Form.Item
                                    name="isNecessary"
                                    label="Cần thiết"
                                    valuePropName="checked"
                                    className="form-item"
                                >
                                    <Switch checkedChildren="Có" unCheckedChildren="Không" />
                                </Form.Item>

                                <Form.Item
                                    name="isIncompatibility"
                                    label="Tương kỵ với vaccine khác"
                                    valuePropName="checked"
                                    className="form-item"
                                >
                                    <Switch checkedChildren="Có" unCheckedChildren="Không" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="isParentId"
                                label="Vaccine cần phải chích trước"
                                className="form-item"
                            >
                                <Select
                                    placeholder="Chọn vaccine"
                                    style={{ width: '100%' }}
                                    options={vaccineDetail?.map((vaccine) => ({
                                        label: vaccine.name,
                                        value: vaccine.vaccineId
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item
                                name="diseasePrevented"
                                label="Bệnh phòng ngừa"
                                rules={[{ required: true, message: "Vui lòng nhập bệnh phòng ngừa của vaccine" }]}
                            >
                                <Editor
                                    apiKey={TinyMCEE_API_KEY}
                                    initialValue=""
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: [
                                            "lists", "code", "link"
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help',
                                        images_upload_handler: () => {
                                            return Promise.reject('Upload không được hỗ trợ');
                                        },
                                        images_upload_url: '',
                                        automatic_uploads: false,
                                    }}
                                    onEditorChange={(content) => handleEditorChange('diseasePrevented', content)}
                                />
                            </Form.Item>

                            <Form.Item
                                name="sideEffect"
                                label="Tác dụng phụ"
                                rules={[{ required: true, message: "Vui lòng nhập tác dụng phụ của vaccine" }]}
                            >
                                <Editor
                                    apiKey={TinyMCEE_API_KEY}
                                    initialValue=""
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: [
                                            "lists", "code", "link"
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help',
                                        images_upload_handler: () => {
                                            return Promise.reject('Upload không được hỗ trợ');
                                        },
                                        images_upload_url: '',
                                        automatic_uploads: false,
                                    }}
                                    onEditorChange={(content) => handleEditorChange('sideEffect', content)}
                                />
                            </Form.Item>

                            <div className="form-row">
                                <Form.Item
                                    name="injectionSite"
                                    label="Vị trí tiêm"
                                    rules={[{ required: true, message: "Vui lòng nhập vị trí tiêm" }]}
                                    className="form-item"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="preserve"
                                    label="Cách bảo quản"
                                    rules={[{ required: true, message: "Vui lòng nhập cách bảo quản" }]}
                                    className="form-item"
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="vaccineInteractions"
                                label="Tương Tác Vaccine"
                                rules={[{ required: true, message: "Vui lòng nhập tương tác vaccine" }]}
                            >
                                <Editor
                                    apiKey={TinyMCEE_API_KEY}
                                    initialValue=""
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: [
                                            "lists", "code", "link"
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help',
                                        images_upload_handler: () => {
                                            return Promise.reject('Upload không được hỗ trợ');
                                        },
                                        images_upload_url: '',
                                        automatic_uploads: false,
                                    }}
                                    onEditorChange={(content) => handleEditorChange('vaccineInteractions', content)}
                                />
                            </Form.Item>

                            <Form.Item
                                name="undesirableEffects"
                                label="Tác Dụng Không Mong Muốn"
                                rules={[{ required: true, message: "Vui lòng nhập tác dụng không mong muốn" }]}
                            >
                                <Editor
                                    apiKey={TinyMCEE_API_KEY}
                                    initialValue=""
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: [
                                            "lists", "code", "link"
                                        ],
                                        toolbar: "bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat",
                                        content_style: "body { font-size: 14px; }",
                                    }}
                                    onEditorChange={(content) => handleEditorChange('undesirableEffects', content)}
                                />
                            </Form.Item>

                            <Form.Item
                                name="notes"
                                label="Ghi Chú"
                                rules={[{ required: true, message: "Vui lòng nhập các lưu ý" }]}
                            >
                                <Editor
                                    apiKey={TinyMCEE_API_KEY}
                                    initialValue=""
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: [
                                            "lists", "code", "link"
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help',
                                        images_upload_handler: () => {
                                            return Promise.reject('Upload không được hỗ trợ');
                                        },
                                        images_upload_url: '',
                                        automatic_uploads: false,
                                    }}
                                    onEditorChange={(content) => handleEditorChange('notes', content)}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button
                            onClick={() => navigate("/manager/vaccines")}
                            className="cancel-button"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="submit-button"
                        >
                            {isEditMode ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </div>
                </Form>
            </div>
        </ManagerLayout>
    );
};

export default VaccineFormPage;