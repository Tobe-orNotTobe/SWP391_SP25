export interface NewsIntro {
    blogPostId: string;
    title: string;
    imageUrl: string;
    category: string;
}

export interface NewsResponse extends NewsIntro {
    content: string;
    createdAt: Date;
    authorName: string;
    isActive: boolean;
}

export interface NewsRequest {
    title: string;
    content: string;
    imageUrl: string;
    authorName: string;
    category: string;
}

export interface UpdateNewsRequest {
    title: string;
    content: string;
    imageUrl: string;
    category: string;
    isActive: boolean;
}
