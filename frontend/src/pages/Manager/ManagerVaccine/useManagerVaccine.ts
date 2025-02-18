import { useState } from "react";
import { Form } from "antd";
import { VaccineDetail } from "../../../types/Vaccine.ts";
import {uploadImageToCloudinary} from "../../../utils/cloudinary.ts";

export const useVaccineModal = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();


  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineDetail | null>(null);


  const handleCreate = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalOpen(true);
  };


  const handleEdit = (record: VaccineDetail) => {
    setIsEditMode(true);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };


  const handleSubmit = (values: VaccineDetail) => {
    console.log("Dữ liệu gửi lên:", values);
    setIsModalOpen(false);
  };


  const handleDelete = (id: number) => {
    console.log("Xóa vaccine có id:", id);
  };


  const handleDetailClick = (record: VaccineDetail) => {
    setSelectedVaccine(record);
    setIsDetailModalOpen(true);
  };


  const handleDetailModalClose = () => {
    setSelectedVaccine(null);
    setIsDetailModalOpen(false);
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


    isDetailModalOpen,
    selectedVaccine,
    handleDetailClick,
    handleDetailModalClose,
  };
};

export const useImageUpload = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadImage = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setFile(file);

      const uploadedImageUrl = await uploadImageToCloudinary(file);
      setImageUrl(uploadedImageUrl);

      return uploadedImageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải ảnh lên';
      setError(errorMessage);
      console.error('Upload error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetImage = () => {
    setImageUrl(null);
    setFile(null);
    setError(null);
  };

  return {
    setFile,
    imageUrl,
    file,
    isLoading,
    error,
    handleUploadImage,
    resetImage
  };
};