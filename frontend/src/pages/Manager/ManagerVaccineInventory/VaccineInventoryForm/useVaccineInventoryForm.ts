import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, notification } from "antd";
import {useVaccineDetailById, useVaccineDetail, useVaccineInventoryDetailByVaccineInventoryId} from "../../../../hooks/useVaccine.ts";
import {apiAddVaccineInventory, apiUpdateVaccineInventory} from "../../../../apis/apiVaccine.ts";
import { AxiosError } from "axios";
import {VaccineInventory} from "../../../../interfaces/Vaccine.ts";

export const useVaccineInventoryForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    const { vaccineDetail } = useVaccineDetail();
    const { vaccineInventoryDetailById } = useVaccineInventoryDetailByVaccineInventoryId(Number(id));
    const { vaccineDetail: vaccineDetailById } = useVaccineDetailById(Number(2));

    useEffect(() => {
        if (isEditMode && vaccineInventoryDetailById) {
            form.setFieldsValue({
                vaccineId: vaccineInventoryDetailById.vaccineId,
                batchNumber: vaccineInventoryDetailById.batchNumber,
                manufacturingDate: vaccineInventoryDetailById.manfacturingDate,
                expiryDate: vaccineInventoryDetailById.expiryDate,
                initialQuantity: vaccineInventoryDetailById.initialQuantity,
                supplier: vaccineInventoryDetailById.supplier,
            });
        }
    }, [isEditMode, vaccineInventoryDetailById, form]);

    const onFinish = async (values: VaccineInventory) => {
        try {
            const formattedValues = {
                vaccineId: values.vaccineId,
                batchNumber: values.batchNumber,
                initialQuantity: values.initialQuantity,
                supplier: values.supplier,
                manufacturingDate: values.manufacturingDate,
                expiryDate: values.expiryDate,
            };

            let response;
            if (isEditMode) {
                response = await apiUpdateVaccineInventory(Number(id), formattedValues);
            } else {
                response = await apiAddVaccineInventory(formattedValues);
            }

            if (response.isSuccess) {
                notification.success({
                    message: isEditMode ? "Cập nhật lô vaccine thành công" : "Thêm lô vaccine thành công"
                });
                navigate("/manager/inventory-vaccines");
            } else {
                notification.error({
                    message: isEditMode ? "Cập nhật lô vaccine thất bại" : "Thêm lô vaccine thất bại",
                    description: response.errorMessages
                });
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: isEditMode ? "Cập nhật lô vaccine thất bại" : "Thêm lô vaccine thất bại",
                    description: error.response?.data?.errorMessages || "Lỗi không xác định từ server"
                });
            } else {
                notification.error({
                    message: "Lỗi không xác định",
                    description: "Vui lòng thử lại sau."
                });
            }
        }
    };

    return { navigate,form, isEditMode, vaccineDetail, vaccineInventoryDetailById, vaccineDetailById, onFinish };
};


