import React, { useState } from "react";
import AdminLayout from "../../../../components/Layout/AdminLayout/AdminLayout.tsx";
import {Button, Form, Input, Select, Switch} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./AdminAccountForm.scss";
import { useNavigate } from "react-router-dom";
import { useAdminAccountForm } from "../useAdminAccount.ts";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import {uploadImageToCloudinary} from "../../../../utils/cloudinary.ts";

const AdminAccountFormPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();
    const { form, dateOfBirth, setDateOfBirth, isEditMode, handleSubmit } = useAdminAccountForm();
    // const [imageFile, setImageFile] = useState<File | null>(null);
    // const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleShowPassword = () => setShowPassword(!showPassword);

    const onFinish = async (values: any) => {

        // let imageUrl = values.imageUrl;
        // if (imageFile) {
        //     try {
        //         imageUrl = await uploadImageToCloudinary(imageFile);
        //     } catch (error) {
        //         notification.error({ message: "Lỗi", description: "Tải ảnh thất bại." });
        //         return;
        //     }
        // }

        const formData = { ...values };
        await handleSubmit(formData);
    };

    return (
        <AdminLayout>
            {/*<div className="account-form-page">*/}
                <div className="form-header">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/admin/account")}
                        className="back-button"
                    >
                        Quay lại danh sách
                    </Button>
                    <h1>{isEditMode ? "Cập nhật tài khoản" : "Tạo tài khoản"}</h1>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="account-form"
                >
                    <div className="formGroup">
                        <div className="form-column">
                            <Form.Item
                                name="userName"
                                label="Tên Đăng Nhập:"
                                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập." }]}
                            >
                                <Input placeholder="Username" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email:"
                                rules={[{ required: true, message: "Vui lòng nhập email." }]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                name="dateOfBirth"
                                label="Ngày tháng năm sinh:"
                                rules={[{ required: true, message: "Vui lòng nhập ngày tháng năm sinh." }]}
                            >
                                <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                            </Form.Item>

                            {!isEditMode ? (
                                <Form.Item
                                    name="password"
                                    label="Mật khẩu:"
                                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                                >
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        suffix={
                                            <span onClick={handleShowPassword} style={{ cursor: "pointer" }}>
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        }
                                    />
                                </Form.Item>
                            ) : (
                                <Form.Item name="isActive" label="Trạng thái hoạt động" valuePropName="checked"
                                               initialValue={true}>
                                    <Switch checkedChildren="Bật" unCheckedChildren="Tắt"/>
                                </Form.Item>
                            )}
                        </div>

                        <div className="form-column">
                            <Form.Item
                                name="fullName"
                                label="Họ và tên:"
                                rules={[{required: true, message: "Vui lòng nhập họ và tên."}]}
                            >
                                <Input placeholder="Fullname" />
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại:"
                                rules={[{ required: true, message: "Vui lòng nhập số điện thoại." }]}
                            >
                                <Input placeholder="Phone Number" />
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="Địa Chỉ:"
                                rules={[{ required: true, message: "Vui lòng nhập địa chỉ." }]}
                            >
                                <Input placeholder="Address" />
                            </Form.Item>

                            <Form.Item name="role" label="Quyền:">
                                <Select placeholder="Chọn quyền" defaultValue="Customer">
                                    <Select.Option value="Customer">Customer</Select.Option>
                                    <Select.Option value="Doctor">Doctor</Select.Option>
                                    <Select.Option value="Staff">Staff</Select.Option>
                                    <Select.Option value="Manager">Manager</Select.Option>
                                    <Select.Option value="Admin">Admin</Select.Option>
                                </Select>
                            </Form.Item>
                            

                        </div>

                        {/*    {isEditMode && (*/}
                        {/*        <Form.Item name="imageUrl" label="Ảnh minh họa:">*/}
                        {/*            <Upload*/}
                        {/*                listType="picture-card"*/}
                        {/*                showUploadList={false}*/}
                        {/*                beforeUpload={(file) => {*/}
                        {/*                    setImageFile(file);*/}
                        {/*                    setPreviewUrl(URL.createObjectURL(file));*/}
                        {/*                    return false;*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                {previewUrl ? (*/}
                        {/*                    <img src={previewUrl} alt="Xem trước" style={{ width: "100%" }} />*/}
                        {/*                ) : isEditMode ? (*/}
                        {/*                    <img src={imageUrl} alt="Xem trước" style={{ width: "100%" }} />*/}
                        {/*                ) : (*/}
                        {/*                    "+ Upload"*/}
                        {/*                )}*/}
                        {/*            </Upload>*/}
                        {/*        </Form.Item>*/}
                        {/*    )}*/}
                        </div>

                    <div style={{display: "flex", justifyContent: "end"}}>
                        <Button type="primary" htmlType="submit" className="button-input">
                            {isEditMode ? "Cập nhật tài khoản" : "Tạo tài khoản"}
                        </Button>
                    </div>
                </Form>
            {/*</div>*/}
        </AdminLayout>
    );
};

export default AdminAccountFormPage;
