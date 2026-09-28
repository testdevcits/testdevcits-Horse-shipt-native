import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LocationUpdatePayload,
  LocationUpdateResponse,
  MeResponse,
} from '../../types/driver';
import axiosClient from '../axiosClient';
import API_ENDPOINTS from '../endpoints';

const checkIsDriver = async (): Promise<boolean> => {
  try {
    const role = await AsyncStorage.getItem('@user_role');
    if (role && role.toLowerCase() === 'driver') {
      return true;
    }
    const userDataStr = await AsyncStorage.getItem('@user_data');
    if (userDataStr) {
      const user = JSON.parse(userDataStr);
      if (user?.role && String(user.role).toLowerCase() === 'driver') {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

const getMe = async (): Promise<MeResponse> => {
  return axiosClient.get(API_ENDPOINTS.DRIVER.ME);
};
// New POST service to update the driver's current position
const updateLocation = async (
  payload: LocationUpdatePayload,
): Promise<LocationUpdateResponse> => {
  const isDriverRole = await checkIsDriver();
  if (!isDriverRole) {
    console.log(
      '[driverService] Skipping update-location API: user role is not driver',
    );
    return {
      success: false,
      message: 'Skipped: user role is not driver',
    } as any;
  }
  return axiosClient.post(API_ENDPOINTS.DRIVER.UPDATE_LOCATION, payload);
};

// 1. Service to request delivery OTP code
const sendDeliveryOtp = async (
  shipmentId: string,
): Promise<{ success: boolean; message: string }> => {
  return axiosClient.post(API_ENDPOINTS.DRIVER.SEND_DELIVERY_OTP(shipmentId));
};

// 2. Service to verify OTP code
const verifyDeliveryOtp = async (
  shipmentId: string,
  otp: string,
): Promise<{ success: boolean; message: string }> => {
  return axiosClient.post(
    API_ENDPOINTS.DRIVER.VERIFY_DELIVERY_OTP(shipmentId),
    { otp },
  );
};

// Start trip
const startTrip = async (
  quoteId: string,
): Promise<{ success: boolean; message: string }> => {
  return axiosClient.post(API_ENDPOINTS.DRIVER.START_TRIP, {
    quoteId,
  });
};

const driverService = {
  getMe,
  updateLocation,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  startTrip,
};

export default driverService;
