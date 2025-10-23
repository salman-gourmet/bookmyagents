import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { serviceService } from '../../../services/serviceService';
import { type Service, type CreateServiceData, type ServiceFilters, type ServiceStats } from '../../../types/service';
import ServiceForm from '../../forms/ServiceForm';
import ServiceList from '../../common/ServiceList';
import AgentBlogManagement from '../admin/AgentBlogManagement';
import InnerHeader from '../../../layouts/headers/InnerHeader';
import FooterFive from '../../../layouts/footers/FooterFive';

type ActiveView = 'list' | 'create' | 'edit' | 'blogs';

const AgentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('list');
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<ServiceStats>({
    totalServices: 0,
    servicesByCategory: {},
    averagePrice: 0,
    totalRevenue: 0,
  });

  // Filters
  const [filters, setFilters] = useState<ServiceFilters>({
    page: 1,
    limit: 12,
    search: '',
    category: '',
  });

  useEffect(() => {
    if (activeView === 'list') {
      fetchServices();
      fetchStats();
    }
  }, [activeView, filters]);

  console.log("user", user, "activeView", activeView);

  const fetchServices = async () => {
    if (!user?._id) return;

    try {
      setIsLoading(true);
      const response = await serviceService.getAgentServices(filters);
      console.log("response", response, "user.id", user._id, "filters", filters);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user?._id) return;

    try {
      const response = await serviceService.getServiceStats(user._id);
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateService = async (serviceData: CreateServiceData) => {
    try {
      setIsSubmitting(true);
      await serviceService.createService(serviceData);
      setActiveView('list');
      fetchServices();
      fetchStats();
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateService = async (serviceData: CreateServiceData) => {
    if (!editingService?._id) return;

    try {
      setIsSubmitting(true);
      await serviceService.updateService({ _id: editingService._id, ...serviceData });
      setActiveView('list');
      setEditingService(null);
      fetchServices();
      fetchStats();
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setActiveView('edit');
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await serviceService.deleteService(serviceId);
      fetchServices();
      fetchStats();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleCancelForm = () => {
    setActiveView('list');
    setEditingService(null);
  };

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   }
  // };

  const getCategoryStats = () => {
    return Object.entries(stats.servicesByCategory).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
    }));
  };

  return (
    <>
      <InnerHeader />

      <div className="agent-dashboard pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Dashboard Header */}
              <div className="dashboard-header mb-40">
                <div className="row align-items-center">
                  <div className="col-lg-8 col-md-7 col-12">
                    <h2 className="dashboard-title">Agent Dashboard</h2>
                    <p className="dashboard-subtitle">
                      Welcome back, {user?.fullName || 'Agent'}! {
                        activeView === 'blogs'
                          ? 'Manage your blog posts and share your expertise with the community.'
                          : 'Manage your services and grow your business.'
                      }
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-5 col-12 text-md-end text-start mt-md-0 mt-3">
                    {/* <button 
                    onClick={handleLogout}
                    className="btn btn-outline-"
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button> */}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="dashboard-navigation mb-40">
                <ul className="nav nav-pills justify-content-center flex-wrap">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeView === 'list' ? 'active' : ''}`}
                      onClick={() => setActiveView('list')}
                    >
                      <i className="fas fa-list me-2"></i>
                      <span className="d-none d-sm-inline">My Services</span>
                      <span className="d-sm-none">Services</span>
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeView === 'blogs' ? 'active' : ''}`}
                      onClick={() => setActiveView('blogs')}
                    >
                      <i className="fas fa-blog me-2"></i>
                      <span className="d-none d-sm-inline">My Blogs</span>
                      <span className="d-sm-none">Blogs</span>
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeView === 'create' ? 'active' : ''}`}
                      onClick={() => setActiveView('create')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      <span className="d-none d-sm-inline">Create Service</span>
                      <span className="d-sm-none">Create</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Services List View */}
              {activeView === 'list' && (
                <>
                  {/* Stats Cards */}
                  <div className="row mb-40">
                    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-30">
                      <div className="stats-card">
                        <div className="stats-icon">
                          <i className="fas fa-box"></i>
                        </div>
                        <div className="stats-content">
                          <h3>{stats.totalServices}</h3>
                          <p>Total Services</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-30">
                      <div className="stats-card">
                        <div className="stats-icon">
                          <i className="fas fa-dollar-sign"></i>
                        </div>
                        <div className="stats-content">
                          <h3>${stats.averagePrice.toFixed(0)}</h3>
                          <p>Average Price</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-30">
                      <div className="stats-card">
                        <div className="stats-icon">
                          <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="stats-content">
                          <h3>${stats.totalRevenue.toFixed(0)}</h3>
                          <p>Total Revenue</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-30">
                      <div className="stats-card">
                        <div className="stats-icon">
                          <i className="fas fa-tags"></i>
                        </div>
                        <div className="stats-content">
                          <h3>{Object.keys(stats.servicesByCategory).length}</h3>
                          <p>Categories</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  {getCategoryStats().length > 0 && (
                    <div className="dashboard-card mb-40">
                      <div className="card-header">
                        <h4>Services by Category</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          {getCategoryStats().map(({ category, count }) => (
                            <div key={category} className="col-md-3 col-sm-6 mb-3">
                              <div className="category-stat">
                                <div className="category-name">{category}</div>
                                <div className="category-count">{count} services</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filters */}
                  <div className="dashboard-card mb-30">
                    <div className="card-header">
                      <h4>Filter Services</h4>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-lg-4 col-md-6 col-12">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search services..."
                            value={filters.search || ''}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                          />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                          <select
                            className="form-select"
                            value={filters.category || ''}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                          >
                            <option value="">All Categories</option>
                            <option value="accommodation">Accommodation</option>
                            <option value="transportation">Transportation</option>
                            <option value="tours">Tours</option>
                            <option value="food">Food & Dining</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="shopping">Shopping</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="col-lg-2 col-md-3 col-6">
                          <button
                            className="btn btn-primary w-100"
                            onClick={fetchServices}
                          >
                            <i className="fas fa-search d-md-none me-1"></i>
                            <span className="d-none d-md-inline">Search</span>
                            <span className="d-md-none">Search</span>
                          </button>
                        </div>
                        <div className="col-lg-3 col-md-9 col-6">
                          <button
                            className="btn btn-success w-100"
                            onClick={() => setActiveView('create')}
                          >
                            <i className="fas fa-plus me-2"></i>
                            <span className="d-none d-lg-inline">Create New Service</span>
                            <span className="d-lg-none">Create Service</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h4>My Services ({services.length})</h4>
                    </div>
                    <div className="card-body">
                      <ServiceList
                        services={services}
                        onEdit={handleEditService}
                        onDelete={handleDeleteService}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Create Service View */}
              {activeView === 'create' && (
                <div className="dashboard-card">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4>Create New Service</h4>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleCancelForm}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Services
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <ServiceForm
                      onSubmit={handleCreateService}
                      onCancel={handleCancelForm}
                      isLoading={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* Edit Service View */}
              {activeView === 'edit' && editingService && (
                <div className="dashboard-card">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4>Edit Service</h4>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleCancelForm}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Services
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <ServiceForm
                      service={editingService}
                      onSubmit={handleUpdateService}
                      onCancel={handleCancelForm}
                      isLoading={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* Blog Management View */}
              {activeView === 'blogs' && (
                <AgentBlogManagement />
              )}
            </div>
          </div>
        </div>
      </div>

      <FooterFive />
    </>
  );
};

export default AgentDashboard;
