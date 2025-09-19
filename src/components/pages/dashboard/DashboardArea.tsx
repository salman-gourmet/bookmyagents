import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { userService, type UserFilters } from '../../../services/userService';
import { type User } from '../../../services/authService';
import { subscriptionService, type Subscription } from '../../../services/subscriptionService';
import EditSubscriptionModal from './EditSubscriptionModal';

type ActiveModule = 'users' | 'subscriptions';

const DashboardArea: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<ActiveModule>('users');
  
  // User Module State
  const [users, setUsers] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0
  });
  const [userFilters, setUserFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: '',
    role: ''
  });

  // Subscription Module State
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (activeModule === 'users') {
      fetchUsers();
    } else {
      fetchSubscriptions();
    }
  }, [activeModule]);

  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const response = await userService.getUsers(userFilters);
      console.log("users data", response);
      
      // Set users data
      setUsers(response.data || []);
      
      // Set statistics from the response
      if (response.statistics) {
        setUserStats({
          totalUsers: response.statistics.totalUsers,
          activeUsers: response.statistics.activeUsers,
          newUsersThisMonth: response.statistics.newThisMonth
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setSubscriptionLoading(true);
      const response = await subscriptionService.getSubscriptions();
      setSubscriptions(response.data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await userService.updateUser(userId, { isActive: newStatus });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleSubscriptionUpdate = async (subscriptionData: Partial<Subscription>) => {
    if (!editingSubscription) return;
    
    try {
      await subscriptionService.updateSubscription({_id:editingSubscription._id,...subscriptionData});
      setShowEditModal(false);
      setEditingSubscription(null);
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="dashboard-area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Dashboard Header */}
            <div className="dashboard-header mb-40">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h2 className="dashboard-title">Welcome back, {user?.fullName || 'User'}!</h2>
                  <p className="dashboard-subtitle">Manage your users and subscriptions from here.</p>
                </div>
                <div className="col-md-6">
                  {/* <button 
                    onClick={handleLogout}
                    className="btn btn-danger"
                    style={{width: '100px'}}
                  >
                    Logout
                  </button> */}
                </div>
              </div>
            </div>

            {/* Module Navigation */}
            <div className="module-navigation mb-40">
              <div className="nav nav-pills justify-content-center">
                <button
                  className={`nav-link ${activeModule === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveModule('users')}
                >
                  <i className="fas fa-users me-2"></i>
                  User Module
                </button>
                <button
                  className={`nav-link ${activeModule === 'subscriptions' ? 'active' : ''}`}
                  onClick={() => setActiveModule('subscriptions')}
                >
                  <i className="fas fa-credit-card me-2"></i>
                  Subscription Module
                </button>
              </div>
            </div>

            {/* User Module */}
            {activeModule === 'users' && (
              <>
                {/* User Stats Cards */}
                <div className="row mb-40">
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div className="stats-card">
                      <div className="stats-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="stats-content">
                        <h3>{userStats.totalUsers}</h3>
                        <p>Total Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div className="stats-card">
                      <div className="stats-icon">
                        <i className="fas fa-user-check"></i>
                      </div>
                      <div className="stats-content">
                        <h3>{userStats.activeUsers}</h3>
                        <p>Active Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div className="stats-card">
                      <div className="stats-icon">
                        <i className="fas fa-user-plus"></i>
                      </div>
                      <div className="stats-content">
                        <h3>{userStats.newUsersThisMonth}</h3>
                        <p>New This Month</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Filters */}
                <div className="dashboard-card mb-30">
                  <div className="card-header">
                    <h4>User Filters</h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search users..."
                          value={userFilters.search}
                          onChange={(e) => setUserFilters({...userFilters, search: e.target.value})}
                        />
                      </div>

                      <div className="col-md-2">
                        <button
                          className="btn btn-primary w-100"
                          onClick={fetchUsers}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h4>User Listing</h4>
                  </div>
                  <div className="card-body">
                    {userLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Status</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(users) && users.map((userItem) => (
                              <tr key={userItem.id}>
                                <td>{userItem.fullName}</td>
                                <td>{userItem.email}</td>
                                <td>
                                  <span className={`badge ${userItem.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                    {userItem.role || 'user'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${userItem.role === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                    {userItem.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td>{userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                  <button
                                    className={`btn btn-sm ${userItem.isActive ? 'btn-warning' : 'btn-success'}`}
                                    onClick={() => handleUserStatusToggle(userItem.id, userItem.isActive || false)}
                                  >
                                    {userItem.isActive ? 'Deactivate' : 'Activate'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Subscription Module */}
            {activeModule === 'subscriptions' && (
              <>
                {/* Subscription Stats */}
                <div className="row mb-40">
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div className="stats-card">
                      <div className="stats-icon">
                        <i className="fas fa-credit-card"></i>
                      </div>
                      <div className="stats-content">
                        <h3>{subscriptions.length}</h3>
                        <p>Total Plans</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div className="stats-card">
                      <div className="stats-icon">
                        <i className="fas fa-star"></i>
                      </div>
                      <div className="stats-content">
                        <h3>{subscriptions.filter(s => s.isPopular).length}</h3>
                        <p>Popular Plans</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div className="stats-card">
                      <div className="stats-icon">
                        <i className="fas fa-dollar-sign"></i>
                      </div>
                      <div className="stats-content">
                        <h3>${subscriptions.length > 0 ? (subscriptions.reduce((sum, s) => sum + s.price, 0) / subscriptions.length).toFixed(0) : 0}</h3>
                        <p>Avg Price</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscriptions Table */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h4>Subscription Plans</h4>
                  </div>
                  <div className="card-body">
                    {subscriptionLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Features</th>
                              <th>Popular</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(subscriptions) && subscriptions.map((subscription) => (
                              <tr key={subscription._id}>
                                <td>{subscription.name}</td>
                                <td>${subscription.price}</td>
                                <td>{subscription.features.length} features</td>
                                <td>
                                  <span className={`badge ${subscription.isPopular ? 'bg-warning' : 'bg-secondary'}`}>
                                    {subscription.isPopular ? 'Popular' : 'Standard'}
                                  </span>
                                </td>
                                <td>{subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => {
                                      setEditingSubscription(subscription);
                                      setShowEditModal(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Subscription Modal */}
      {showEditModal && editingSubscription && (
        <EditSubscriptionModal
          subscription={editingSubscription}
          onClose={() => {
            setShowEditModal(false);
            setEditingSubscription(null);
          }}
          onSave={handleSubscriptionUpdate}
        />
      )}
    </div>
  );
};

export default DashboardArea;
