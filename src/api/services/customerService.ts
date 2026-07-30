import axiosClient from '../axiosClient';
import {
  GetHorsesResponse,
  Horse,
  CreateHorsePayload,
  GetShipmentsResponse,
  TopRatedShippersResponse,
  CustomerProfileResponse,
  GetTermsConditionsResponse,
  NotificationSubscriptionPayload,
  NotificationSubscriptionResponse,
  GetShipmentByIdResponse,
  GetQuotesResponse,
  GetQuestionsResponse,
  MatchingShippersResponse,
  CancelQuoteRequest,
  CancelQuoteResponse,
  PayQuoteResponse,
  AcceptQuoteResponse,
  PublishShipmentResponse,
} from '../../types/customer';
import { GetNotificationsResponse } from '../../types/notification';

/**
 * Customer specific API services
 */
const customerService = {
  getProfile: async (): Promise<CustomerProfileResponse> => {
    return axiosClient.get('/api/customer/profile');
  },

  updateProfile: async (payload: {
    firstName: string;
    lastName: string;
    phone: string;
  }): Promise<CustomerProfileResponse> => {
    return axiosClient.put('/api/customer/profile-details', payload);
  },

  updateProfileImage: async (formData: FormData): Promise<any> => {
    return axiosClient.put('/api/customer/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

  getShipmentById: async (
    shipmentId: string,
  ): Promise<GetShipmentByIdResponse> => {
    return axiosClient.get(`/api/customer/shipments/${shipmentId}`);
  },

  createShipment: async (payload: FormData) => {
    return axiosClient.post('/api/customer/shipments', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  publishShipment: async (shipmentId: string): Promise<PublishShipmentResponse> => {
    return axiosClient.patch(`/api/customer/shipments/${shipmentId}/publish`);
  },

  updateShipmentMetadata: async (shipmentId: string, payload: any) => {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    return axiosClient.patch(`/api/customer/shipments/${shipmentId}/metadata`, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },

  // ... NOtification System

  getNotifications: async (): Promise<GetNotificationsResponse> => {
    return axiosClient.get('/api/customer/notification-activity');
  },

  markAsRead: async (
    notificationIds: string[],
  ): Promise<{ success: boolean }> => {
    return axiosClient.patch('/api/customer/notification-activity/read', {
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
    payload: FormData | { message: string },
  ): Promise<any> => {
    return axiosClient.post(
      `/api/customer/chat/rooms/${roomId}/messages`,
      payload,
      payload instanceof FormData
        ? {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        : undefined,
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

  createReview: async (payload: {
    shipperId: string;
    shipmentId: string;
    rating: number;
    reviewText: string;
  }): Promise<{ success: boolean; message?: string; data?: any }> => {
    return axiosClient.post('/api/customer/reviews', payload);
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
    return axiosClient.get('/api/customer/notifications');
  },

  getTopRatedShippers: async (): Promise<TopRatedShippersResponse> => {
    return axiosClient.get('/api/customer/shippers/top-rated');
  },

  getShipperProfile: async (
    id: string,
  ): Promise<{ success: boolean; data: any }> => {
    return axiosClient.get(`/api/customer/shipper-profile/${id}`);
  },

  // in your shipment.service.ts
  inviteShipper: async (
    shipmentId: string,
    shipperId: string,
  ): Promise<any> => {
    return axiosClient.post(`/api/customer/shipments/send-invitation`, {
      shipmentId,
      shipperId,
    });
  },

  getShippersReviewById: async (
    id: string,
  ): Promise<{ success: boolean; data: any }> => {
    return axiosClient.get(`/api/customer/shipper${id}`);
  },

  getTermsAndConditions: async (): Promise<GetTermsConditionsResponse> => {
    return axiosClient.get('/api/admin/terms-condition/active');
  },

  subscribeNotifications: async (
    payload: NotificationSubscriptionPayload,
  ): Promise<NotificationSubscriptionResponse> => {
    return axiosClient.post('/api/customer/notifications/subscribe', payload);
  },

  getQuotes: async (
    shipmentId: string,
    page = 1,
    limit = 5,
  ): Promise<GetQuotesResponse> => {
    return axiosClient.get(
      `/api/customer/quotes/${shipmentId}?page=${page}&limit=${limit}`,
    );
  },

  payQuote: async (quoteId: string): Promise<PayQuoteResponse> => {
    return axiosClient.post(`/api/customer/quotes/${quoteId}/pay`);
  },

  acceptQuote: async (
    quoteId: string,
    payload: { customerSignature: string },
  ): Promise<AcceptQuoteResponse> => {
    return axiosClient.put(`/api/customer/quotes/${quoteId}/accept`, payload);
  },

  cancelQuote: async (
    quoteId: string,
    payload: CancelQuoteRequest,
  ): Promise<CancelQuoteResponse> => {
    return axiosClient.post(`/api/customer/quotes/${quoteId}/cancel`, payload);
  },

  getQuestions: async (shipmentId: string): Promise<GetQuestionsResponse> => {
    return axiosClient.get(`/api/questions/${shipmentId}`);
  },

  submitAnswer: async (questionId: string, answer: string): Promise<any> => {
    return axiosClient.post('/api/questions/answer', { questionId, answer });
  },

  getMatchingShippers: async (
    shipmentId: string,
  ): Promise<MatchingShippersResponse> => {
    return axiosClient.get(
      `/api/customer/shipments/${shipmentId}/matching-shippers`,
    );
  },
};

export default customerService;
