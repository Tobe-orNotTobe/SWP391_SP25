
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { GetVaccineComboDetail } from "../../../../interfaces/Vaccine";
import { apiDeleteComboVaccine } from "../../../../apis/apiVaccine";

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
            const response = await apiDeleteComboVaccine(comboVaccineId);

            if (response.isSuccess) {
                notification.success({
                    message: response.message,
                    description: "Đã Xóa Thành Công"
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                notification.error({
                    message: response.message,
                    description: "Có lỗi xảy ra"
                });
            }
        } catch (error) {
            console.error("Delete error:", error);
            notification.error({
                message: "Lỗi xóa dữ liệu",
                description: "Không thể xóa combo vaccine. Vui lòng thử lại sau."
            });
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

