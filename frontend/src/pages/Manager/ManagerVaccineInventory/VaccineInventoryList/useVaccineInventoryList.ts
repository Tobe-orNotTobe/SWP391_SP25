import { useState } from 'react';
import { notification, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import {
    VaccineInventoryResponse,
    VaccineInventoryStock
} from '../../../../interfaces/Vaccine.ts';
import {
    apiAddVaccineInventory,
    apiDeleteVaccineInventory,
    apiSearchVaccineInventory
} from '../../../../apis/apiVaccine.ts';

type GroupedVaccine = VaccineInventoryStock & { batches: VaccineInventoryStock[] };

export const useVaccineInventoryList = (vaccineInventoryStockDetail: VaccineInventoryStock[] | null) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [selectedVaccine, setSelectedVaccine] = useState<GroupedVaccine | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addBatchModalVisible, setAddBatchModalVisible] = useState(false);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState<GroupedVaccine[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    // Group data logic
    const groupedData = (vaccineInventoryStockDetail ?? []).reduce((acc: Record<string, GroupedVaccine>, item: VaccineInventoryStock) => {
        if (!acc[item.vaccineId]) {
            acc[item.vaccineId] = { ...item, batches: [] };
        }
        acc[item.vaccineId].batches.push(item);
        return acc;
    }, {} as Record<string, GroupedVaccine>);

    const vaccineInventoryList = searchPerformed ? searchResults : Object.values(groupedData);

    // Search handling
    const handleSearch = async () => {
        try {
            if (!searchKeyword.trim()) {
                toast.warning("Please enter a valid keyword!");
                return;
            }
            setIsSearching(true);
            const response = await apiSearchVaccineInventory(searchKeyword);
            const resultData = (response as VaccineInventoryResponse).result || [];

            const groupedResults: Record<number, GroupedVaccine> = {};

            resultData.forEach((item) => {
                const vaccineId = item.vaccineId;

                if (!groupedResults[vaccineId]) {
                    groupedResults[vaccineId] = {
                        ...item,
                        batches: []
                    };
                }

                groupedResults[vaccineId].batches.push(item);
            });

            const finalResults = Object.values(groupedResults);
            setSearchResults(finalResults);
            setSearchPerformed(true);

            if (finalResults.length === 0) {
                toast.info("Không tìm thấy từ Khóa tìm Kiếm");
            }
        } catch (error) {
            console.error("Search error:", error);
            notification.error({
                message: "Lỗi khi tìm kiếm vaccine",
                description: "Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại sau.",
            });
        } finally {
            setIsSearching(false);
        }
    };

    const resetSearch = () => {
        setSearchKeyword("");
        setSearchResults([]);
        setSearchPerformed(false);
    };

    // Modal handling
    const handleOpenModal = (record: GroupedVaccine) => {
        setSelectedVaccine(record);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedVaccine(null);
    };

    const handleOpenAddBatchModal = (record: GroupedVaccine) => {
        setSelectedVaccine(record);
        form.resetFields();
        setAddBatchModalVisible(true);
    };

    // CRUD operations
    const handleCreateBatch = () => {
        navigate("/manager/inventory-vaccines/add");
    };

    const handleEditBatch = (record: VaccineInventoryStock) => {
        navigate(`/manager/inventory-vaccines/edit/${record.vaccineInventoryId}`);
    };

    const handleDeleteBatch = async (record: VaccineInventoryStock) => {
        try {
            const response = await apiDeleteVaccineInventory(record.vaccineInventoryId);

            if (response.isSuccess) {
                toast.success("Xóa Lô Vaccine Thành Công");

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(response.errorMessages);
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.errorMessages);
            } else {
                toast.error("Lỗi không xác định");
            }
        } finally {
            setModalVisible(false);
        }
    };

    const handleAddVaccineInventory = async () => {
        try {
            const values = await form.validateFields();

            // Thêm vaccineId và các trường cần thiết
            const batchData = {
                ...values,
                vaccineId: selectedVaccine?.vaccineId,
                manufacturingDate: values.manufacturingDate?.format('YYYY-MM-DD'),
                expiryDate: values.expiryDate?.format('YYYY-MM-DD'),
                quantityInStock: values.initialQuantity
            };

            const response = await apiAddVaccineInventory(batchData);

            if (response.isSuccess) {
               toast.success("Thêm Lô Vaccine Thành Công")
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(`${error.response?.data?.errorMessages}`);
            } else {
               toast.error("Lỗi không xác định");
            }
        }
    };

    return {
        // State
        form,
        selectedVaccine,
        modalVisible,
        addBatchModalVisible,
        searchKeyword,
        isSearching,
        searchPerformed,
        vaccineInventoryList,
        searchResults,

        // Actions
        setSearchKeyword,
        handleSearch,
        resetSearch,
        handleCreateBatch,
        handleEditBatch,
        handleDeleteBatch,
        handleOpenModal,
        handleCloseModal,
        handleOpenAddBatchModal,
        setAddBatchModalVisible,
        handleAddVaccineInventory
    };
};