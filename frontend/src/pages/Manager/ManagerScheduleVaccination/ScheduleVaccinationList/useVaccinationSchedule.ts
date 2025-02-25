import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { VaccinationSchedule } from "../../../../interfaces/Vaccine";
import { apiDeleteVaccinationSchedule } from "../../../../apis/apiVaccine";

export const useVaccinationSchedule = () => {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<VaccinationSchedule | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    
    const handleEdit = (id: number) => {
        navigate(`/manager/combo-vaccines/edit/${id}`);
    };

  
    const handleDelete = async (scheduleId: number) => {
        try {
            setDeletingId(scheduleId);
            const response = await apiDeleteVaccinationSchedule(scheduleId);
            
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

    
    const handleCreate = () => {
        navigate("/manager/combo-vaccines/add");
    };

    
    const handleShowDetail = (schedule: VaccinationSchedule) => {
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

    
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return {
        deletingId,
        selectedSchedule,
        isModalOpen,
        handleEdit,
        handleDelete,
        handleCreate,
        handleShowDetail,
        handleModalClose,
    };
};
