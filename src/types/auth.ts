export type UserRole = 'driver' | 'customer' | 'shipper';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phoneNumber?: string;
  // Metadata stores role-specific data (e.g., license for driver, uniqueId for others)
  metadata: any; 
}

export interface AuthState {
  user: AppUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}