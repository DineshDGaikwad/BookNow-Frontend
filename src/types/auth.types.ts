export interface User {
  userId: string;
  email: string;
  name: string;
  role: 'Customer' | 'Organizer' | 'Admin';
  profileCompleted: boolean;
  phone?: string;
  address?: string;
  city?: string;
  dateOfBirth?: string;
  createdAt?: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  name: string;
  role: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  profileCompleted: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CustomerRegisterRequest {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface OrganizerRegisterRequest extends CustomerRegisterRequest {
  businessName: string;
  businessLicense: string;
  businessAddress: string;
  websiteUrl: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}