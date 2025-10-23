import React, { useState, useEffect } from 'react';
import { blogService } from '../../../services/blogService';
import { type Blog, type BlogFilters, type BlogStats } from '../../../types/blog';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import BlogStatsCard from './BlogStatsCard';
import BlogForm from './BlogForm';

type ActiveView = 'list' | 'detail' | 'create' | 'edit';

const BlogManagement: React.FC = () => {
    const [activeView, setActiveView] = useState<ActiveView>('list');
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<BlogStats | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [filters, setFilters] = useState<BlogFilters>({
        page: 1,
        limit: 10,
        status: undefined,
        author: undefined,
        search: ''
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    useEffect(() => {
        fetchBlogs();
        fetchStats();
    }, [filters]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await blogService.getAdminBlogs(filters);
            console.log("response", response.data);
            setBlogs(response.data.blogs);
            setPagination({
                total: response.data.pagination.total,
                page: response.data.pagination.page,
                limit: response.data.pagination.limit,
                totalPages: response.data.pagination.pages
            });
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await blogService.getBlogStats();
            setStats(response);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleApprove = async (blogId: string) => {
        try {
            await blogService.approveBlog(blogId);
            await fetchBlogs();
            await fetchStats();
            // Show success message
            setSuccessMessage('Blog approved successfully!');
            // Redirect back to list view
            setActiveView('list');
            setSelectedBlog(null);
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Error approving blog:', error);
        }
    };

    const handleReject = async (blogId: string) => {
        try {
            await blogService.rejectBlog(blogId);
            await fetchBlogs();
            await fetchStats();
            // Show success message
            setSuccessMessage('Blog rejected successfully!');
            // Redirect back to list view
            setActiveView('list');
            setSelectedBlog(null);
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Error rejecting blog:', error);
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
            <BlogDetail
                blog={selectedBlog}
                onBack={handleBackToList}
                onApprove={handleApprove}
                onReject={handleReject}
                onEdit={handleEditBlog}
            />
        );
    }

    if (activeView === 'create') {
        return (
            <BlogForm
                onSave={handleBlogSaved}
                onCancel={handleBackToList}
            />
        );
    }

    if (activeView === 'edit' && selectedBlog) {
        return (
            <BlogForm
                blog={selectedBlog}
                onSave={handleBlogSaved}
                onCancel={handleBackToList}
                isEdit={true}
            />
        );
    }

    return (
        <div className="admin-blog-management">
            {/* Success Message */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {successMessage}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccessMessage(null)}
                        aria-label="Close"
                    ></button>
                </div>
            )}

            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">Blog Management</h4>
                        <p className="text-muted">Manage and moderate blog posts</p>
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
                    <BlogList
                        blogs={blogs}
                        loading={loading}
                        filters={filters}
                        pagination={pagination}
                        onFilterChange={handleFilterChange}
                        onPageChange={handlePageChange}
                        onViewDetail={handleViewDetail}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onAddBlog={handleAddBlog}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogManagement;
