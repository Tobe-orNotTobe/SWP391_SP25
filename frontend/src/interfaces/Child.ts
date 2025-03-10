export interface MyChildResponse {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: ChildDetailResponse[];
}

export interface ChildDetailResponse {
    childId: number;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    medicalHistory: string;
    relationToUser: string;
    height: number;
    weight: number;
    imageUrl: string;
    userId: string;
}

export interface ChildDetailRequest {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    medicalHistory: string;
    relationToUser: string;
    height: number;
    weight: number;
    imageUrl: string;
}