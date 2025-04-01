export interface RefundRequest {
    bookingId: number;
    reason: string;
}

export interface RefundUserList {
    refundRequestId : number;
    bookingId: number;
    userId : string;
    userName : string;
    amount : number;
    reason : string;
    status : string;
    adminNote : string;
    processedBy : string | null;
    createAt : string;
    processAt : string | null;
}

