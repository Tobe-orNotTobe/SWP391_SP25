export interface BlogResponse {
    blogPostId: string;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: Date;
    authorName: string;
    type: string;
    isActive: boolean;
}

export interface BlogRequest {
    title: string;
    content: string;
    imageUrl: string;
    authorName: string;
}

export interface UpdateBlogRequest {
    title: string;
    content: string;
    imageUrl: string;
    type: string;
    isActive: boolean;
}