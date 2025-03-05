import React, { useState } from "react";
import { Modal, Button, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./UserProfile.scss";
import { useUserProfileDetail } from "./useUserProfile";
import type { ResetPasswordUserProfile, UserProfile } from "../../interfaces/Auth.ts";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully.ts";
import { uploadImageToCloudinary} from "../../utils/cloudinary.ts";
import {apiUpdateProfileUser} from "../../apis/apiAuth.ts";
import {toast} from "react-toastify";
import {AxiosError} from "axios";

const UserProfile: React.FC = () => {
    const { sub } = IsLoginSuccessFully();
    const { userProfile } = useUserProfileDetail();
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(userProfile?.imageUrl || "");
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (values: UserProfile) => {
        const formattedValues = {
            id: sub,
            fullName: values.fullName,
            userName: values.userName,
            phoneNumber: values.phoneNumber,
            address: values.address,
            dateOfBirth: values.dateOfBirth,
            imageUrl: imageUrl,
        };

        try{
            const response = await apiUpdateProfileUser(formattedValues);
            if(response.isSuccess) {
                toast.success("Cập nhật thông tin người dùng thành công");
            }
        }catch (err : unknown){
            if (err instanceof AxiosError) {
                toast.error(`${err.response?.data?.errorMessages}`)
            }else{
                toast.error("Lỗi không xác định")
            }
        }
    };

    const handleChangePassword = (values: ResetPasswordUserProfile) => {
        console.log("Change Password:", values);
        setIsPasswordModalVisible(false);
    };

    const handleImageUpload = async (file: Blob) => {
        setLoading(true);
        try {
            const url = await uploadImageToCloudinary(file);
            setImageUrl(url);
            message.success("Tải ảnh lên thành công!");
        } catch (error) {
          console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (!userProfile) {
        return <div className="user-profile">Loading...</div>;
    }

    return (
        <div className="user-profile">
            <div className="profile-container">
                <div className="profile-left">
                    <img src={userProfile.imageUrl} alt="Profile" className="profile-image" />
                </div>
                <div className="profile-right">
                    <h2 className="profile-name">{userProfile.fullName}</h2>
                    <div className="profile-details">
                        <div className="profile-item"><strong>Username:</strong> <span>{userProfile.userName}</span></div>
                        <div className="profile-item"><strong>Fullname:</strong> <span>{userProfile.fullName}</span></div>
                        <div className="profile-item"><strong>Email:</strong> <span>{userProfile.email}</span></div>
                        <div className="profile-item"><strong>Phone:</strong> <span>{userProfile.phoneNumber}</span></div>
                        <div className="profile-item"><strong>Address:</strong> <span>{userProfile.address}</span></div>
                        <div className="profile-item"><strong>Date of Birth:</strong> <span>{new Date(userProfile.dateOfBirth).toLocaleDateString()}</span></div>
                    </div>
                    <div className="profile-actions">
                        <Button type="primary" onClick={() => setIsUpdateModalVisible(true)}>Cập nhật thông tin</Button>
                        <Button type="default" onClick={() => setIsPasswordModalVisible(true)}>Thay đổi mật khẩu</Button>
                    </div>
                </div>
            </div>

            {/* Modal cập nhật thông tin */}
            <Modal
                title="Cập nhật thông tin"
                open={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleUpdateProfile} initialValues={userProfile}>
                    <Form.Item label="Họ và tên " name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Tên Đăng Nhập" name="userName" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phoneNumber">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ảnh đại diện">
                        <Upload
                            beforeUpload={(file) => {
                                handleImageUpload(file);
                                return false;
                            }}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />} loading={loading}>Tải ảnh lên</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal đổi mật khẩu */}
            <Modal
                title="Thay đổi mật khẩu"
                open={isPasswordModalVisible}
                onCancel={() => setIsPasswordModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleChangePassword}>
                    <Form.Item label="Mật khẩu cũ" name="oldPassword" rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{
                            required: true,
                            message: "Vui lòng nhập mật khẩu mới!"
                        }, {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                            message: "Mật khẩu phải có ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!"
                        }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Đổi mật khẩu</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserProfile;
