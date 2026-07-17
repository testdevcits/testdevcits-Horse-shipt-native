// // src/services/authService.ts

// import axiosClient from "../axiosClient";


// export interface LoginResponse {
//   success: boolean;
//   message: string;
//   token?: string;
//   driver?: any;
//   data?: {
//     token: string;
//     driver: any;
//   };
// }

// const login = async (userData: Record<string, string>): Promise<LoginResponse> => {
//   // Update '/api/driver/login' to match your backend's actual endpoint route
//   return axiosClient.post('/api/driver/driver/login', userData);
// };

// const authService = { login };
// export default authService;


// src/api/services/authService.ts
import axiosClient from "../axiosClient";
import { AppUser, UserRole } from "../../types/auth";

const transformResponse = (response: any): { user: AppUser; token: string } => {
  const data = response.data;

  // Logic for Driver
  if (data.driver || response.driver) {
    const d = data.driver || response.driver;
    return {
      token: data.token || response.token,
      user: {
        id: d._id,
        name: d.name,
        email: d.email,
        role: 'driver',
        profileImage: d.profileImage?.url,
        phoneNumber: d.phone,
        metadata: {
          license: d.licenseNumber,
          status: d.driverStatus,
          assignedVehicles: d.assignedVehicles
        }
      }
    };
  }

  // Logic for Customer and Shipper
  return {
    token: data.token,
    user: {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      profileImage: data.profileImage?.url,
      phoneNumber: data.mobile || data.phone,
      metadata: {
        uniqueId: data.uniqueId,
        stripeVerified: data.stripeVerified
      }
    }
  };
};

const login = async (userData: any, role: UserRole) => {
  // Determine endpoint based on role selected on the Signup/Login UI
  const endpoints = {
    driver: '/api/driver/driver/login',
    shipper: '/api/auth/login', // Adjust based on your actual routes
    customer: '/api/auth/login'
  };

  const response = await axiosClient.post(endpoints[role], userData);
  return transformResponse(response);
};

export default { login };