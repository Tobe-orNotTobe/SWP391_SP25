import { useEffect } from "react";
import { Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useVaccineDetail, useComboVaccineDetailById } from "../../../../hooks/useVaccine";
import { apiAddComboVaccine, apiUpdateComboVaccine } from "../../../../apis/apiVaccine";
import { PostVaccineComboDetail } from "../../../../interfaces/Vaccine";

export const useVaccineComboForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const { vaccineDetail } = useVaccineDetail();
    const { comboVaccineDetail } = useComboVaccineDetailById(Number(id));

    useEffect(() => {
        if (isEditMode && comboVaccineDetail) {
            const uniqueVaccineIds = [...new Set(comboVaccineDetail.vaccines.map((v) => v.vaccineId))];
            form.setFieldsValue({
                comboName: comboVaccineDetail.comboName,
                description: comboVaccineDetail.description,
                totalPrice: comboVaccineDetail.totalPrice,
                isActive: comboVaccineDetail.isActive,
                vaccineIds: uniqueVaccineIds,
            });
        }
    }, [comboVaccineDetail, form, isEditMode]);

    const onFinish = async (values: PostVaccineComboDetail) => {
        const payload: PostVaccineComboDetail = {
            comboName: values.comboName,
            description: values.description,
            totalPrice: values.totalPrice,
            isActive: values.isActive,
            vaccineIds: values.vaccineIds,
        };

        try {
            if (isEditMode) {
                await apiUpdateComboVaccine(Number(id), payload);
            } else {
                await apiAddComboVaccine(payload);
            }
            navigate("/manager/combo-vaccines");
        } catch (error) {
            console.error("Lỗi khi lưu combo vaccine:", error);
        }
    };

    return { form, onFinish, vaccineDetail, isEditMode, navigate };
};
