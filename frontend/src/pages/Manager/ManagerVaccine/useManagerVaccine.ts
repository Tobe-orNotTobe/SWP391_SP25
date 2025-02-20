import { useState, useEffect } from "react";
import { Form, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { VaccineDetail } from "../../../types/Vaccine";
import { apiAddVaccine, apiUpdateVaccine } from "../../../apis/apiVaccine";
import { useVaccineDetail } from "../../../hooks/useVaccine";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
export const useVaccineForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { vaccineDetail } = useVaccineDetail();

  useEffect(() => {
    if (isEditMode && vaccineDetail) {
      const currentVaccine = Array.isArray(vaccineDetail) 
        ? vaccineDetail.find(v => v.vaccineId === Number(id))
        : null;

      if (currentVaccine) {
        form.setFieldsValue(currentVaccine);
        setImageUrl(currentVaccine.image);
      }
    }
  }, [isEditMode, id, vaccineDetail, form]);

  const handleUploadImage = async (file: File) => {
    try {
      const response = await uploadImageToCloudinary(file);
      setImageUrl(response);
      form.setFieldsValue({ image: response });
      return false;
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Lỗi tải ảnh",
        description: "Đã có lỗi xảy ra khi tải ảnh lên.",
      });
      return false;
    }
  };

  const handleSubmit = async (values: VaccineDetail) => {
    setLoading(true);
    try {
      let response;
      
      if (isEditMode) {
        response = await apiUpdateVaccine(id, values); // Cập nhật vaccine (PUT)
      } else {
        response = await apiAddVaccine(values); // Thêm mới vaccine (POST)
      }

      if (response.isSuccess) {
        notification.success({
          message: "Thành công",
          description: isEditMode ? "Đã cập nhật vaccine thành công" : "Đã thêm vaccine thành công",
        });
        setTimeout(() => navigate("/manager/vaccines"), 1000);
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: response?.message || "Lỗi không xác định",
        });
      }
    } catch (error) {
      console.error("Error submitting vaccine:", error);
      notification.error({
        message: "Lỗi khi gửi thông tin vaccine",
        description: "Không thể gửi dữ liệu lên server. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  return { form, file, setFile, imageUrl, loading, handleUploadImage, handleSubmit, isEditMode, navigate };
};
