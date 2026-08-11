// api/services/trackingService.ts
import axiosClient from '../axiosClient';

export interface TrackingResponse {
  success: boolean;
  tripStatus: string;
  driver?: {
    lat?: number;
    lng?: number;
    heading?: number;
    updatedAt?: string;
    name?: string;
    phone?: string;
    avatar?: string;
    vehicleNumber?: string;
  };
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

export const getLiveTracking = async (shipmentId: string): Promise<TrackingResponse> => {
  return axiosClient.get(`/api/tracking/track/${shipmentId}`);
};