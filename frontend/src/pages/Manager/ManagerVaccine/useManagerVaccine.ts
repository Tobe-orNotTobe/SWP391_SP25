import { useState } from "react";
import {Form, notification} from "antd";
import { VaccineDetail } from "../../../types/Vaccine.ts";


import {apiAddVaccine, apiDeleteVaccine} from "../../../apis/apiVaccine.ts";
import {uploadImageToCloudinary} from "../../../utils/cloudinary.ts";



export const useVaccineModal = () => {

  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);


  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);


  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineDetail | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleUploadImage = async (file: File) => {
    try {
      const response = await uploadImageToCloudinary(file);  // Lấy secure_url từ Cloudinary
      setImageUrl(response);
      form.setFieldsValue({
        image: response,
      });
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Lỗi tải ảnh",
        description: "Đã có lỗi xảy ra khi tải ảnh lên.",
      });
    }
  };


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


  const handleSubmit = async (values: VaccineDetail) => {
    console.log("Dữ liệu gửi lên:", values);

    try {

      const response = await apiAddVaccine(values);


      if (response.isSuccess) {

        notification.success({
          message: "Thành công",
          description: "Đã Thêm Vaccine Thành Công"
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        notification.error({
          message: "Có lỗi xảy ra khi thêm vaccine",
          description: response?.message || "Lỗi không xác định",
        });
      }

      setIsModalOpen(false);

    } catch (error) {
      console.error("Error submitting vaccine:", error);
      notification.error({
        message: "Lỗi khi gửi thông tin vaccine",
        description: "Không thể gửi dữ liệu lên server. Vui lòng thử lại!",
      });
    }
  };


  const handleDelete = async (vaccineId: number) => {
    try {
      setDeletingId(vaccineId);
      const response = await apiDeleteVaccine(vaccineId);

      if(response.isSuccess ) {
        notification.success({
          message : response.message,
          description : "Đã Xóa Thành Công"
        })
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        await new Promise(resolve => setTimeout(resolve, 500));
      }else{
        notification.error ({
          message : response.message,
          description : "Có lỗi xảy ra"
        })
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
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
    form,

    file,
    imageUrl,
    deletingId,

    isModalOpen,
    isEditMode,
    isDetailModalOpen,

    selectedVaccine,

    setIsModalOpen,
    setFile,

    handleDelete,
    handleCreate,
    handleEdit,
    handleSubmit,
    handleUploadImage,
    handleDetailClick,
    handleDetailModalClose,

  };
};

