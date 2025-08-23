import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  SubadminFormData, 
  ActivityFilters,
  PropertyFormData,
  MessFormData
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localspot-spq8.onrender.com/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any): any => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Admin API
export const adminAPI = {
  createSubadmin: (data: SubadminFormData) => api.post('/admin/subadmins', data),
  getAllSubadmins: (params = {}) => api.get('/admin/subadmins', { params }),
  getSubadminById: (id: string) => api.get(`/admin/subadmins/${id}`),
  updateSubadmin: (id: string, data: Partial<SubadminFormData>) => api.put(`/admin/subadmins/${id}`, data),
  deleteSubadmin: (id: string) => api.delete(`/admin/subadmins/${id}`),
};

// Activity API
export const activityAPI = {
  getAllActivities: (params: ActivityFilters = {}) => api.get('/activity', { params }),
  getUserActivities: (userId: string, params = {}) => api.get(`/activity/user/${userId}`, { params }),
};

// Subadmin API
export const subadminAPI = {
  getDashboard: () => api.get('/subadmin/dashboard'),
};

// Property API
export const propertyAPI = {
  createProperty: (data: PropertyFormData) => {
    console.log('Sending property data:', data);
    return api.post('/properties', data);
  },
  getAllProperties: (params = {}) => api.get('/properties/public', { params }), // Use public endpoint
  getPropertyById: (id: string) => api.get(`/properties/public/${id}`), // Use public endpoint
  updateProperty: (id: string, data: Partial<PropertyFormData>) => api.put(`/properties/${id}`, data),
  deleteProperty: (id: string) => api.delete(`/properties/${id}`),
  // Admin endpoints (require auth)
  getAllPropertiesAdmin: (params = {}) => api.get('/properties', { params }),
  getPropertyByIdAdmin: (id: string) => api.get(`/properties/${id}`),
};

// Mess API
export const messAPI = {
  createMess: (data: MessFormData) => {
    console.log('Sending mess data:', data);
    return api.post('/messes', data);
  },
  getAllMesses: (params = {}) => api.get('/messes/public', { params }), // Use public endpoint
  getMessById: (id: string) => api.get(`/messes/public/${id}`), // Use public endpoint
  updateMess: (id: string, data: Partial<MessFormData>) => api.put(`/messes/${id}`, data),
  deleteMess: (id: string) => api.delete(`/messes/${id}`),
  // Admin endpoints (require auth)
  getAllMessesAdmin: (params = {}) => api.get('/messes', { params }),
  getMessByIdAdmin: (id: string) => api.get(`/messes/${id}`),
};

export default api;
