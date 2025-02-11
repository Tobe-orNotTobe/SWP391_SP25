// src/utils/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5260', // URL của Back-End
    timeout: 10000,  // Nếu yêu cầu mất quá 10s sẽ bị hủy
});

export default axiosInstance;
