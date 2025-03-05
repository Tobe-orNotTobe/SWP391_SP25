export interface BlogResponse {
    blogPostId: number;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: Date;
    authorName: string;
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
}