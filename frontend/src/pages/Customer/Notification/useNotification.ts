import {useState} from "react";
import {toast} from "react-toastify";
import {
    NotificationResponse,
    NotificationType,
    SendNotificationRequest,
    UpdateNotificationRequest
} from "../../../interfaces/Notification.ts";
import {
    apiAdminSendNotification, apiAdminSendNotificationToAllUser, apiDeleteAdminNotification,
    apiDeleteNotification, apiGetAllAdminNotification,
    apiGetAllNotifications,
    apiMarkAsRead, apiUpdateAdminNotification,
} from "../../../apis/apiNotification.ts";

export const useGetAllNotification = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllNotification = async () => {
        setLoading(true);
        const response = await apiGetAllNotifications();
        if (!response.isSuccess) {
            response.errorMessages.forEach((msg: string) => {
                toast.error(msg);
            });
            setError("Error Fetching All User Data")
            return;
        }
        if (response.result) setNotifications(response.result);

        setLoading(false);

    };

    return { notifications, loading, error, fetchAllNotification };
};

export const useMarkAsRead = () => {

    const handleMarkAsRead = async  (notificationId: number) => {
        const response = await apiMarkAsRead(notificationId);

        if (!response) {
            toast.error("Error Mark As Read");
            return;
        }
        // toast.success("Mark As Read");

    }

    return {handleMarkAsRead};
}

export const useDeleteNotification = () => {

    const handleDeleteNotification = async  (notificationId: number) => {
        const response = await apiDeleteNotification(notificationId);

        if (!response) {
            toast.error("Error Delete");
            return;
        }
        // toast.success("Mark As Read");

    }

    return {handleDeleteNotification};
}

export const useSendNotification = () => {

    const handleSendNotification = async (userId: string, message: string, relatedEntityType: string) => {

        const NotificationRequest: SendNotificationRequest = {
            userId: userId,
            message: message,
            type: "Admin",
            relatedEntityType: relatedEntityType,
            relatedEntityId: 0
        }

        const response = await apiAdminSendNotification(NotificationRequest);
        if (!response.isSuccess) {
            response.errors.Message.forEach((msg: string) => {
                toast.error(msg);
            });
            return;
        }
        toast.success("Gửi thông báo thành công");

    };

    return {handleSendNotification };
};

export const useSendNotificationToAllUser = () => {

    const handleSendNotificationToAllUser = async (message: string) => {

        const messageRequest = {
            message: message
        }

        const response = await apiAdminSendNotificationToAllUser(messageRequest);
        if (!response.isSuccess) {
            response.errors.Message.forEach((msg: string) => {
                toast.error(msg);
            });
            return;
        }
        toast.success("Gửi thông báo thành công");

    };

    return {handleSendNotificationToAllUser};
};

export const useGetAllAdminNotification = () => {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllNotifications = async () => {
        setLoading(true);
        const response = await apiGetAllAdminNotification();
        if (!response.isSuccess) {
            response.errorMessages.forEach((msg: string) => {
                toast.error(msg);
            });
            setError("Error Fetching All Notification Data")
            return;
        }
        if (response.result) setNotifications(response.result);

        setLoading(false);

    };

    return { notifications, loading, error, fetchAllNotifications };
}

export const useUpdateAdminNotification = () => {

    const handleUpdateNotifications = async (id: string, message: string, relatedEntityType: string) => {

        const NotificationRequest: UpdateNotificationRequest = {
            message: message,
            type: "Admin",
            relatedEntityType: relatedEntityType,
            relatedEntityId: 0
        }

        const response = await apiUpdateAdminNotification(id, NotificationRequest);
        if (!response.isSuccess) {
            response.errors.Message.forEach((msg: string) => {
                toast.error(msg);
            });
            return;
        }
        toast.success("Cập nhật thông báo thành công");


    };

    return {handleUpdateNotifications };
}

export const useDeleteAdminNotification = () => {

    const handleDeleteNotifications = async (id: string) => {
        const response = await apiDeleteAdminNotification(id);
        if (!response.isSuccess) {
            response.errors.Message.forEach((msg: string) => {
                toast.error(msg);
            });
            return;
        }
        toast.success("Xóa thông báo thành công");


    };

    return { handleDeleteNotifications };
}