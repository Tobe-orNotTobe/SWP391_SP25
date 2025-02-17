import { useState } from "react";
import { Form } from "antd";
import { VaccineDetail } from "../../../types/Vaccine";

export const useVaccineModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  // Mở modal tạo mới
  const handleCreate = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleEdit = (record: VaccineDetail) => {
    setIsEditMode(true);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Xử lý gửi form
  const handleSubmit = (values: VaccineDetail) => {
    console.log("Dữ liệu gửi lên:", values);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    console.log("Xóa vaccine có id:", id);
  };

  return {
    isModalOpen,
    isEditMode,
    form,
    handleDelete,
    handleCreate,
    handleEdit,
    handleSubmit,
    setIsModalOpen,
  };
};
