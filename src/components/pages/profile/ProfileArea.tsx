import React, { useState, useEffect } from 'react';
import { profileService, type ProfileData, type UpdateProfileData } from '../../../services/profileService';

const ProfileArea: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UpdateProfileData>({
        fullName: '',
        phoneNumber: '',
        expertise: []
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Expertise options based on the schema
    const expertiseOptions = [
        'study visa',
        'visit visa',
        'job visa',
        'umrah visa',
        'tourism visa',
        'other'
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await profileService.getProfile();
            setProfile(response.data);
            setFormData({
                fullName: response.data.fullName,
                phoneNumber: response.data.phoneNumber,
                expertise: response.data.expertise || []
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to fetch profile data' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExpertiseChange = (expertise: string) => {
        setFormData(prev => {
            const currentExpertise = prev.expertise || [];
            const isSelected = currentExpertise.includes(expertise);

            if (isSelected) {
                // Remove if already selected
                return {
                    ...prev,
                    expertise: currentExpertise.filter(item => item !== expertise)
                };
            } else {
                // Add if not selected
                return {
                    ...prev,
                    expertise: [...currentExpertise, expertise]
                };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUpdating(true);
            setMessage(null);

            await profileService.updateProfile(formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            fetchProfile(); // Refresh profile data
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setMessage(null);
        if (profile) {
            setFormData({
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber,
                expertise: profile.expertise || []
            });
        }
    };

    if (loading) {
        return (
            <div className="profile-area pt-120 pb-120">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading profile...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-area pt-80 pb-80">
            <div className="container">
                <div className="row">
                    {/* Left Column - Profile Header & Stats */}
                    <div className="col-lg-4 col-md-5 mb-4">
                        {/* Profile Header */}
                        <div className="profile-header text-center mb-4">
                            <div className="profile-avatar">
                                <div className="avatar-circle">
                                    <i className="fas fa-user"></i>
                                </div>
                            </div>
                            <h3 className="profile-name">{profile?.fullName}</h3>
                            <p className="profile-role">
                                <span className={`badge ${profile?.role === 'admin' ? 'bg-danger' :
                                    profile?.role === 'agent' ? 'bg-warning' : 'bg-primary'}`}>
                                    {profile?.role || 'user'}
                                </span>
                            </p>
                        </div>

                        {/* Account Statistics */}
                        <div className="profile-stats">
                            <div className="stats-card mb-3">
                                <div className="stats-icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <div className="stats-content">
                                    <h5>Member Since</h5>
                                    <p>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="stats-card">
                                <div className="stats-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <div className="stats-content">
                                    <h5>Account Status</h5>
                                    <p className={profile?.isActive ? 'text-success' : 'text-danger'}>
                                        {profile?.isActive ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Information */}
                    <div className="col-lg-8 col-md-7">

                        {/* Message Alert */}
                        {message && (
                            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                                {message.text}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setMessage(null)}
                                ></button>
                            </div>
                        )}

                        {/* Profile Card */}
                        <div className="profile-card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4>Profile Information</h4>
                                <button
                                    className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                                    onClick={() => setIsEditing(!isEditing)}
                                    disabled={updating}
                                >
                                    {isEditing ? (
                                        <>
                                            <i className="fas fa-times me-2"></i>
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-edit me-2"></i>
                                            Edit Profile
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="card-body">
                                {isEditing ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="fullName"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">Expertise</label>
                                                <div className="expertise-multiselect">
                                                    <div className="row g-2">
                                                        {expertiseOptions.map((option) => (
                                                            <div key={option} className="col-md-4 col-sm-6">
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`expertise-${option}`}
                                                                        checked={formData.expertise?.includes(option) || false}
                                                                        onChange={() => handleExpertiseChange(option)}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor={`expertise-${option}`}
                                                                    >
                                                                        {option.charAt(0).toUpperCase() + option.slice(1).replace(' ', ' ')}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {formData.expertise && formData.expertise.length > 0 && (
                                                        <div className="selected-expertise mt-3">
                                                            <small className="text-muted">Selected: </small>
                                                            <div className="d-flex flex-wrap gap-1 mt-1">
                                                                {formData.expertise.map((item) => (
                                                                    <span key={item} className="badge bg-primary">
                                                                        {item.charAt(0).toUpperCase() + item.slice(1).replace(' ', ' ')}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        disabled={updating}
                                                    >
                                                        {updating ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-save me-2"></i>
                                                                Update Profile
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={handleCancel}
                                                        disabled={updating}
                                                    >
                                                        <i className="fas fa-times me-2"></i>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="profile-info">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="info-item">
                                                    <label className="info-label">Full Name</label>
                                                    <p className="info-value">{profile?.fullName}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="info-item">
                                                    <label className="info-label">Email</label>
                                                    <p className="info-value">{profile?.email}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="info-item">
                                                    <label className="info-label">Phone Number</label>
                                                    <p className="info-value">{profile?.phoneNumber}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="info-item">
                                                    <label className="info-label">Role</label>
                                                    <p className="info-value">
                                                        <span className={`badge ${profile?.role === 'admin' ? 'bg-danger' :
                                                            profile?.role === 'agent' ? 'bg-warning' : 'bg-primary'}`}>
                                                            {profile?.role || 'user'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="info-item">
                                                    <label className="info-label">Status</label>
                                                    <p className="info-value">
                                                        <span className={`badge ${profile?.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                                            {profile?.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="info-item">
                                                    <label className="info-label">Member Since</label>
                                                    <p className="info-value">
                                                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="info-item">
                                                    <label className="info-label">Expertise</label>
                                                    <div className="info-value">
                                                        {profile?.expertise && profile.expertise.length > 0 ? (
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {profile.expertise.map((item, index) => (
                                                                    <span key={index} className="badge bg-info me-1 mb-1">
                                                                        {item.charAt(0).toUpperCase() + item.slice(1).replace(' ', ' ')}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted">
                                                                <i className="fas fa-info-circle me-1"></i>
                                                                No expertise selected
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileArea;
