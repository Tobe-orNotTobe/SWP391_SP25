import { useState, useEffect } from "react";
import { Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { VaccineDetail } from "../../../../interfaces/Vaccine";
import { apiAddVaccine, apiUpdateVaccine } from "../../../../apis/apiVaccine";
import { useVaccineDetail } from "../../../../hooks/useVaccine";
import { uploadImageToCloudinary } from "../../../../utils/cloudinary";
import { toast } from "react-toastify";

export const useVaccineForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const { vaccineDetail } = useVaccineDetail();
  const [file, setFile] = useState<File | null>(null);

  // Store the current image URL (from cloudinary)
  const [imageUrl, setImageUrl] = useState<string>("");

  // URL for preview display (either from existing image or new selected file)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

        // Set both imageUrl and previewUrl to the existing image
        setImageUrl(currentVaccine.image);
        setPreviewUrl(currentVaccine.image);

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

  const handleFileChange = (file: File) => {

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFile(file);

    form.setFieldsValue({ image: file });
  };

  const handleEditorChange = (field: string, content: string) => {
    setEditorContent(prev => ({ ...prev, [field]: content }));
    form.setFieldsValue({ [field]: content });
  };

  const handleSubmit = async (values: VaccineDetail) => {
    setLoading(true);

    let finalImageUrl = imageUrl;

    if (file) { // Only upload if there's a new file
      try {
        finalImageUrl = await uploadImageToCloudinary(file);

      } catch (error) {
        toast.error("Lỗi tải ảnh lên Cloudinary");
        setLoading(false);
        return;
      }
    }

    const submitData = {
      ...values,
      isIncompatible: values.isIncompatibility ?? false,
      ...editorContent,
      image: finalImageUrl,
    };

    console.log("Final Submit Data:", submitData);

    try {
      const response = isEditMode
          ? await apiUpdateVaccine(id, submitData)
          : await apiAddVaccine(submitData);

      if (response.isSuccess) {
        toast.success(isEditMode ? "Cập nhật vaccine thành công" : "Thêm vaccine thành công");
        setTimeout(() => navigate("/manager/vaccines"), 1000);
      }
    } catch (error: unknown) {
      toast.error("Lỗi Không Xác Định");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    file,
    setFile,
    loading,
    handleSubmit,
    isEditMode,
    navigate,
    handleEditorChange,
    editorContent,
    previewUrl,
    handleFileChange,
  };
};