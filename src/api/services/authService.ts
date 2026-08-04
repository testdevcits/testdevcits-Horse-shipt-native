
import axiosClient from "../axiosClient";
import { AppUser, UserRole } from "../../types/auth";

const transformResponse = (response: any, selectedRole?: UserRole): { user: AppUser; token: string } => {
  const data = response.data || response;

  // 1. Logic for Driver (If backend returns 'driver' object instead of 'role')
  if (data?.driver || response.driver) {
    const d = data?.driver || response.driver;
    return {
      token: data?.token || response.token,
      user: {
        id: d._id,
        name: d.name,
        email: d.email,
        role: 'driver', // Manually assigning because API doesn't provide it
        profileImage: typeof d.profileImage === 'string' ? d.profileImage : d.profileImage?.url,
        phoneNumber: d.phone,
        metadata: {
          license: d.licenseNumber,
          status: d.driverStatus,
        }
      }
    };
  }

  // 2. Logic for Customer and Shipper (Standard Role handling)
  return {
    token: data?.token,
    user: {
      id: data?._id,
      name: data?.name,
      email: data?.email,
      role: (data?.role || selectedRole) as UserRole, // Fallback to selectedRole
      profileImage: typeof data?.profileImage === 'string' ? data?.profileImage : data?.profileImage?.url,
      phoneNumber: data?.mobile || data?.phone,
      metadata: {
        uniqueId: data?.uniqueId,
        stripeVerified: data?.stripeVerified
      }
    }
  };
};

const authService = {
  login: async (userData: any, role: UserRole) => {
    const endpoints = {
      driver: '/api/driver/driver/login',
      shipper: '/api/auth/login',
      customer: '/api/auth/login'
    };
    const response = await axiosClient.post(endpoints[role], userData);
    return transformResponse(response, role); // Pass role to ensure it's set
  },


  signup: async (payload: any): Promise<{ success: boolean; requiresOtp: boolean; message: string }> => {
    // payload: { name, email, password, role }
    return axiosClient.post('/api/auth/signup', payload);
  },

  verifySignupOtp: async (payload: { email: string; role: UserRole; otp: string }) => {
    const response = await axiosClient.post('/api/auth/signup/verify-otp', payload);
    return transformResponse(response, payload.role);
  },



  /**
   * 4. Forgot Password
   */
  forgotPassword: async (email: string, role: UserRole): Promise<{ success: boolean; message: string }> => {
    const payload = { email: email.trim().toLowerCase(), role };
    return axiosClient.post('/api/auth/forgot-password', payload);
  },


  verifyResetOtp: async (payload: { email: string; role: UserRole; otp: string }): Promise<any> => {
    return axiosClient.post('/api/auth/verify-reset-otp', payload);
  },


  /**
 * Final Step: Reset Password with Verified OTP
 */
  resetPassword: async (payload: {
    email: string;
    role: UserRole;
    otp: string;
    newPassword: string
  }): Promise<{ success: boolean; message: string }> => {
    return axiosClient.post('/api/auth/reset-password', payload);
  },


};

export default authService;