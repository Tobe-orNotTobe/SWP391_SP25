import React from 'react';
import {useScheduleVaccinationForm} from "./useVaccinationScheduleForm.ts";
import {
    Form,
    Input,
    Button,
    InputNumber,
    Card,
    Space,
    Divider,
    Select,
    Checkbox
} from 'antd';
import ManagerLayout from "../../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import { GoPlus } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import './ScheduleVaccinationForm.scss';

const ScheduleVaccinationForm: React.FC = () => {
    const { navigate, form, formData, isEditMode, vaccineDetail, vaccineLoading, handleSelectVaccine, handleSubmit } = useScheduleVaccinationForm();


    return (
        <>
            <ManagerLayout>
                <Card title={isEditMode ? 'Chỉnh sửa lịch tiêm vaccine' : 'Thêm Lịch tiêm vaccine'} className="schedule-form-container">
                    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={formData ?? undefined} className="schedule-form">
                        <div className="schedule-form__age-range">
                            <Form.Item
                                name="ageRangeStart"
                                label="Độ tuổi từ (tuổi)"
                                rules={[{required: true, message: 'Please enter start age!'}]}
                                className="schedule-form__age-item"
                            >
                                <InputNumber min={0} className="schedule-form__input-full"/>
                            </Form.Item>

                            <Form.Item
                                name="ageRangeEnd"
                                label="Đến (tuổi)"
                                rules={[{required: true, message: 'Please enter end age!'}]}
                                className="schedule-form__age-item"
                            >
                                <InputNumber min={0} className="schedule-form__input-full"/>
                            </Form.Item>
                        </div>

                        <Form.Item name="notes" label="Ghi Chú" className="schedule-form__notes">
                            <Input.TextArea rows={3}/>
                        </Form.Item>

                        <Divider orientation="left" className="schedule-form__divider">Chi Tiết Vaccine</Divider>

                        {/* Danh sách vaccine */}
                        <Form.List name="vaccineScheduleDetails">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <Card
                                            key={field.key}
                                            title={`Vaccine ${field.name + 1}`}
                                            extra={<Button danger onClick={() => remove(field.name)} className="schedule-form__delete-btn">Xóa</Button>}
                                            className="schedule-form__vaccine-card"
                                        >
                                            <Form.Item
                                                key={field.key}
                                                name={[field.name, "vaccineId"]}
                                                label="Vaccine"
                                                rules={[{ required: true, message: "Chọn vaccine!" }]}
                                                className="schedule-form__vaccine-select"
                                            >
                                                <Select
                                                    placeholder="Chọn vaccine"
                                                    loading={vaccineLoading}
                                                    onChange={(value) => handleSelectVaccine(value, field.name)}
                                                >
                                                    {vaccineDetail?.map((item) => (
                                                        <Select.Option key={item.vaccineId} value={item.vaccineId}>
                                                            {item.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                            <Form.List name={[field.name, 'injectionSchedules']}>
                                                {(subFields, { add: addSub, remove: removeSub }) => (
                                                    <>
                                                        {subFields.map((subField) => (
                                                            <div key={subField.key} className="schedule-form__injection-row">
                                                                <Form.Item
                                                                    name={[subField.name, 'injectionNumber']}
                                                                    label="Số lần tiêm chủng"
                                                                    rules={[{ required: true, message: 'Nhập số liều!' }]}
                                                                    className="schedule-form__dose-number"
                                                                >
                                                                    <InputNumber min={1} />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    name={[subField.name, 'injectionMonth']}
                                                                    label="Tháng tiêm"
                                                                    rules={[{ required: true, message: 'Nhập tháng tiêm!' }]}
                                                                    className="schedule-form__injection-month"
                                                                >
                                                                    <InputNumber min={0} />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    name={[subField.name, 'isRequired']}
                                                                    label="Bắt Buộc"
                                                                    valuePropName="checked"
                                                                    className="schedule-form__required"
                                                                >
                                                                    <Checkbox/>
                                                                </Form.Item>

                                                                <Form.Item
                                                                    name={[subField.name, 'notes']}
                                                                    label="Ghi chú"
                                                                    className="schedule-form__injection-notes">
                                                                    <Input.TextArea rows={1} />
                                                                </Form.Item>

                                                                <Button
                                                                    danger
                                                                    onClick={() => removeSub(subField.name)}
                                                                    className="schedule-form__remove-injection-btn"
                                                                >
                                                                    <MdDeleteOutline/> Xóa
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            type="dashed"
                                                            onClick={() => addSub()}
                                                            className="schedule-form__add-injection-btn"
                                                        >
                                                            <GoPlus/>Thêm Mũi Tiêm
                                                        </Button>
                                                    </>
                                                )}
                                            </Form.List>
                                        </Card>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} className="schedule-form__add-vaccine-btn">
                                        <GoPlus/> Thêm Vaccine
                                    </Button>
                                </>
                            )}
                        </Form.List>


                        <Form.Item className="schedule-form__actions">
                            <Space className="schedule-form__buttons">
                                <Button type="primary" htmlType="submit" >
                                    {isEditMode ? 'Cập nhật' : ' Tạo mới'}
                                </Button>
                                <Button onClick={() => navigate('/manager/schedule-vaccines')}>Hủy</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </ManagerLayout>
        </>
    );
}

export default ScheduleVaccinationForm;