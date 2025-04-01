import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { VaccineDetail } from "../../../../interfaces/Vaccine";
import { apiDeleteVaccine } from "../../../../apis/apiVaccine";
import {toast} from "react-toastify";
import {AxiosError} from "axios";

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
                toast.success("Đã Xóa Thành Công")
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