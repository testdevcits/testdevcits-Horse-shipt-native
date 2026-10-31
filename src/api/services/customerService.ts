import axiosClient from '../axiosClient';
import API_ENDPOINTS from '../endpoints';
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
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.PROFILE);
  },

  updateProfile: async (payload: {
    firstName: string;
    lastName: string;
    phone: string;
  }): Promise<CustomerProfileResponse> => {
    return axiosClient.put(API_ENDPOINTS.CUSTOMER.PROFILE_DETAILS, payload);
  },

  updateProfileImage: async (formData: FormData): Promise<any> => {
    return axiosClient.put(API_ENDPOINTS.CUSTOMER.PROFILE_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  /**
   * Fetch active horse colors
   */
  getColors: async (): Promise<{
    success: boolean;
    count?: number;
    data: Array<{
      _id: string;
      name: string;
      isActive?: boolean;
      isOther?: boolean;
    }>;
  }> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.COLORS_ALL);
  },

  /**
   * Fetch all horses belonging to the logged-in customer
   */
  getHorses: async (): Promise<GetHorsesResponse> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.HORSES);
  },

  /**
   * Add a new horse to the customer's profile
   */
  addHorse: async (
    payload: CreateHorsePayload | FormData,
  ): Promise<{ success: boolean; horse: Horse }> => {
    const isFormData =
      typeof FormData !== 'undefined' && payload instanceof FormData;
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.HORSES, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },

  /**
   * Update an existing horse's details
   */
  updateHorse: async (
    horseId: string,
    payload: Partial<CreateHorsePayload> | FormData,
  ): Promise<{ success: boolean; horse: Horse }> => {
    const isFormData =
      typeof FormData !== 'undefined' && payload instanceof FormData;
    return axiosClient.put(
      API_ENDPOINTS.CUSTOMER.HORSE_BY_ID(horseId),
      payload,
      {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      },
    );
  },

  /**
   * Delete a horse from the profile
   */
  deleteHorse: async (
    horseId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return axiosClient.delete(API_ENDPOINTS.CUSTOMER.HORSE_BY_ID(horseId));
  },

  getMyShipments: async (): Promise<GetShipmentsResponse> => {
    // Based on the JSON you provided, the endpoint is:
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.COMPLETED_SHIPMENTS);
  },

  getShipmentById: async (
    shipmentId: string,
  ): Promise<GetShipmentByIdResponse> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.SHIPMENT_BY_ID(shipmentId));
  },

  createShipment: async (payload: FormData) => {
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.SHIPMENTS, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  publishShipment: async (
    shipmentId: string,
  ): Promise<PublishShipmentResponse> => {
    return axiosClient.patch(
      API_ENDPOINTS.CUSTOMER.PUBLISH_SHIPMENT(shipmentId),
    );
  },

  updateShipmentMetadata: async (shipmentId: string, payload: any) => {
    const isFormData =
      typeof FormData !== 'undefined' && payload instanceof FormData;
    return axiosClient.patch(
      API_ENDPOINTS.CUSTOMER.SHIPMENT_METADATA(shipmentId),
      payload,
      {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      },
    );
  },

  updateShipment: async (shipmentId: string, payload: any) => {
    const isFormData =
      typeof FormData !== 'undefined' && payload instanceof FormData;
    return axiosClient.put(
      API_ENDPOINTS.CUSTOMER.SHIPMENT_BY_ID(shipmentId),
      payload,
      {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      },
    );
  },

  deleteShipment: async (
    shipmentId: string,
  ): Promise<{ success: boolean; message?: string }> => {
    return axiosClient.delete(
      API_ENDPOINTS.CUSTOMER.SHIPMENT_BY_ID(shipmentId),
    );
  },

  // ... NOtification System

  getNotifications: async (): Promise<GetNotificationsResponse> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.NOTIFICATIONS_ACTIVITY);
  },

  markAsRead: async (
    notificationIds: string[],
  ): Promise<{ success: boolean }> => {
    return axiosClient.patch(API_ENDPOINTS.CUSTOMER.NOTIFICATIONS_READ, {
      notificationIds,
    });
  },

  deleteNotifications: async (
    notificationIds: string[],
  ): Promise<{ success: boolean }> => {
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.NOTIFICATIONS_DELETE, {
      notificationIds,
    });
  },

  //Chat System
  getChatShippers: async (): Promise<{ success: boolean; data: any[] }> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.CHAT_SHIPPERS);
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
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.CHAT_ROOM, { shipmentId });
  },

  // Fetch Message History
  getChatMessages: async (
    roomId: string,
  ): Promise<{ success: boolean; messages: any[] }> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.CHAT_MESSAGES(roomId));
  },

  // Send New Message (Text or Media)
  sendMessage: async (
    roomId: string,
    payload: FormData | { message: string },
  ): Promise<any> => {
    return axiosClient.post(
      API_ENDPOINTS.CUSTOMER.CHAT_MESSAGES(roomId),
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
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.PAYMENTS);
  },

  //Review apis
  getReceivedReviews: async (): Promise<{ success: boolean; data: any[] }> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.REVIEWS_RECEIVED);
  },

  createReview: async (payload: {
    shipperId: string;
    shipmentId: string;
    rating: number;
    reviewText: string;
  }): Promise<{ success: boolean; message?: string; data?: any }> => {
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.REVIEWS, payload);
  },

  // Dynamic method to update a specific notification setting
  updateNotificationSetting: async (
    key: string,
    value: boolean,
  ): Promise<any> => {
    return axiosClient.put(
      API_ENDPOINTS.CUSTOMER.NOTIFICATIONS_SETTING_BY_KEY(key),
      { value },
    );
  },

  // Fetch current notification settings (assuming an endpoint exists or provided by user/me)
  getNotificationSettings: async (): Promise<any> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.NOTIFICATIONS);
  },

  getTopRatedShippers: async (): Promise<TopRatedShippersResponse> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.TOP_RATED_SHIPPERS);
  },

  getShipperProfile: async (
    id: string,
  ): Promise<{ success: boolean; data: any }> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.SHIPPER_PROFILE_BY_ID(id));
  },

  toggleWishlistShipper: async (
    shipperId: string,
  ): Promise<{ success: boolean; isFavorite?: boolean; message?: string }> => {
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.TOGGLE_WISHLIST(shipperId));
  },

  getWishlist: async (): Promise<{
    success: boolean;
    data: any[];
    shipperIds?: string[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.WISHLIST);
  },

  // in your shipment.service.ts
  inviteShipper: async (
    shipmentId: string,
    shipperId: string,
  ): Promise<any> => {
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.SEND_INVITATION, {
      shipmentId,
      shipperId,
    });
  },

  getShippersReviewById: async (
    id: string,
  ): Promise<{ success: boolean; data: any }> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.SHIPPER_REVIEW_BY_ID(id));
  },

  getTermsAndConditions: async (): Promise<GetTermsConditionsResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.TERMS_CONDITIONS);
  },

  subscribeNotifications: async (
    payload: NotificationSubscriptionPayload,
  ): Promise<NotificationSubscriptionResponse> => {
    return axiosClient.post(
      API_ENDPOINTS.CUSTOMER.NOTIFICATIONS_SUBSCRIBE,
      payload,
    );
  },

  getQuotes: async (
    shipmentId: string,
    page = 1,
    limit = 5,
  ): Promise<GetQuotesResponse> => {
    return axiosClient.get(
      API_ENDPOINTS.CUSTOMER.QUOTES_BY_SHIPMENT(shipmentId, page, limit),
    );
  },

  payQuote: async (quoteId: string): Promise<PayQuoteResponse> => {
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.PAY_QUOTE(quoteId));
  },

  acceptQuote: async (
    quoteId: string,
    payload: { customerSignature: string },
  ): Promise<AcceptQuoteResponse> => {
    return axiosClient.put(
      API_ENDPOINTS.CUSTOMER.ACCEPT_QUOTE(quoteId),
      payload,
    );
  },

  cancelQuote: async (
    quoteId: string,
    payload: CancelQuoteRequest,
  ): Promise<CancelQuoteResponse> => {
    return axiosClient.post(
      API_ENDPOINTS.CUSTOMER.CANCEL_QUOTE(quoteId),
      payload,
    );
  },

  getQuestions: async (shipmentId: string): Promise<GetQuestionsResponse> => {
    return axiosClient.get(API_ENDPOINTS.QUESTIONS.BY_SHIPMENT_ID(shipmentId));
  },

  submitAnswer: async (questionId: string, answer: string): Promise<any> => {
    return axiosClient.post(API_ENDPOINTS.QUESTIONS.ANSWER, {
      questionId,
      answer,
    });
  },

  getMatchingShippers: async (
    shipmentId: string,
  ): Promise<MatchingShippersResponse> => {
    return axiosClient.get(
      API_ENDPOINTS.CUSTOMER.MATCHING_SHIPPERS(shipmentId),
    );
  },
};

export default customerService;
