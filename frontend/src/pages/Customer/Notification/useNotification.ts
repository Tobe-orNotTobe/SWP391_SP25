import {useState} from "react";
import {toast} from "react-toastify";
import {NotificationType, SendNotificationRequest} from "../../../interfaces/Notification.ts";
import {
    apiDeleteNotification,
    apiGetAllNotifications,
    apiMarkAsRead,
    apiSendNotification
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

        const response = await apiSendNotification(NotificationRequest);
        if (!response.isSuccess) {
            toast.error("Gửi thông báo thất bài");
            return;
        }
        toast.success("Gửi thông báo thành công");

    };

    return {handleSendNotification };
};