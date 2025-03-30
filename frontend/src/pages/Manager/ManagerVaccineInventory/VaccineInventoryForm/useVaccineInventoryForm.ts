import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import {useVaccineDetailById, useVaccineDetail, useVaccineInventoryDetailByVaccineInventoryId} from "../../../../hooks/useVaccine.ts";
import {apiAddVaccineInventory, apiUpdateVaccineInventory} from "../../../../apis/apiVaccine.ts";
import { AxiosError } from "axios";
import {VaccineInventory} from "../../../../interfaces/Vaccine.ts";
import {toast} from "react-toastify";
import dayjs from "dayjs";

export const useVaccineInventoryForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    const { vaccineDetail } = useVaccineDetail();
    const { vaccineInventoryDetailById } = useVaccineInventoryDetailByVaccineInventoryId(Number(id));
    const { vaccineDetail: vaccineDetailById } = useVaccineDetailById(Number(2));

    useEffect(() => {
        // console.log("Dữ liệu từ API:", vaccineInventoryDetailById);

        if (isEditMode && Array.isArray(vaccineInventoryDetailById) && vaccineInventoryDetailById.length > 0) {
            const vaccineData = vaccineInventoryDetailById[0];

            form.setFieldsValue({
                vaccineId: vaccineData.vaccineId,
                batchNumber: vaccineData.batchNumber,
                manufacturingDate: vaccineData.manufacturingDate ? dayjs(vaccineData.manufacturingDate) : null,
                expiryDate: vaccineData.expiryDate ? dayjs(vaccineData.expiryDate) : null,
                initialQuantity: vaccineData.initialQuantity,
                supplier: vaccineData.supplier,
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
                toast.success(isEditMode ? "Cập nhật lô vaccine thành công" : "Thêm lô vaccine thành công");
                navigate("/manager/inventory-vaccines");
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
               toast.error(`${error.response?.data?.errorMessages}`);
            } else {
                toast.error("Lỗi Không Xác Định");
            }
        }
    };

    return { navigate,form, isEditMode, vaccineDetail, vaccineInventoryDetailById, vaccineDetailById, onFinish };
};


