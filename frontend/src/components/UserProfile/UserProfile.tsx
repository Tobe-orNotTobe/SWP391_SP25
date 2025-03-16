import React, { useState } from "react";
import { Modal, Button, Form, Input, Upload, Col, Row } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUserProfileDetail } from "./useUserProfile";
import type { UserProfile } from "../../interfaces/Account.ts";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully.ts";
import { uploadImageToCloudinary } from "../../utils/cloudinary.ts";
import { apiChangePassword, apiUpdateProfileUser } from "../../apis/apiAccount.ts";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import "./UserProfile.scss"

const UserProfile: React.FC = () => {
    const { sub } = IsLoginSuccessFully();
    const { userProfile } = useUserProfileDetail();
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(userProfile?.imageUrl || "");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(userProfile?.imageUrl || "");

    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    const handleFileChange = (file: File) => {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setFile(file);
    };

    const handleChangePassword = async () => {
        const formattedData = {
            oldPassword : oldPassword,
            newPassword : newPassword,
        }
        try{
            const response = await apiChangePassword(formattedData);
            if(response.isSuccess) {
                toast.success("Thay Đổi Mật Khẩu Thành Công");
            }
            setIsPasswordModalVisible(false);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }catch (err : unknown){
            if(err instanceof AxiosError){
                toast.error(`${err.response?.data?.errorMessages}`);
            }else{
                toast.error("Lỗi Không Xác Định")
            }
        }
    };


    const handleUpdateProfile = async (values: UserProfile) => {
        setLoading(true);

        try {
            let uploadedImageUrl = imageUrl;
            if (file) {
                uploadedImageUrl = await uploadImageToCloudinary(file);
                setImageUrl(uploadedImageUrl);
            }

            const formattedValues = {
                id: sub,
                fullName: values.fullName,
                userName: values.userName,
                phoneNumber: values.phoneNumber,
                address: values.address,
                dateOfBirth: values.dateOfBirth,
                imageUrl: uploadedImageUrl,
            };

            const response = await apiUpdateProfileUser(formattedValues);
            if (response.isSuccess) {
                toast.success("Cập nhật thông tin thành công!");
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.errorMessages || "Lỗi API!");
            } else {
                toast.error("Lỗi không xác định!");
            }
        } finally {
            setLoading(false);
        }
    };

    if(!userProfile) {
        return (<div className="user-profile"> Loading</div>)
    }

    return (
        <div className="user-profile-background">
            <div className="user-profile">
                <div className="profile-container">
                    <div className="profile-left">
                        <img src={userProfile.imageUrl} alt="Profile" className="profile-image" />
                    </div>
                    <div className="profile-right">
                        <h2 className="profile-name">{userProfile.fullName}</h2>
                        <div className="profile-details">
                            <div className="profile-item"><strong>Username:</strong> {userProfile.userName}</div>
                            <div className="profile-item"><strong>Fullname:</strong> {userProfile.fullName}</div>
                            <div className="profile-item"><strong>Phone:</strong> {userProfile.phoneNumber}</div>
                            <div className="profile-item"><strong>Address:</strong> {userProfile.address}</div>
                            <div className="profile-item"><strong>Date of Birth:</strong> {new Date(userProfile.dateOfBirth).toLocaleDateString()}</div>
                        </div>
                        <div className="profile-actions">
                            <Button type="primary" onClick={() => setIsUpdateModalVisible(true)}>Cập nhật thông tin</Button>
                            <Button type="default" onClick={() => setIsPasswordModalVisible(true)}>Thay đổi mật khẩu</Button>
                        </div>
                    </div>
                </div>

                {/* Modal cập nhật thông tin */}
                <Modal title="Cập nhật thông tin" open={isUpdateModalVisible} onCancel={() => setIsUpdateModalVisible(false)} footer={null}>
                    <Form layout="vertical" onFinish={handleUpdateProfile} initialValues={userProfile}>
                        <Row gutter={24}>
                            {/* Cột bên trái - Ảnh đại diện */}
                            <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                                <Form.Item label="Ảnh đại diện">
                                    <Upload
                                        beforeUpload={(file) => {
                                            handleFileChange(file);
                                            return false;
                                        }}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />} loading={loading}>Tải ảnh lên</Button>
                                    </Upload>
                                    <img src={previewUrl} alt="Preview" style={{ width: "100%", marginTop: "10px", borderRadius: "10px" }} />
                                </Form.Item>
                            </Col>

                            {/* Cột bên phải - Thông tin cá nhân */}
                            <Col xs={24} sm={16}>
                                <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}>
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
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading}>Lưu thay đổi</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>

            {/* Modal đổi mật khẩu */}
            <Modal
                title="Thay đổi mật khẩu"
                open={isPasswordModalVisible}
                onCancel={() => setIsPasswordModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleChangePassword}>
                    <Form.Item
                        name="oldPassword"
                        label="Mật khẩu cũ"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
                        ]}
                    >
                        <Input.Password value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                message: "Mật khẩu phải có ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!",
                            },
                        ]}
                    >
                        <Input.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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
