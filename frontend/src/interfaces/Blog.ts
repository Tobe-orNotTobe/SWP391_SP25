
export interface BlogIntro {
    blogPostId: number;
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

export interface NewsIntro {
    blogPostId: number;
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
