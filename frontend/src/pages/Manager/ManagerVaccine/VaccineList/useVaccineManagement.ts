import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { VaccineDetail } from "../../../../interfaces/Vaccine";
import { apiDeleteVaccine } from "../../../../apis/apiVaccine";

export const useVaccineManagement = () => {
    const navigate = useNavigate();
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedVaccine, setSelectedVaccine] = useState<VaccineDetail | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleCreate = () => {
        navigate("/manager/vaccines/add");
    };

    const handleEdit = (record: VaccineDetail) => {
        navigate(`/manager/vaccines/edit/${record.vaccineId}`);
    };

    const handleDelete = async (vaccineId: number) => {
        try {
            setDeletingId(vaccineId);
            const response = await apiDeleteVaccine(vaccineId);
            
            if(response.isSuccess) {
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
                description: "Không thể xóa vaccine. Vui lòng thử lại sau."
            });
        } finally {
            setDeletingId(null);
        }
    };

    const handleDetailClick = (record: VaccineDetail) => {
        setSelectedVaccine(record);
        setIsDetailModalOpen(true);
    };

    const handleDetailModalClose = () => {
        setSelectedVaccine(null);
        setIsDetailModalOpen(false);
    };

    return {
        isDetailModalOpen,
        selectedVaccine,
        deletingId,
        handleCreate,
        handleEdit,
        handleDelete,
        handleDetailClick,
        handleDetailModalClose
    };
};