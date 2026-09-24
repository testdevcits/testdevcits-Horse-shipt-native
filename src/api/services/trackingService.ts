// api/services/trackingService.ts
import axiosClient from '../axiosClient';

export interface DriverDetails {
  _id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  profileImage?: {
    url?: string | null;
    public_id?: string | null;
  };
  image?: string | null;
  avatar?: string;
  driverStatus?: string;
  vehicleNumber?: string;
  lat?: number;
  lng?: number;
  heading?: number;
  updatedAt?: string;
}

export interface TrackingResponse {
  success: boolean;
  tripStatus: string;
  driver?: DriverDetails;
  driverDetails?: DriverDetails;
  pickup?: {
    location?: string;
    lat?: number;
    lng?: number;
    distanceKm?: number;
    etaMinutes?: number;
  };
  delivery?: {
    location?: string;
    lat?: number;
    lng?: number;
    distanceKm?: number;
    etaMinutes?: number;
  };
}

export const getLiveTracking = async (
  shipmentId: string,
): Promise<TrackingResponse> => {
  return axiosClient.get(`/api/tracking/track/${shipmentId}`);
};

