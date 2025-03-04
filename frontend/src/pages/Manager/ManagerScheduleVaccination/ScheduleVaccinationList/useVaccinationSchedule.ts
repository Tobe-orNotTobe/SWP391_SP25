import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { VaccinationSchedule } from "../../../../interfaces/Vaccine";
import { apiDeleteVaccinationSchedule } from "../../../../apis/apiVaccine";
import {AxiosError} from "axios";
import {toast} from "react-toastify";


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
                toast.success("Đã Xóa Thành Công");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error : unknown) {
            if (error instanceof AxiosError) {
                toast.error(`${error.response?.data?.errorMessages}`);
            } else {
                toast.error("Lỗi Không Xác Định");
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
