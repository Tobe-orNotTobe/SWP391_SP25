
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { GetVaccineComboDetail } from "../../../../interfaces/Vaccine";
import { apiDeleteComboVaccine } from "../../../../apis/apiVaccine";
import {AxiosError} from "axios";


export const useComboVaccineList = () => {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedCombo, setSelectedCombo] = useState<GetVaccineComboDetail | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleCreate = () => {
        navigate("/manager/combo-vaccines/add");
    };

    const handleEdit = (record: GetVaccineComboDetail) => {
        navigate(`/manager/combo-vaccines/edit/${record.comboId}`);
    };

    const handleDelete = async (comboVaccineId: number) => {
        try {
            setDeletingId(comboVaccineId);
            const data = await apiDeleteComboVaccine(comboVaccineId);

            if (data.isSuccess) {
                notification.success({
                    message: data.message,
                    description: "Đã Xóa Thành Công"
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

        }catch (error: unknown) {

            if (error instanceof AxiosError) {
                console.log("hehe", error.response?.data?.error);

                notification.error({
                    message: "Xóa Combo Vaccine Thất Bại",
                    description: error.response?.data?.error,
                });

            } else {
                console.error("Lỗi không xác định:", error);
                notification.error({
                    message: "Lỗi không xác định",
                    description: "Vui lòng thử lại sau.",
                });
            }


        } finally {
            setDeletingId(null);
        }
    };

    const handleDetailClick = (record: GetVaccineComboDetail) => {
        setSelectedCombo(record);
        setIsDetailModalOpen(true);
    };

    const handleDetailModalClose = () => {
        setSelectedCombo(null);
        setIsDetailModalOpen(false);
    };

    return {
        deletingId,
        isDetailModalOpen,
        selectedCombo,
        handleCreate,
        handleEdit,
        handleDelete,
        handleDetailClick,
        handleDetailModalClose
    };
};

