import {useEffect, useRef, useState} from "react";
import {AccountDetailResponse, AccountRequest, UpdateAccountRequest} from "../../../interfaces/Account.ts";
import {
    apiActiveAccount,
    apiCreateAccount, apiDeactivateAccount,
    apiDeleteAccount,
    apiGetAllUser,
    apiGetUserById,
    apiUpdateAccount
} from "../../../apis/apiAccount.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import dayjs from "dayjs";
import {toast} from "react-toastify";

export const useGetAllUser = () => {
    const [users, setUsers] = useState<AccountDetailResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllUser = async () => {
        setLoading(true);
        const response = await apiGetAllUser();
        if (!response.isSuccess) {
            response.errorMessages.forEach((msg: string) => {
                toast.error(msg);
            });
            setError("Error Fetching All User Data")
            return;
        }
        if (response.result) setUsers(response.result);
        setLoading(false);

    };

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
export const useUpdateUserIsActive = () => {
    const handleUpdateIsActive = async (isActive: boolean, userId: string) => {
        let response;
        if (isActive) {
            response = await apiDeactivateAccount(userId);
        }else {
            response = await apiActiveAccount(userId);
        }
        if (!response.isSuccess) {
            response.errorMessages.forEach((msg: string) => {
                toast.error(msg);
            });
            return;
        }
        toast.success("Cập nhật thành công!");
    }
    return {handleUpdateIsActive}
}

export const useDeleteUser = () => {
    const handleDelete = async (accountId: string) => {
        const response = await apiDeleteAccount(accountId);
        if (!response.isSuccess) {
            response.errorMessages.forEach((msg: string) => {
                toast.error(msg);
            });
            return;
        }
        toast.success("Xóa thành công!");
    }
    return {handleDelete}
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
                    toast.error("Không thể tải dữ liệu tài khoản.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, form, isEditMode]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        if (isEditMode) {
            const updateAccountData: UpdateAccountRequest = {
                id,
                ...values,
                isActive: values.isActive ?? true // Nếu thiếu thì mặc định là true
            };
            const response = await apiUpdateAccount(updateAccountData);
            if (!response.isSuccess) {
                response.errorMessages.forEach((msg: string) => {
                    toast.error(msg);
                });
                return;
            }
            toast.success("Cập nhật thành công!");
        } else {
            const newAccountData: AccountRequest = {
                ...values,
                role: values.role ?? "Customer",
            };
            const response = await apiCreateAccount(newAccountData);
            if (!response.isSuccess) {
                response.errorMessages.forEach((msg: string) => {
                    toast.error(msg);
                });
                return;
            }
            toast.success("Tạo tài khoản thành công!");
        }
        navigate("/admin/account");
        setLoading(false);

    };
    return { form, dateOfBirth, setDateOfBirth, isEditMode, handleSubmit, loading };
};
