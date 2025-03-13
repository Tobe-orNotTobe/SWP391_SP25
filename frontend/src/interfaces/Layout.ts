

export interface GroupItem {
    label: string;
    path: string;
  }
  
export  interface Group {
    title: string;
    items: GroupItem[];
  }

export interface ApiResponse<T> {
    statusCode: "OK" | "NotFound";  // Trạng thái HTTP dự kiến
    isSuccess: boolean;             // Thành công hay thất bại
    errorMessages: string[];        // Danh sách lỗi nếu có
    result: T | null;               // Dữ liệu trả về (nếu có)
}

export interface LoadingRedirectProps {
    message: string;
    delay: number;
    to: string;
}
