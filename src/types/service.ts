export interface Service {
  _id?: string;
  title: string;
  description: string;
  pictures: string[];
  contactDetails: {
    phone: string;
    email: string;
    address: string;
    website: string;
  };
  category: 'accommodation' | 'transportation' | 'tours' | 'food' | 'entertainment' | 'shopping' | 'other';
  price: number;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
  agentId?: string;
}

export interface CreateServiceData {
  title: string;
  description: string;
  pictures: string[];
  contactDetails: {
    phone: string;
    email: string;
    address: string;
    website: string;
  };
  category: 'accommodation' | 'transportation' | 'tours' | 'food' | 'entertainment' | 'shopping' | 'other';
  price: number;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  _id: string;
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ServiceResponse {
  data: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceStats {
  totalServices: number;
  servicesByCategory: Record<string, number>;
  averagePrice: number;
  totalRevenue: number;
}
