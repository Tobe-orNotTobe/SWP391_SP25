import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { VaccinationSchedule } from "../../../../interfaces/Vaccine";
import { apiDeleteVaccinationSchedule } from "../../../../apis/apiVaccine";
import {AxiosError} from "axios";


export const useVaccinationSchedule = () => {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<VaccinationSchedule | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    
    const handleEdit = (id: number) => {
        navigate(`/manager/schedule-vaccines/edit/${id}`);
    };

    const handleCreate = () => {
        navigate("/manager/schedule-vaccines/add");
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
        } catch (error : unknown) {

            if (error instanceof AxiosError) {
                console.log("hehe", error.response?.data?.errorMessages);
                notification.error({
                    message: "Xóa Vaccine Thất Bại",
                    description: error.response?.data?.errorMessages ,
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
