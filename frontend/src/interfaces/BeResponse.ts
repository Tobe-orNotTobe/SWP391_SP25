export interface ApiResponse<T> {
    statusCode: string;
    isSuccess: boolean;
    errorMessages: string[];
    result: T | null;
}
