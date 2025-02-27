import { ChangeEvent, useCallback, useState } from "react";
import { apiChildRegister } from "../../apis/apiChild.ts";
import { ChildDetailRequest } from "../../interfaces/Child.ts";
import { uploadImageToCloudinary } from "../../utils/cloudinary.ts";
import { notification } from "antd";

export const useChildRegister = () => {
    const [selectedGender, setSelectedGender] = useState<{ value: string; label: string } | null>(null);
    const [selectedRelation, setSelectedRelation] = useState<{ value: string; label: string } | null>(null);
    const [selectedMedicalHistory, setSelectedMedicalHistory] = useState<{ value: string; label: string } | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [childName, setChildName] = useState<string>("");
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [height, setHeight] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Format ngày thành "YYYY-MM-DD"
    const formatDateForInput = (date: Date | null): string => date ? date.toISOString().split("T")[0] : "";

    // Xử lý thay đổi ngày sinh
    const handleDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value ? new Date(e.target.value) : null;
        setBirthDate(date);
    }, []);

    // Xử lý thay đổi chiều cao & cân nặng
    const handleNumberChange = useCallback((setter: React.Dispatch<React.SetStateAction<number | "">>) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value === "" ? "" : Math.max(0, Number(e.target.value)); // Không cho số âm
            setter(value);
        }, []);

    // Xử lý tải ảnh lên
    const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        if (file.size > 5 * 1024 * 1024) { // Giới hạn 5MB
            notification.error({ message: "Ảnh vượt quá dung lượng cho phép (5MB)." });
            return;
        }
        setSelectedImage(file);
    }, []);

    // Xử lý đăng ký
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!childName.trim()) return setError("Vui lòng nhập họ tên.");
        if (!birthDate) return setError("Vui lòng chọn ngày sinh.");
        if (!selectedGender) return setError("Vui lòng chọn giới tính.");
        if (!selectedMedicalHistory) return setError("Vui lòng chọn lịch sử y tế.");
        if (!selectedRelation) return setError("Vui lòng chọn mối quan hệ.");
        if (height === "" || weight === "") return setError("Chiều cao & cân nặng không được để trống.");
        if (!selectedImage) return setError("Vui lòng tải ảnh lên.");

        setIsLoading(true);
        try {
            const imageUrl = await uploadImageToCloudinary(selectedImage);
            if (!imageUrl) throw new Error("Lỗi tải ảnh lên");

            const data: ChildDetailRequest = {
                fullName: childName.trim(),
                dateOfBirth: birthDate.toISOString(),
                gender: selectedGender.value,
                medicalHistory: selectedMedicalHistory.value,
                relationToUser: selectedRelation.value,
                height,
                weight,
                imageUrl
            };

            const response = await apiChildRegister(data);
            if (response.isSuccess) {
                notification.success({ message: "Đăng ký thành công!" });
            } else {
                throw new Error(response.errorMessages || "Đăng ký thất bại.");
            }
        } catch (error: any) {
            notification.error({
                message: "Lỗi đăng ký",
                description: error.message || "Có lỗi xảy ra, vui lòng thử lại."
            });
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        selectedGender, setSelectedGender,
        selectedRelation, setSelectedRelation,
        selectedMedicalHistory, setSelectedMedicalHistory,
        selectedImage, childName, setChildName,
        birthDate, height, weight, isLoading, error,
        formatDateForInput, handleDateChange,
        handleHeightChange: handleNumberChange(setHeight),
        handleWeightChange: handleNumberChange(setWeight),
        handleImageUpload, handleSubmit
    };
};
