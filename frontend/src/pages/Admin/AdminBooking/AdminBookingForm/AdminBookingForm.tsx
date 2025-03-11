// import React, {useEffect, useState} from "react";
// import {useNavigate} from "react-router-dom";
// import {useAdminAccountForm, useGetAllUser} from "../../AdminAccount/useAdminAccount.ts";
// import AdminLayout from "../../../../components/Layout/AdminLayout/AdminLayout.tsx";
// import {Button, Form, Input, Select, Switch} from "antd";
// import {ArrowLeftOutlined} from "@ant-design/icons";
// import {FaEye, FaEyeSlash} from "react-icons/fa";
// import {AccountDetailResponse} from "../../../../interfaces/Account.ts";
// import {ChildDetailResponse} from "../../../../interfaces/Child.ts";
// import {useGetChildsByUserId, useMyChilds} from "../../../../hooks/useChild.ts";
//
// const AdminBookingFormPage: React.FC = () => {
//     const navigate = useNavigate();
//     const { form, dateOfBirth, setDateOfBirth, isEditMode, handleSubmit } = useAdminAccountForm();
//
//     const {users, fetchAllUser} = useGetAllUser();
//     const { childs, fetchChilds } = useGetChildsByUserId();
//
//     useEffect(() => {
//         fetchAllUser().then();
//     })
//
//     const [ selectedUser, setSelectedUser ] = useState<AccountDetailResponse | null>(null);
//     const [ selectedChild, setSelectedChild ] = useState<ChildDetailResponse | null>(null);
//
//     return (
//         <AdminLayout>
//             <div className="account-form-page">
//                 <div className="form-header">
//                     <Button
//                         icon={<ArrowLeftOutlined />}
//                         onClick={() => navigate("/admin/booking")}
//                         className="back-button"
//                     >
//                         Quay lại danh sách
//                     </Button>
//                     <h1>{isEditMode ? "Cập nhật lịch tiêm" : "Tạo lịch tiêm"}</h1>
//                 </div>
//
//                 <label>Chọn user</label> <br/>
//                 <Select
//                     placeholder="Chọn user"
//                     onChange={(value) => {
//                         setSelectedUser(value);
//                         fetchChilds(value).then();
//                     }}
//                 >
//                     {users.map((user) => (
//                         <Select.Option key={user.id} value={user.id}>
//                             {user.userName}
//                         </Select.Option>
//                     ))}
//                 </Select>
//
//
//                 {selectedUser && (
//                     <Select
//                         placeholder="Chọn child"
//                         onChange={(value) => setSelectedChild(value)}
//                     >
//                         {childs.map((child) => (
//                             <Select.Option key={child.childId} value={child.childId}>
//                                 {child.fullName}
//                             </Select.Option>
//                         ))}
//                     </Select>
//                 )}
//
//                 {selectedChild && (
//                     <Form
//                     form={form}
//                     layout="vertical"
//                     onFinish={handleSubmit}
//                     className="account-form"
//                 >
//                     <div className="formGroup">
//                         <div className="form-column">
//
//                             <Form.Item name="role" label="Quyền:">
//                                 <Select placeholder="Chọn quyền" defaultValue="Customer">
//                                     <Select.Option value="Customer">Customer</Select.Option>
//                                     <Select.Option value="Doctor">Doctor</Select.Option>
//                                     <Select.Option value="Staff">Staff</Select.Option>
//                                     <Select.Option value="Manager">Manager</Select.Option>
//                                     <Select.Option value="Admin">Admin</Select.Option>
//                                 </Select>
//                             </Form.Item>
//
//                             <Form.Item
//                                 name="userName"
//                                 label="Tên Đăng Nhập:"
//                                 rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập." }]}
//                             >
//                                 <Input placeholder="Username" />
//                             </Form.Item>
//
//                             <Form.Item
//                                 name="email"
//                                 label="Email:"
//                                 rules={[{ required: true, message: "Vui lòng nhập email." }]}
//                             >
//                                 <Input placeholder="Email" />
//                             </Form.Item>
//
//                             <Form.Item
//                                 name="dateOfBirth"
//                                 label="Ngày tháng năm sinh:"
//                                 rules={[{ required: true, message: "Vui lòng nhập ngày tháng năm sinh." }]}
//                             >
//                                 <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
//                             </Form.Item>
//
//                             {/*{!isEditMode && (*/}
//                             {/*    <Form.Item*/}
//                             {/*        name="password"*/}
//                             {/*        label="Mật khẩu:"*/}
//                             {/*        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}*/}
//                             {/*    >*/}
//                             {/*        <Input*/}
//                             {/*            type={showPassword ? "text" : "password"}*/}
//                             {/*            placeholder="Password"*/}
//                             {/*            suffix={*/}
//                             {/*                <span onClick={handleShowPassword} style={{ cursor: "pointer" }}>*/}
//                             {/*                    {showPassword ? <FaEyeSlash /> : <FaEye />}*/}
//                             {/*                </span>*/}
//                             {/*            }*/}
//                             {/*        />*/}
//                             {/*    </Form.Item>*/}
//                             {/*)}*/}
//                         </div>
//
//                         <div className="form-column">
//                             <Form.Item
//                                 name="fullName"
//                                 label="Họ và tên:"
//                                 rules={[{ required: true, message: "Vui lòng nhập họ và tên." }]}
//                             >
//                                 <Input placeholder="Fullname" />
//                             </Form.Item>
//
//                             <Form.Item
//                                 name="phoneNumber"
//                                 label="Số điện thoại:"
//                                 rules={[{ required: true, message: "Vui lòng nhập số điện thoại." }]}
//                             >
//                                 <Input placeholder="Phone Number" />
//                             </Form.Item>
//
//                             <Form.Item
//                                 name="address"
//                                 label="Địa Chỉ:"
//                                 rules={[{ required: true, message: "Vui lòng nhập địa chỉ." }]}
//                             >
//                                 <Input placeholder="Address" />
//                             </Form.Item>
//
//                             <Form.Item name="role" label="Quyền:">
//                                 <Select placeholder="Chọn quyền" defaultValue="Customer">
//                                     <Select.Option value="Customer">Customer</Select.Option>
//                                     <Select.Option value="Doctor">Doctor</Select.Option>
//                                     <Select.Option value="Staff">Staff</Select.Option>
//                                     <Select.Option value="Manager">Manager</Select.Option>
//                                     <Select.Option value="Admin">Admin</Select.Option>
//                                 </Select>
//                             </Form.Item>
//
//
//                         </div>
//                     </div>
//
//                     { isEditMode && (
//                         <div className="active-form" style={{paddingLeft: "26px"}}>
//                             <Form.Item name="isActive" label="Trạng thái hoạt động" valuePropName="checked" initialValue={true}>
//                                 <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
//                             </Form.Item>
//                         </div>
//                     )}
//
//                     <div style={{display: "flex", justifyContent: "end"}}>
//                         <Button type="primary" htmlType="submit" className="button-input">
//                             {isEditMode ? "Cập nhật tài khoản" : "Tạo tài khoản"}
//                         </Button>
//                     </div>
//                 </Form>
//                 )}
//
//             </div>
//         </AdminLayout>
//     );
// };
//
// export default AdminBookingFormPage;
