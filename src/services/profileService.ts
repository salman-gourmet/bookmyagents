import api from './api';

// Types for profile operations
export interface ProfileData {
    _id: string;
    role: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    isActive: boolean;
    expertise?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileData {
    fullName?: string;
    phoneNumber?: string;
    expertise?: string[];
}

export interface ProfileResponse {
    success: boolean;
    message: string;
    data: ProfileData;
}

export interface UpdateProfileResponse {
    success: boolean;
    message: string;
}

// Profile API functions
export const profileService = {
    // Get user profile
    getProfile: async (): Promise<ProfileResponse> => {
        try {
            const response = await api.get('/profile');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (profileData: UpdateProfileData): Promise<UpdateProfileResponse> => {
        try {
            const response = await api.put('/profile', profileData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
