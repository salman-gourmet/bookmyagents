export interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    coverImage: string;
    author: string | { _id: string; email: string }; // IUser['_id'] or populated user object
    likes: string[]; // IUser['_id'][]
    dislikes: string[]; // IUser['_id'][]
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string | { _id: string; email: string }; // IUser['_id'] or populated user object
    approvedAt?: Date;
    isPublished: boolean;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface BlogFilters {
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected';
    author?: string;
    search?: string;
}

export interface BlogDetailsResponse {
    success: boolean;
    data: Blog;
}

export interface BlogListResponse {
    success: boolean;
    data: {
        blogs: Blog[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
        statusCounts?: {
            pending: number;
            approved: number;
            rejected: number;
        };
    };
}

export interface BlogStats {
    totalBlogs: number;
    pendingBlogs?: number;
    approvedBlogs?: number;
    rejectedBlogs?: number;
    publishedBlogs?: number;
    statusCounts?: Array<{
        _id: string;
        count: number;
    }>;
    blogsByMonth?: Array<{
        month: string;
        count: number;
    }>;
}
