
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { GetVaccineComboDetail } from "../../../../interfaces/Vaccine";
import { apiDeleteComboVaccine } from "../../../../apis/apiVaccine";
import {AxiosError} from "axios";
import {toast} from "react-toastify";


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

