import { useState, useEffect } from "react";
import { Form, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { VaccineDetail } from "../../../../interfaces/Vaccine";
import { apiAddVaccine, apiUpdateVaccine } from "../../../../apis/apiVaccine";
import { useVaccineDetail } from "../../../../hooks/useVaccine";
import { uploadImageToCloudinary } from "../../../../utils/cloudinary";
import {AxiosError} from "axios";
import {toast} from "react-toastify";

export const useVaccineForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { vaccineDetail } = useVaccineDetail();

  // Store rich text editor content
  const [editorContent, setEditorContent] = useState<Record<string, string>>({
    description: '',
    diseasePrevented: '',
    sideEffect: '',
    vaccineInteractions: '',
    undesirableEffects: '',
    notes: ''
  });

  useEffect(() => {
    if (isEditMode && vaccineDetail) {
      const currentVaccine = Array.isArray(vaccineDetail)
          ? vaccineDetail.find(v => v.vaccineId === Number(id))
          : null;

      if (currentVaccine) {
        form.setFieldsValue(currentVaccine);
        setImageUrl(currentVaccine.image);

        // Initialize editor content from existing data
        if (currentVaccine.description) setEditorContent(prev => ({ ...prev, description: currentVaccine.description }));
        if (currentVaccine.diseasePrevented) setEditorContent(prev => ({ ...prev, diseasePrevented: currentVaccine.diseasePrevented }));
        if (currentVaccine.sideEffect) setEditorContent(prev => ({ ...prev, sideEffect: currentVaccine.sideEffect }));
        if (currentVaccine.vaccineInteractions) setEditorContent(prev => ({ ...prev, vaccineInteractions: currentVaccine.vaccineInteractions }));
        if (currentVaccine.undesirableEffects) setEditorContent(prev => ({ ...prev, undesirableEffects: currentVaccine.undesirableEffects }));
        if (currentVaccine.notes) setEditorContent(prev => ({ ...prev, notes: currentVaccine.notes }));
      }
    }
  }, [isEditMode, id, vaccineDetail, form]);

  const handleEditorChange = (field: string, content: string) => {
    setEditorContent(prev => ({ ...prev, [field]: content }));
    form.setFieldsValue({ [field]: content });
  };

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
      // Merge form values with rich text editor content
      const submitData = {
        ...values,
        ...editorContent
      };

      let response;

      if (isEditMode) {
        response = await apiUpdateVaccine(id, submitData);
      } else {
        response = await apiAddVaccine(submitData);
      }

      if (response.isSuccess) {
        toast.success(isEditMode ? "Đã cập nhật vaccine thành công" : "Đã thêm vaccine thành công");
        setTimeout(() => navigate("/manager/vaccines"), 1000);

      }
    } catch (error : unknown) {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.errorMessages}`);
      } else {
        toast.error("Lỗi Không Xác Định");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    file,
    setFile,
    imageUrl,
    loading,
    handleUploadImage,
    handleSubmit,
    isEditMode,
    navigate,
    handleEditorChange,
    editorContent
  };
};