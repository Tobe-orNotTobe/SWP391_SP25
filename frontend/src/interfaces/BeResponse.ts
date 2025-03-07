export interface ApiResponse<T> {
    statusCode: "OK" | "NotFound";  // Trạng thái HTTP dự kiến
    isSuccess: boolean;             // Thành công hay thất bại
    errorMessages: string[];        // Danh sách lỗi nếu có
    result: T | null;               // Dữ liệu trả về (nếu có)
}
