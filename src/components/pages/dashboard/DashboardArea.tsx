import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { userService, type UserFilters } from '../../../services/userService';
import { type User } from '../../../services/authService';
import { subscriptionService, type Subscription } from '../../../services/subscriptionService';
import EditSubscriptionModal from './EditSubscriptionModal';
import UserSubscriptionModal from './UserSubscriptionModal';

type ActiveModule = 'users' | 'subscriptions';
type UserRoleFilter = 'all' | 'admin' | 'agent' | 'user';

const DashboardArea: React.FC = () => {
  const { user } = useAuth();
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
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserSubscriptionModal, setShowUserSubscriptionModal] = useState(false);

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
      console.log("userId", userId);
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

  const handleRoleFilterChange = (role: UserRoleFilter) => {
    setRoleFilter(role);
    const newFilters = {
      ...userFilters,
      role: role === 'all' ? '' : role
    };
    setUserFilters(newFilters);
  };

  const handleAssignSubscription = (userItem: User) => {
    setSelectedUser(userItem);
    setShowUserSubscriptionModal(true);
  };

  const handleSubscriptionAssigned = () => {
    fetchUsers(); // Refresh users list
  };

  // Filter users by role for display
  const getFilteredUsers = () => {
    if (roleFilter === 'all') return users;
    const filteredUsers = users.filter(userItem => userItem.role === roleFilter);
    console.log("filteredUsers", filteredUsers);
    return filteredUsers;
  };


  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   }
  // };

  return (
    <div className="dashboard-area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Dashboard Header */}
            <div className="dashboard-header mb-40">
              <div className="row align-items-center">
                <div className="col-lg-8 col-md-7 col-12">
                  <h2 className="dashboard-title">Welcome back, {user?.fullName || 'User'}!</h2>
                  <p className="dashboard-subtitle">Manage your users and subscriptions from here.</p>
                </div>
                <div className="col-lg-4 col-md-5 col-12 text-md-end text-start mt-md-0 mt-3">
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
              <div className="nav nav-pills justify-content-center flex-wrap">
                <button
                  className={`nav-link ${activeModule === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveModule('users')}
                >
                  <i className="fas fa-users me-2"></i>
                  <span className="d-none d-sm-inline">User Module</span>
                  <span className="d-sm-none">Users</span>
                </button>
                <button
                  className={`nav-link ${activeModule === 'subscriptions' ? 'active' : ''}`}
                  onClick={() => setActiveModule('subscriptions')}
                >
                  <i className="fas fa-credit-card me-2"></i>
                  <span className="d-none d-sm-inline">Subscription Module</span>
                  <span className="d-sm-none">Subscriptions</span>
                </button>
              </div>
            </div>

            {/* User Module */}
            {activeModule === 'users' && (
              <>
                {/* User Stats Cards */}
                <div className="row mb-40">
                  <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-30">
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
                  <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-30">
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
                  <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-30">
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

                {/* Role Filter Tabs */}
                <div className="dashboard-card mb-30">
                  <div className="card-header">
                    <h4>User Management</h4>
                  </div>
                  <div className="card-body">
                    <div className="row g-3 mb-3">
                      <div className="col-lg-4 col-md-6 col-12">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search users..."
                          value={userFilters.search}
                          onChange={(e) => setUserFilters({...userFilters, search: e.target.value})}
                        />
                      </div>
                      <div className="col-lg-2 col-md-3 col-6">
                        <button
                          className="btn btn-primary w-100"
                          onClick={fetchUsers}
                        >
                          <i className="fas fa-search d-md-none me-1"></i>
                          <span className="d-none d-md-inline">Search</span>
                          <span className="d-md-none">Search</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Role Filter Tabs */}
                    <div className="role-filter-tabs">
                      <div className="nav nav-pills justify-content-center">
                        <button
                          className={`nav-link ${roleFilter === 'all' ? 'active' : ''}`}
                          onClick={() => handleRoleFilterChange('all')}
                        >
                          <i className="fas fa-users me-2"></i>
                          All Users ({userStats.totalUsers})
                        </button>
                        <button
                          className={`nav-link ${roleFilter === 'admin' ? 'active' : ''}`}
                          onClick={() => handleRoleFilterChange('admin')}
                        >
                          <i className="fas fa-shield-alt me-2 role-icon-admin"></i>
                          Admins ({users.filter(u => u.role === 'admin').length})
                        </button>
                        <button
                          className={`nav-link ${roleFilter === 'agent' ? 'active' : ''}`}
                          onClick={() => handleRoleFilterChange('agent')}
                        >
                          <i className="fas fa-user-tie me-2 role-icon-agent"></i>
                          Agents ({users.filter(u => u.role === 'agent').length})
                          {/* <small className="d-block text-muted">With Subscriptions</small> */}
                        </button>
                        <button
                          className={`nav-link ${roleFilter === 'user' ? 'active' : ''}`}
                          onClick={() => handleRoleFilterChange('user')}
                        >
                          <i className="fas fa-user me-2 role-icon-user"></i>
                          Users ({users.filter(u => u.role === 'user' || !u.role).length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h4>
                      {roleFilter === 'all' ? 'All Users' : 
                       roleFilter === 'admin' ? 'Admin Users' :
                       roleFilter === 'agent' ? 'Agent Users' : 'Regular Users'}
                      <span className="badge bg-secondary ms-2">{getFilteredUsers().length}</span>
                    </h4>
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
                              <th>Agent Subscription</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(getFilteredUsers()) && getFilteredUsers().map((userItem) => (
                              <tr key={userItem.id}>
                                <td>{userItem.fullName}</td>
                                <td>{userItem.email}</td>
                                <td>
                                  <span className={`badge ${
                                    userItem.role === 'admin' ? 'bg-danger' : 
                                    userItem.role === 'agent' ? 'bg-warning' : 'bg-primary'
                                  }`}>
                                    {userItem.role || 'user'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${userItem.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                    {userItem.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td>
                                  {userItem.role === 'agent' ? (
                                    userItem.subscription ? (
                                      <div className="subscription-info">
                                        <span className="badge bg-info">
                                          <i className="fas fa-check-circle me-1"></i>
                                          {userItem.subscription.name}
                                        </span>
                                        {/* <div className="subscription-price">
                                          <i className="fas fa-dollar-sign me-1"></i>
                                          {userItem.subscription.price}/{userItem.subscription.duration}
                                        </div> */}
                                      </div>
                                    ) : (
                                      <span className="badge bg-warning">
                                        <i className="fas fa-exclamation-triangle me-1"></i>
                                        No Subscription
                                      </span>
                                    )
                                  ) : (
                                    <span className="text-muted">
                                      <i className="fas fa-minus me-1"></i>
                                      N/A
                                    </span>
                                  )}
                                </td>
                                <td>{userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                  <div className="btn-group" role="group">
                                    {userItem.role !== 'admin' && <button
                                      className={`btn btn-sm ${userItem.isActive ? 'btn-warning' : 'btn-success'}`}
                                      onClick={() => handleUserStatusToggle(userItem._id, userItem.isActive || false)}
                                      title={userItem.isActive ? 'Deactivate User' : 'Activate User'}
                                    >
                                      <i className={`fas ${userItem.isActive ? 'fa-user-times' : 'fa-user-plus'}`}></i>
                                    </button>}
                                    {userItem.role === 'agent' && (
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleAssignSubscription(userItem)}
                                        title="Manage Subscription"
                                      >
                                        <i className="fas fa-cog"></i>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {getFilteredUsers().length === 0 && (
                          <div className="empty-state">
                            <i className="fas fa-users"></i>
                            <h5 className="mt-3 mb-2">No Users Found</h5>
                            <p className="text-muted">No users found for the selected role filter.</p>
                          </div>
                        )}
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
                  <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-30">
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
                  <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-30">
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
                  <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-30">
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

      {/* User Subscription Modal */}
      {showUserSubscriptionModal && selectedUser && (
        <UserSubscriptionModal
          user={selectedUser}
          isOpen={showUserSubscriptionModal}
          onClose={() => {
            setShowUserSubscriptionModal(false);
            setSelectedUser(null);
          }}
          onSubscriptionAssigned={handleSubscriptionAssigned}
        />
      )}
    </div>
  );
};

export default DashboardArea;
