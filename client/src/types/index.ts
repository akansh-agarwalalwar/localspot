export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'subadmin';
  permissions: {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    [key: string]: boolean;
  };
  isActive?: boolean;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subadmin extends User {
  createdBy?: string | User;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Activity {
  _id: string;
  userId: string | User;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'SIGNUP' | 'BOOKING';
  resource: string;
  resourceId?: string | null;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILED';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export interface SubadminFormData {
  username: string;
  email: string;
  password: string;
  permissions: {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    [key: string]: boolean;
  };
  isActive?: boolean;
}

export interface ActivityFilters {
  action?: string;
  resource?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface DormitoryMember {
  fullName: string;
  year: string;
  state: string;
  branch: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: {
    ac: boolean;
    wifi: boolean;
    ro: boolean; // RO Water
    mess: boolean;
    securityGuard: boolean;
    maid: boolean;
    parking: boolean;
    laundry: boolean;
    powerBackup: boolean;
    cctv: boolean;
  };
  roomTypes: {
    single: boolean;
    double: boolean;
    triple: boolean;
    dormitory: boolean;
  };
  pics: string[]; // Array of Google Drive links
  coverPhoto?: string; // Single cover photo URL
  facilityPhotos?: string[]; // Array of facility/interior photos
  dormitoryMembers?: DormitoryMember[]; // Members staying in dormitory
  createdBy: string | User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: {
    ac: boolean;
    wifi: boolean;
    ro: boolean;
    mess: boolean;
    securityGuard: boolean;
    maid: boolean;
    parking: boolean;
    laundry: boolean;
    powerBackup: boolean;
    cctv: boolean;
  };
  roomTypes: {
    single: boolean;
    double: boolean;
    triple: boolean;
    dormitory: boolean;
  };
  pics: string[];
  coverPhoto: string; // Single cover photo URL (required)
  facilityPhotos: string[]; // Array of facility/interior photos
  dormitoryMembers: DormitoryMember[]; // Members staying in dormitory
}

export interface Mess {
  _id: string;
  title: string;
  description: string;
  location: string;
  distanceFromDTU: string;
  images: string[];
  coverPhoto: string;
  timings: {
    breakfast: {
      available: boolean;
      time: string;
    };
    lunch: {
      available: boolean;
      time: string;
    };
    dinner: {
      available: boolean;
      time: string;
    };
    snacks: {
      available: boolean;
      time: string;
    };
  };
  hasAC: boolean;
  pricing: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
  createdBy: string | User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  directImageUrls?: string[];
  directCoverPhotoUrl?: string;
}

export interface MessFormData {
  title: string;
  description: string;
  location: string;
  distanceFromDTU: string;
  images: string[];
  coverPhoto: string;
  timings: {
    breakfast: {
      available: boolean;
      time: string;
    };
    lunch: {
      available: boolean;
      time: string;
    };
    dinner: {
      available: boolean;
      time: string;
    };
    snacks: {
      available: boolean;
      time: string;
    };
  };
  hasAC: boolean;
  pricing: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
}

export interface GamingZone {
  _id: string;
  title: string;
  description: string;
  location: string;
  monthlyPrice: number;
  hourlyPrice: number;
  images: string[];
  coverPhoto: string;
  amenities: {
    ac: boolean;
    gamingConsole: boolean;
    ps5: boolean;
    xbox: boolean;
    wifi: boolean;
    parking: boolean;
    powerBackup: boolean;
    cctv: boolean;
  };
  createdBy: string | User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  directImageUrls?: string[];
  directCoverPhotoUrl?: string;
}

export interface GigWorkerFormData {
  fullName: string;
  email: string;
  mobile: string;
  year: string;
  branch: string;
  skills: string[];
  experience: string;
  hourlyRate: string;
}

export interface GamingZoneFormData {
  title: string;
  description: string;
  location: string;
  monthlyPrice: number;
  hourlyPrice: number;
  images: string[];
  coverPhoto: string;
  amenities: {
    ac: boolean;
    gamingConsole: boolean;
    ps5: boolean;
    xbox: boolean;
    wifi: boolean;
    parking: boolean;
    powerBackup: boolean;
    cctv: boolean;
  };
}
