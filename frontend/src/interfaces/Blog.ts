
export interface BlogIntro {
    blogPostId: string;
    title: string;
    imageUrl : string;
    type : string;
}


export interface BlogResponse extends BlogIntro {
    content: string;
    createdAt: Date;
    authorName: string;
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