import axiosClient from '../axiosClient';
import {
  GetHorsesResponse,
  Horse,
  CreateHorsePayload,
  GetShipmentsResponse,
  TopRatedShippersResponse,
  CustomerProfileResponse,
} from '../../types/customer';
import { GetNotificationsResponse } from '../../types/notification';

/**
 * Customer specific API services
 */
const customerService = {
  getProfile: async (): Promise<CustomerProfileResponse> => {
    return axiosClient.get('/api/customer/profile');
  },
  /**
   * Fetch all horses belonging to the logged-in customer
   */
  getHorses: async (): Promise<GetHorsesResponse> => {
    return axiosClient.get('/api/customer/horses');
  },

  /**
   * Add a new horse to the customer's profile
   */
  addHorse: async (
    payload: CreateHorsePayload,
  ): Promise<{ success: boolean; horse: Horse }> => {
    return axiosClient.post('/api/customer/horses', payload);
  },

  /**
   * Update an existing horse's details
   */
  updateHorse: async (
    horseId: string,
    payload: Partial<CreateHorsePayload>,
  ): Promise<{ success: boolean; horse: Horse }> => {
    return axiosClient.put(`/api/customer/horses/${horseId}`, payload);
  },

  /**
   * Delete a horse from the profile
   */
  deleteHorse: async (
    horseId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return axiosClient.delete(`/api/customer/horses/${horseId}`);
  },

  getMyShipments: async (): Promise<GetShipmentsResponse> => {
    // Based on the JSON you provided, the endpoint is:
    return axiosClient.get('/api/customer/shipments/completed');
  },

  // createShipment :async () :

  // ... NOtification System

  getNotifications: async (): Promise<GetNotificationsResponse> => {
    return axiosClient.get('/api/customer/notification-activity');
  },

  markAsRead: async (
    notificationIds: string[],
  ): Promise<{ success: boolean }> => {
    return axiosClient.post('/api/customer/notifications/mark-read', {
      notificationIds,
    });
  },

  deleteNotifications: async (
    notificationIds: string[],
  ): Promise<{ success: boolean }> => {
    return axiosClient.post('/api/customer/notifications/delete', {
      notificationIds,
    });
  },

  //Chat System
  getChatShippers: async (): Promise<{ success: boolean; data: any[] }> => {
    return axiosClient.get('/api/customer/chat/shippers');
  },

  // Get or Create Room by Shipment ID
  getChatRoom: async (
    shipmentId: string,
  ): Promise<{
    success: boolean;
    room: any;
    roomId: string;
    shipment: any;
  }> => {
    return axiosClient.post('/api/customer/chat/room', { shipmentId });
  },

  // Fetch Message History
  getChatMessages: async (
    roomId: string,
  ): Promise<{ success: boolean; messages: any[] }> => {
    return axiosClient.get(`/api/customer/chat/rooms/${roomId}/messages`);
  },

  // Send New Message (Text or Media)
  sendMessage: async (
    roomId: string,
    payload: { message?: string; media?: any[] },
  ): Promise<any> => {
    return axiosClient.post(
      `/api/customer/chat/rooms/${roomId}/messages`,
      payload,
    );
  },

  //payment apis
  getPayments: async (): Promise<{
    success: boolean;
    payments: any[];
    total: number;
  }> => {
    return axiosClient.get('/api/customer/payments');
  },

  //Review apis
  getReceivedReviews: async (): Promise<{ success: boolean; data: any[] }> => {
    return axiosClient.get('/api/customer/reviews/received');
  },

  // Dynamic method to update a specific notification setting
  updateNotificationSetting: async (
    key: string,
    value: boolean,
  ): Promise<any> => {
    return axiosClient.put(`/api/customer/notifications/${key}`, { value });
  },

  // Fetch current notification settings (assuming an endpoint exists or provided by user/me)
  getNotificationSettings: async (): Promise<any> => {
    return axiosClient.get('/api/customer/notifications/settings');
  },

  getTopRatedShippers: async (): Promise<TopRatedShippersResponse> => {
    return axiosClient.get('/api/customer/shippers/top-rated');
  },

  createShipment: async () => {
    return axiosClient.post('/api/customer/shipments');
  },
};

export default customerService;
