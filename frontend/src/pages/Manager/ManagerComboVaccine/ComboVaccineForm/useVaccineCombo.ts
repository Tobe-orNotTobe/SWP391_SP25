import { useEffect, useState } from "react";
import { Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useVaccineDetail, useComboVaccineDetailById } from "../../../../hooks/useVaccine";
import { apiAddComboVaccine, apiUpdateComboVaccine } from "../../../../apis/apiVaccine";
import { PostVaccineComboDetail } from "../../../../interfaces/Vaccine";
import { AxiosError } from "axios";
import {toast} from "react-toastify";


export const useVaccineComboForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);


    const [initialEditorContent, setInitialEditorContent] = useState("");


    const [editorContent, setEditorContent] = useState({
        description: ""
    });

    const { vaccineDetail } = useVaccineDetail();
    const { comboVaccineDetail } = useComboVaccineDetailById(Number(id));

    // console.log(comboVaccineDetail)

    useEffect(() => {
        if (isEditMode && comboVaccineDetail) {
            setInitialEditorContent(comboVaccineDetail.description || "");

            setEditorContent({
                description: comboVaccineDetail.description || ""
            });

            form.setFieldsValue({
                comboName: comboVaccineDetail.comboName,
                totalPrice: comboVaccineDetail.totalPrice,
                isActive: comboVaccineDetail.isActive,
                vaccines: comboVaccineDetail.vaccines.map((v, index) => ({
                    vaccineId: v.vaccine.id,
                    order: v.order ?? index + 1,
                    intervalDays: v.intervalDays ?? 0,
                })),
            });
        }
    }, [comboVaccineDetail, form, isEditMode]);

    const handleEditorChange = (field : string, content: string) => {
        setEditorContent(prev => ({
            ...prev,
            [field]: content
        }));

        // The form field is set by TinyMCE, we just need to track the content separately
        form.setFieldsValue({
            [field]: content
        });
    };

    const onFinish = async (values: PostVaccineComboDetail) => {
        // Use the content from TinyMCE editor stored in our state
        const payload = {
            comboName: values.comboName,
            ...editorContent,
            totalPrice: values.totalPrice,
            isActive: values.isActive,
            vaccines: values.vaccines.map((vaccine: any, index: number) => ({
                vaccineId: vaccine.vaccineId,
                order: vaccine.order ?? index + 1, // Nếu không có, đặt mặc định theo thứ tự
                intervalDays: vaccine.intervalDays ?? 0,
            })),
        };

        try {
            let response;
            if (isEditMode) {
                response = await apiUpdateComboVaccine(Number(id), payload);
            } else {
                response = await apiAddComboVaccine(payload);
            }

            console.log(response);
            if (response.isSuccess) {
                toast.success(isEditMode ? "Cập nhật thành công" : "Thêm mới thành công")
                navigate("/manager/combo-vaccines");
            }
        } catch (error : unknown) {
            if (error instanceof AxiosError) {
                toast.error(`${error.response?.data?.errorMessages}`);
            } else {
                toast.error("Lỗi Không Xác Định");
            }
        }
    };

    return {
        form,
        onFinish,
        vaccineDetail,
        isEditMode,
        navigate,
        handleEditorChange,
        initialEditorContent
    };
};