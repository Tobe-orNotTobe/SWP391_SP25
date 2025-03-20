import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ChildDetailRequest, ChildDetailResponse } from "../interfaces/Child.ts";
import {apiChildRegister, apiChildUpdate, apiGetChildById, apiGetMyChilds} from "../apis/apiChild.ts";
// import { notification } from "antd";
import { uploadImageToCloudinary } from "../utils/cloudinary.ts";
import {toast} from "react-toastify";

export const useMyChilds = () => {
    const [myChilds, setMyChilds] = useState<ChildDetailResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchMyChilds = async () => {
        setLoading(true);

        const response = await apiGetMyChilds();

        if (!response.isSuccess) {
            setError(response.errorMessages.length > 0 ? response.errorMessages[0] : "Unknown error");
        } else if (response.result) {
            setMyChilds(response.result);
        } else {
            setMyChilds([]);
        }
            setLoading(false);
    };

    useEffect(() => {
        fetchMyChilds();
    }, []);

    // Trả về `refetch` để gọi lại khi cần
    return { myChilds, loading, error, refetch: fetchMyChilds };
};

export const useGetChildsByUserId = () => {
    const [childs, setChilds] = useState<ChildDetailResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchChilds = async (userId: string) => {
        setLoading(true);

        const response = await apiGetMyChilds(userId);

        if (!response.isSuccess) {
            setError(response.errorMessages.length > 0 ? response.errorMessages[0] : "Unknown error");
        } else if (response.result) {
            setChilds(response.result);
        } else {
            setChilds([]);
        }
        setLoading(false);
    };

    return { childs, loading, error, fetchChilds };
}

export const useChildDetail = (childId: number) => {
    const [childDetail, setChildDetail] = useState<ChildDetailResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchChildDetail = async (childId: number) => {
        setLoading(true);
        try {
            const { isSuccess, result } = await apiGetChildById(childId);
            if (isSuccess) setChildDetail(result);
        } catch (err) {
            setError("Error Fetching Children Detail Data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChildDetail(childId);
    }, []);

    return {childDetail, loading, error};
}

export const useChildForm = (refetch: () => void) => {
    const [form, setForm] = useState({
        selectedGender: null as { value: string; label: string } | null,
        selectedRelation: null as { value: string; label: string } | null,
        selectedMedicalHistory: null as { value: string; label: string } | null,
        selectedImage: null as File | null,
        imageUrl: "",
        childName: "",
        birthDate: null as Date | null,
        height: "" as number | "",
        weight: "" as number | "",
        childId: "" as number | "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSucessfull, setIsSuccessfull] = useState<boolean | null>(null);

    const updateForm = useCallback(
        (key: keyof typeof form, value: any) => setForm((prev) => ({ ...prev, [key]: value })),
        []
    );

    const formatDateForInput = (date: any): string =>
        date ? (typeof date === "string" ? date.split("T")[0] : date.toISOString().split("T")[0]) : "";

    const handleDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateForm("birthDate", e.target.value ? new Date(e.target.value) : null);
    }, []);

    const handleNumberChange = useCallback(
        (key: "height" | "weight") => (e: ChangeEvent<HTMLInputElement>) => {
            updateForm(key, e.target.value === "" ? "" : Math.max(0, Number(e.target.value)));
        },
        []
    );

    const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];

        if (file.size > 5 * 1024 * 1024) {
            return toast.error("Ảnh vượt quá dung lượng cho phép (5MB).");
        }

        e.target.value = ""; // Reset input file để đảm bảo sự kiện thay đổi luôn được kích hoạt
        updateForm("selectedImage", file);
    }, []);



    const validateForm = () => {
        if (!form.childName.trim()) return "Vui lòng nhập họ tên.";
        if (!form.birthDate) return "Vui lòng chọn ngày sinh.";
        if (!form.selectedGender) return "Vui lòng chọn giới tính.";
        if (!form.selectedMedicalHistory) return "Vui lòng chọn lịch sử y tế.";
        if (!form.selectedRelation) return "Vui lòng chọn mối quan hệ.";
        if (form.height === "" || form.weight === "") return "Chiều cao & cân nặng không được để trống.";
        return null;
    };

    const handleSubmit = async (isUpdate: boolean, event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSuccessfull(null);
        setError(null);
        const validationError = validateForm();
        if (validationError) return setError(validationError);

        setIsLoading(true);

        try {
            let imageUrl = form.imageUrl;
            if (form.selectedImage) {
                imageUrl = await uploadImageToCloudinary(form.selectedImage);
                if (!imageUrl) throw new Error("Lỗi tải ảnh lên");
            }else {
                if (!imageUrl) {
                    if (form.selectedGender?.value === "Male") {
                        imageUrl = "https://res.cloudinary.com/dchh42alp/image/upload/v1742345394/mhkyilwl3aa6qmabesvr.jpg";
                    }else {
                        imageUrl = "https://res.cloudinary.com/dchh42alp/image/upload/v1742345393/zwofzhjeyyoif4vlibav.jpg";
                    }
                }
            }

            const requestData: ChildDetailRequest = {
                fullName: form.childName.trim(),
                dateOfBirth: form.birthDate!.toISOString(),
                gender: form.selectedGender!.value,
                medicalHistory: form.selectedMedicalHistory!.value,
                relationToUser: form.selectedRelation!.value,
                height: form.height === "" ? 0 : form.height,
                weight: form.weight === "" ? 0 : form.weight,
                imageUrl,
            };

            const response = isUpdate
                ? await apiChildUpdate(requestData, form.childId as number)
                : await apiChildRegister(requestData);

            if (!response.isSuccess) throw new Error(response.errorMessages || "Lỗi xảy ra, vui lòng thử lại.");
            updateForm("imageUrl", imageUrl);
            toast.success(isUpdate ? "Cập nhật thành công!" : "Đăng ký thành công!" );
            // notification.success({ message: isUpdate ? "Cập nhật thành công!" : "Đăng ký thành công!" });
            setIsSuccessfull(true);
            if (isUpdate) {
                refetch();
            }

        } catch (err: any) {
            toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại." );
            // notification.error({ message: "Lỗi", description: err.message || "Có lỗi xảy ra, vui lòng thử lại." });
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        isLoading,
        error,
        isSucessfull,
        updateForm,
        formatDateForInput,
        handleDateChange,
        handleHeightChange: handleNumberChange("height"),
        handleWeightChange: handleNumberChange("weight"),
        handleImageUpload,
        handleRegister: (e: React.FormEvent<HTMLFormElement>) => handleSubmit(false, e),
        handleUpdate: (e: React.FormEvent<HTMLFormElement>) => handleSubmit(true, e),
    };
};
