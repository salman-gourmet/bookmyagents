import api from './api';

export interface SearchParams {
    latitude?: number;
    longitude?: number;
    query?: string;
    radius?: number;
    maxDistance?: number;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
}

export interface ServiceDetail {
    _id: string;
    title: string;
    description: string;
    contactDetails: {
        phone: string;
        email: string;
        address: string;
        website: string;
    };
    pictures: string[];
    userId: {
        _id: string;
        fullName: string;
        email: string;
    };
    category: string;
    price: number;
    isActive: boolean;
    location: {
        coordinates: {
            lat: number;
            lng: number;
        };
        city: string;
        state: string;
        country: string;
    };
    source: string;
    isAd: boolean;
    priorityScore: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ServiceDetailResponse {
    success: boolean;
    data: ServiceDetail;
}

export interface SearchResult {
    id: string;
    source: string;
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    contactEmail: string;
    imageUrls: string[];
    isAd: boolean;
    priorityScore: number;
    distance: number;
    service?: ServiceDetail;
}

export interface SearchResponse {
    success: boolean;
    results: SearchResult[];
    total: number;
    searchParams: SearchParams;
}

export const searchService = {
    searchTours: async (params: SearchParams): Promise<SearchResponse> => {
        try {
            const response = await api.get('/search/tour', {
                params: {
                    latitude: params.latitude,
                    longitude: params.longitude,
                    query: params.query,
                    radius: params.radius,
                    maxDistance: params.maxDistance,
                    checkIn: params.checkIn,
                    checkOut: params.checkOut,
                    guests: params.guests,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Search API error:', error);
            throw error;
        }
    },

    getServiceDetail: async (id: string): Promise<ServiceDetail> => {
        try {
            const response = await api.get(`/services/${id}`);
            const serviceResponse: ServiceDetailResponse = response.data;
            return serviceResponse.data;
        } catch (error) {
            console.error('Service detail API error:', error);
            throw error;
        }
    },
};
