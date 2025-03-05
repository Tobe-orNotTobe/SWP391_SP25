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

    useEffect(() => {
        if (isEditMode && comboVaccineDetail) {
            const uniqueVaccineIds = [...new Set(comboVaccineDetail.vaccines.map((v) => v.vaccineId))];

            // Set the initial editor content for TinyMCE
            setInitialEditorContent(comboVaccineDetail.description || "");

            // Set the editor content state
            setEditorContent({
                description: comboVaccineDetail.description || ""
            });

            // Set other form fields
            form.setFieldsValue({
                comboName: comboVaccineDetail.comboName,
                totalPrice: comboVaccineDetail.totalPrice,
                isActive: comboVaccineDetail.isActive,
                vaccineIds: uniqueVaccineIds,
                // We don't set description here since it's managed by TinyMCE
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
        const payload: PostVaccineComboDetail = {
            comboName: values.comboName,
            description: editorContent.description,
            totalPrice: values.totalPrice,
            isActive: values.isActive,
            vaccineIds: values.vaccineIds,
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