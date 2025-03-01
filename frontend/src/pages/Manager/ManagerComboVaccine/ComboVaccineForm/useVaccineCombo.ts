import { useEffect } from "react";
import { Form, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useVaccineDetail, useComboVaccineDetailById } from "../../../../hooks/useVaccine";
import { apiAddComboVaccine, apiUpdateComboVaccine } from "../../../../apis/apiVaccine";
import { PostVaccineComboDetail } from "../../../../interfaces/Vaccine";
import {AxiosError} from "axios";

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
            let response;
            if (isEditMode) {
                response = await apiUpdateComboVaccine(Number(id), payload);
            } else {
                response = await apiAddComboVaccine(payload);
            }

            console.log(response)
            if (response.isSuccess) {
                notification.success({
                    message: isEditMode ? "Cập nhật thành công" : "Thêm mới thành công",
                });
                navigate("/manager/combo-vaccines");
            }
        } catch (error : unknown) {
            if (error instanceof AxiosError) {

                const errorMessages = error.response?.data?.errorMessages;
                console.log(errorMessages)
                const errorMessageText = Array.isArray(errorMessages) && errorMessages.length
                    ? errorMessages.join(", ")
                    : "Không thể kết nối với máy chủ. Vui lòng thử lại sau.";


                notification.error({
                    message: "Đăng Nhập Thất Bại",
                    description: errorMessageText || "Lỗi không xác định từ server",
                });
            } else {
                console.error("Lỗi không xác định:", error);
                notification.error({
                    message: "Lỗi không xác định",
                    description: "Vui lòng thử lại sau.",
                });
            }
        }
    };


    return { form, onFinish, vaccineDetail, isEditMode, navigate };
};
