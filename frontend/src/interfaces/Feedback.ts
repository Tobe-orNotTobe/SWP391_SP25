export interface FeedbackResponse {
    feedbackId: number | string;
    bookingId: number | string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    dateSubmitted: Date;
}

export interface FeedbackRequest {
    bookingId: number;
    rating: number;
    comment: string;
}

export interface UpdateFeedbackRequest {
    rating: number;
    comment: string;
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

export interface UpdateFeedback {
    comment: string;
    rating: number;
}