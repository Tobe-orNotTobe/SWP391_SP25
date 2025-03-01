import { ChangeEvent, useCallback, useState } from "react";
import {apiChildRegister, apiChildUpdate} from "../../apis/apiChild.ts";
import { ChildDetailRequest } from "../../interfaces/Child.ts";
import { uploadImageToCloudinary } from "../../utils/cloudinary.ts";
import { notification } from "antd";

export const useChildPage = () => {
    const [selectedGender, setSelectedGender] = useState<{ value: string; label: string } | null>(null);
    const [selectedRelation, setSelectedRelation] = useState<{ value: string; label: string } | null>(null);
    const [selectedMedicalHistory, setSelectedMedicalHistory] = useState<{ value: string; label: string } | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [childName, setChildName] = useState<string>("");
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [height, setHeight] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [childId, setChildId] = useState<number | "">("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Format ngày thành "YYYY-MM-DD"
    const formatDateForInput = (date: any): string => {
        if (!date) return ""; // Trả về chuỗi rỗng nếu không có giá trị
        if (typeof date === "string") return date.split("T")[0]; // Nếu date là chuỗi ISO, chỉ lấy phần yyyy-MM-dd
        if (date instanceof Date) return date.toISOString().split("T")[0]; // Nếu là Date object, format lại
        return ""; // Tránh lỗi nếu date không hợp lệ
    };


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
        console.log("Đã thay đổi ảnh")
        setSelectedImage(file);
    }, []);

    // Xử lý đăng ký
    const handleRegister = async (e: React.FormEvent) => {
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
            const newImageUrl = await uploadImageToCloudinary(selectedImage);
            if (!newImageUrl) throw new Error("Lỗi tải ảnh lên");
            setImageUrl(newImageUrl);

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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (childId === "") return setError("Đã xảy ra lỗi.");
        if (!childName.trim()) return setError("Vui lòng nhập họ tên.");
        if (!birthDate) return setError("Vui lòng chọn ngày sinh.");
        if (!selectedGender) return setError("Vui lòng chọn giới tính.");
        if (!selectedMedicalHistory) return setError("Vui lòng chọn lịch sử y tế.");
        if (!selectedRelation) return setError("Vui lòng chọn mối quan hệ.");
        if (height === "" || weight === "") return setError("Chiều cao & cân nặng không được để trống.");

        setIsLoading(true);
        try {
            let newImageUrl = imageUrl; // Mặc định giữ ảnh cũ

            if (selectedImage) {
                console.log("Đang tải ảnh lên...");
                newImageUrl = await uploadImageToCloudinary(selectedImage);
                if (!newImageUrl) throw new Error("Lỗi tải ảnh lên");
            }

            const data: ChildDetailRequest = {
                fullName: childName.trim(),
                dateOfBirth: birthDate.toISOString(),
                gender: selectedGender.value,
                medicalHistory: selectedMedicalHistory.value,
                relationToUser: selectedRelation.value,
                height,
                weight,
                imageUrl: newImageUrl // Dùng ảnh mới nếu có, nếu không thì giữ nguyên ảnh cũ
            };

            const response = await apiChildUpdate(data, childId);
            if (response.isSuccess) {
                setImageUrl(newImageUrl); // Cập nhật state sau khi API gọi thành công
                notification.success({ message: "Cập nhật thành công!" });
            } else {
                throw new Error(response.errorMessages || "Cập nhật thất bại.");
            }
        } catch (error: any) {
            notification.error({
                message: "Lỗi cập nhật",
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
        selectedImage, setSelectedImage,
        childName, setChildName,
        birthDate, setBirthDate,
        height, setHeight,
        weight, setWeight,
        setImageUrl,
        isLoading, error,
        setChildId,
        formatDateForInput, handleDateChange,
        handleHeightChange: handleNumberChange(setHeight),
        handleWeightChange: handleNumberChange(setWeight),
        handleImageUpload, handleRegister,
        handleUpdate
    };
};
