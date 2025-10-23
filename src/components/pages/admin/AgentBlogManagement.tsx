import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { blogService } from '../../../services/blogService';
import { type Blog, type BlogFilters, type BlogStats } from '../../../types/blog';
import AgentBlogList from './AgentBlogList';
import AgentBlogDetail from './AgentBlogDetail';
import AgentBlogForm from './AgentBlogForm';
import BlogStatsCard from './BlogStatsCard';

type ActiveView = 'list' | 'detail' | 'create' | 'edit';

const AgentBlogManagement: React.FC = () => {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState<ActiveView>('list');
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<BlogStats | null>(null);
    const [filters, setFilters] = useState<BlogFilters>({
        page: 1,
        limit: 10,
        author: user?._id, // Filter by current user
        search: ''
    });

    // console.log("filters", filters);
    console.log("user", user);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    useEffect(() => {
        if (user?._id) {
            fetchBlogs();
            // fetchStats();
        }
    }, [filters, user?._id]);

    const fetchBlogs = async () => {
        if (!user?._id) return;

        try {
            setLoading(true);
            const response = await blogService.getAgentBlogs(filters);
            console.log("Agent blogs response", response.data);
            setBlogs(response.data.blogs);
            setPagination({
                total: response.data.pagination.total,
                page: response.data.pagination.page,
                limit: response.data.pagination.limit,
                totalPages: response.data.pagination.pages
            });
        } catch (error) {
            console.error('Error fetching agent blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        if (!user?._id) return;

        try {
            const response = await blogService.getBlogStats();
            // Filter stats to show only current user's blogs
            const userStats = {
                ...response,
                totalBlogs: blogs.length,
                pendingBlogs: blogs.filter(b => b.status === 'pending').length,
                approvedBlogs: blogs.filter(b => b.status === 'approved').length,
                rejectedBlogs: blogs.filter(b => b.status === 'rejected').length,
                publishedBlogs: blogs.filter(b => b.isPublished).length
            };
            setStats(userStats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDeleteBlog = async (blogId: string) => {
        if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
            return;
        }

        try {
            await blogService.deletePublicBlog(blogId);
            await fetchBlogs();
            await fetchStats();
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const handleViewDetail = (blog: Blog) => {
        setSelectedBlog(blog);
        setActiveView('detail');
    };

    const handleBackToList = () => {
        setActiveView('list');
        setSelectedBlog(null);
    };

    const handleAddBlog = () => {
        setActiveView('create');
        setSelectedBlog(null);
    };

    const handleEditBlog = (blog: Blog) => {
        setSelectedBlog(blog);
        setActiveView('edit');
    };

    const handleBlogSaved = () => {
        setActiveView('list');
        setSelectedBlog(null);
        fetchBlogs();
        fetchStats();
    };

    const handleFilterChange = (newFilters: Partial<BlogFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    if (activeView === 'detail' && selectedBlog) {
        return (
            <AgentBlogDetail
                blog={selectedBlog}
                onBack={handleBackToList}
                onEdit={handleEditBlog}
                onDelete={handleDeleteBlog}
            />
        );
    }

    if (activeView === 'create') {
        return (
            <AgentBlogForm
                onSave={handleBlogSaved}
                onCancel={handleBackToList}
            />
        );
    }

    if (activeView === 'edit' && selectedBlog) {
        return (
            <AgentBlogForm
                blog={selectedBlog}
                onSave={handleBlogSaved}
                onCancel={handleBackToList}
                isEdit={true}
            />
        );
    }

    return (
        <div className="agent-blog-management">
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">My Blog Posts</h4>
                        <p className="text-muted">Manage your blog posts and track their status</p>
                    </div>
                </div>
            </div>

            {stats && (
                <div className="row mb-4">
                    <BlogStatsCard stats={stats} />
                </div>
            )}

            <div className="row">
                <div className="col-12">
                    <AgentBlogList
                        blogs={blogs}
                        loading={loading}
                        filters={filters}
                        pagination={pagination}
                        onFilterChange={handleFilterChange}
                        onPageChange={handlePageChange}
                        onViewDetail={handleViewDetail}
                        onEdit={handleEditBlog}
                        onDelete={handleDeleteBlog}
                        onAddBlog={handleAddBlog}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgentBlogManagement;
