import {useEffect, useRef, useState} from "react";
import {AccountDetailResponse, AccountRequest, UpdateAccountRequest} from "../../../interfaces/Account.ts";
import {
    apiCreateAccount,
    apiDeleteAccount,
    apiGetAllUser,
    apiGetUserById,
    apiUpdateAccount
} from "../../../apis/apiAccount.ts";
import {useNavigate, useParams} from "react-router-dom";
import {notification} from "antd";
import {useForm} from "antd/es/form/Form";
import dayjs from "dayjs";

export const useGetAllUser = () => {
    const [users, setUsers] = useState<AccountDetailResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const hasFetched = useRef(false); // Biến kiểm tra đã gọi API hay chưa

    const fetchAllUser = async () => {
        setLoading(true);
        try {
            const response = await apiGetAllUser();
            if (response && response.result) {
                console.log("cac: " + response)
                setUsers(response.result);
            }
        } catch (err) {
            console.error(err);
            setError("Error Fetching All User Data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return; // Nếu đã gọi API trước đó thì không gọi lại
        fetchAllUser();
        hasFetched.current = true; // Đánh dấu là đã gọi API
    }, []);

    return { users, loading, error, fetchAllUser };
};

export const useGetUserById = (accountId: string) => {
    const [user, setUser] = useState<AccountDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const hasFetched = useRef(false); // Biến kiểm tra đã gọi API hay chưa

    useEffect(() => {
        if (hasFetched.current) return; // Nếu đã gọi API trước đó thì không gọi lại

        const fetchUserById = async () => {
            setLoading(true);
            try {
                const response = await apiGetUserById(accountId);
                if (response && response.result) {
                    console.log("cac: " + response)
                    setUser(response.result);
                }
            } catch (err) {
                console.error(err);
                setError("Error Fetching All User Data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserById();
        hasFetched.current = true; // Đánh dấu là đã gọi API
    }, []);

    return {user, loading, error};
}

// export const createUser = async (account: AccountRequest) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//
//     try {
//         setError(null);
//         setIsLoading(true);
//         const response = await apiCreateAccount(account);
//         if (!response.isSuccess) throw new Error(response.errorMessages || "Lỗi xảy ra, vui lòng thử lại.");
//         notification.success({ message: "Tạo tài khoản thành công!" });
//
//     }catch (err: any) {
//         notification.error({ message: "Lỗi", description: err.message || "Có lỗi xảy ra, vui lòng thử lại." });
//         setError(err.message);
//     } finally {
//         setIsLoading(false);
//     }
//
//     return {isLoading, error}
// }
//
// export const updateUser = async (account: UpdateAccountRequest) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//
//     try {
//         setError(null);
//         setIsLoading(true);
//         const response = await apiUpdateAccount(account);
//         if (!response.isSuccess) throw new Error(response.errorMessages || "Lỗi xảy ra, vui lòng thử lại.");
//         notification.success({ message: "Cập nhật thành công!" });
//
//     }catch (err: any) {
//         notification.error({ message: "Lỗi", description: err.message || "Có lỗi xảy ra, vui lòng thử lại." });
//         setError(err.message);
//     } finally {
//         setIsLoading(false);
//     }
//
//     return {isLoading, error}
// }

export const useDeleteUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (accountId: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await apiDeleteAccount(accountId);
            if (!response.isSuccess) throw new Error(response.errorMessages || "Lỗi xảy ra, vui lòng thử lại.");
            notification.success({ message: "Xóa thành công!" });

        }catch (err: any) {
            notification.error({ message: "Lỗi", description: err.message || "Có lỗi xảy ra, vui lòng thử lại." });
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return {handleDelete, isLoading, error}
}

export const useAdminAccountForm = () => {
    const [form] = useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            apiGetUserById(id)
                .then((response) => {
                    if (response?.result) {
                        setDateOfBirth(response.result.dateOfBirth ? dayjs(response.result.dateOfBirth).format("YYYY-MM-DD") : undefined);
                        form.setFieldsValue({
                            ...response.result,
                            dateOfBirth: response.result.dateOfBirth
                                ? dayjs(response.result.dateOfBirth).format("YYYY-MM-DD")
                                : undefined,
                        });
                    }
                })
                .catch(() => {
                    notification.error({ message: "Lỗi", description: "Không thể tải dữ liệu tài khoản." });
                })
                .finally(() => setLoading(false));
        }
    }, [id, form, isEditMode]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (isEditMode) {
                const updateAccountData: UpdateAccountRequest = {
                    id,
                    ...values,
                    isActive: values.isActive ?? true // Nếu thiếu thì mặc định là true
                };
                const response = await apiUpdateAccount(updateAccountData);
                if (!response.isSuccess) throw new Error(response.errorMessages || "Lỗi cập nhật tài khoản");
                notification.success({ message: "Cập nhật thành công!" });
            } else {
                const newAccountData: AccountRequest = {
                    ...values,
                    role: values.role ?? "Customer", // Đảm bảo role không bị thiếu
                };
                const response = await apiCreateAccount(newAccountData);
                if (!response.isSuccess) throw new Error(response.errorMessages || "Lỗi tạo tài khoản");
                notification.success({ message: "Tạo tài khoản thành công!" });
            }
            navigate("/admin/account");
        } catch (error: any) {
            notification.error({ message: "Lỗi", description: error.message || "Có lỗi xảy ra, vui lòng thử lại." });
        } finally {
            setLoading(false);
        }
    };
    return { form, dateOfBirth, setDateOfBirth, isEditMode, handleSubmit, loading };
};
