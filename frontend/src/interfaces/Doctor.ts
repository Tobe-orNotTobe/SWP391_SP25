export interface Doctor {
    id: string | number;         // id có thể là string hoặc number tùy theo hệ thống của bạn
    imageUrl?: string;          // optional vì có giá trị mặc định "/default-avatar.png"
    fullName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
    isActive: boolean;
}