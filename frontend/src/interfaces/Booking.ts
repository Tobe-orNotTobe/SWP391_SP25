
export interface BookingResponse {
    bookingId: string;
    childName: string;
    bookingDate: string;
    bookingType: string;
    totalPrice: string;
    note: string;
    status: string;
}

export interface FeedbackDetailByBookingIdResponse {
    feedbackId: number;
    bookingId: number;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    dateSubmitted : string;
}