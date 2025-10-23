import React from 'react';
import { type BlogStats } from '../../../types/blog';

interface BlogStatsCardProps {
    stats: BlogStats;
}

const BlogStatsCard: React.FC<BlogStatsCardProps> = ({ stats }) => {
    // Handle both old format (direct properties) and new format (statusCounts array)
    const getStatusCount = (status: string) => {
        if (stats.statusCounts && Array.isArray(stats.statusCounts)) {
            const statusItem = stats.statusCounts.find((item: any) => item._id === status);
            return statusItem ? statusItem.count : 0;
        }
        // Fallback to direct properties for backward compatibility
        switch (status) {
            case 'pending': return stats.pendingBlogs || 0;
            case 'approved': return stats.approvedBlogs || 0;
            case 'rejected': return stats.rejectedBlogs || 0;
            default: return 0;
        }
    };

    const statCards = [
        {
            title: 'Total Blogs',
            value: stats.totalBlogs,
            icon: 'fas fa-blog',
            color: 'primary',
            bgColor: 'bg-primary'
        },
        {
            title: 'Pending',
            value: getStatusCount('pending'),
            icon: 'fas fa-clock',
            color: 'warning',
            bgColor: 'bg-warning'
        },
        {
            title: 'Approved',
            value: getStatusCount('approved'),
            icon: 'fas fa-check-circle',
            color: 'success',
            bgColor: 'bg-success'
        },
        {
            title: 'Rejected',
            value: getStatusCount('rejected'),
            icon: 'fas fa-times-circle',
            color: 'danger',
            bgColor: 'bg-danger'
        },
        {
            title: 'Published',
            value: stats.publishedBlogs || 0,
            icon: 'fas fa-globe',
            color: 'info',
            bgColor: 'bg-info'
        }
    ];

    return (
        <>
            {statCards.map((stat, index) => (
                <div key={index} className="col-md-6 col-lg-2">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className={`${stat.bgColor} rounded-circle p-3 me-3`}>
                                    <i className={`${stat.icon} text-white`}></i>
                                </div>
                                <div>
                                    <h6 className="card-title mb-1">{stat.title}</h6>
                                    <h3 className={`text-${stat.color} mb-0`}>{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default BlogStatsCard;
