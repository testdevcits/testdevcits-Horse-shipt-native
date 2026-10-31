import axiosClient from '../axiosClient';
import API_ENDPOINTS from '../endpoints';
import { AppUser, UserRole } from '../../types/auth';

const transformResponse = (
  response: any,
  selectedRole?: UserRole,
): { user: AppUser; token: string } => {
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
        profileImage:
          typeof d.profileImage === 'string'
            ? d.profileImage
            : d.profileImage?.url,
        phoneNumber: d.phone,
        metadata: {
          license: d.licenseNumber,
          status: d.driverStatus,
        },
      },
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
      profileImage:
        typeof data?.profileImage === 'string'
          ? data?.profileImage
          : data?.profileImage?.url,
      phoneNumber: data?.mobile || data?.phone,
      metadata: {
        uniqueId: data?.uniqueId,
        stripeVerified: data?.stripeVerified,
      },
    },
  };
};

const authService = {
  login: async (userData: any, role: UserRole) => {
    const endpoints = {
      driver: API_ENDPOINTS.AUTH.LOGIN_DRIVER,
      shipper: API_ENDPOINTS.AUTH.LOGIN,
      customer: API_ENDPOINTS.AUTH.LOGIN,
    };
    const response = await axiosClient.post(endpoints[role], userData);
    return transformResponse(response, role); // Pass role to ensure it's set
  },

  googleLogin: async (googleData: {
    idToken: string;
    role: UserRole;
    intent?: 'login' | 'signup';
    email?: string;
    name?: string | null;
    photo?: string | null;
  }) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
        idToken: googleData.idToken,
        role: googleData.role,
        intent: googleData.intent || 'login',
      });
      return transformResponse(response, googleData.role);
    } catch (error: any) {
      // Fallback if backend returns mock/development offline error
      const responseData = error.response?.data;
      if (responseData && (responseData.user || responseData.token)) {
        return transformResponse(responseData, googleData.role);
      }
      throw error;
    }
  },

  signup: async (
    payload: any,
  ): Promise<{ success: boolean; requiresOtp: boolean; message: string }> => {
    // payload: { name, email, password, role }
    return axiosClient.post(API_ENDPOINTS.AUTH.SIGNUP, payload);
  },

  verifySignupOtp: async (payload: {
    email: string;
    role: UserRole;
    otp: string;
  }) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.AUTH.VERIFY_SIGNUP_OTP,
      payload,
    );
    return transformResponse(response, payload.role);
  },

  /**
   * 4. Forgot Password
   */
  forgotPassword: async (
    email: string,
    role: UserRole,
  ): Promise<{ success: boolean; message: string }> => {
    const payload = { email: email.trim().toLowerCase(), role };
    return axiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  },

  verifyResetOtp: async (payload: {
    email: string;
    role: UserRole;
    otp: string;
  }): Promise<any> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_RESET_OTP, payload);
  },

  /**
   * Final Step: Reset Password with Verified OTP
   */
  resetPassword: async (payload: {
    email: string;
    role: UserRole;
    otp: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  },
};

export default authService;
