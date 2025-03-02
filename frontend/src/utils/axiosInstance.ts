// src/utils/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:7134", // URL của Back-End
    timeout: 10000, // Nếu yêu cầu mất quá 10s sẽ bị hủy
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
