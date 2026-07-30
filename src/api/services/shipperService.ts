import axiosClient from '../axiosClient';

const shipperService = {
  // Get all registered vehicles for the shipper
  getVehicles: async (): Promise<{
    success: boolean;
    message?: string;
    vehicles: any[];
  }> => {
    return axiosClient.get('/api/shipper/vehicles');
  },

  // Add new vehicle (multipart/form-data)
  addVehicle: async (
    formData: FormData,
  ): Promise<{
    success: boolean;
    message?: string;
    vehicle?: any;
  }> => {
    return axiosClient.post('/api/shipper/vehicles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update existing vehicle
  updateVehicle: async (
    id: string,
    formData: FormData,
  ): Promise<{
    success: boolean;
    message?: string;
    vehicle?: any;
  }> => {
    return axiosClient.put(`/api/shipper/vehicles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete vehicle
  deleteVehicle: async (
    id: string,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    return axiosClient.delete(`/api/shipper/vehicles/${id}`);
  },

  // Fetch drivers list for shipper
  getDrivers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    drivers?: any[];
    data?: any[];
  }> => {
    return axiosClient.get('/api/shipper/drivers', { params });
  },

  // Add new driver
  addDriver: async (payload: {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    password?: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return axiosClient.post('/api/shipper/drivers', payload);
  },

  // Update driver details
  updateDriver: async (
    id: string,
    payload: {
      name?: string;
      email?: string;
      phone?: string;
      licenseNumber?: string;
      notes?: string;
    },
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return axiosClient.put(`/api/shipper/drivers/${id}`, payload);
  },

  // Delete driver
  deleteDriver: async (
    id: string,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    return axiosClient.delete(`/api/shipper/drivers/${id}`);
  },

  // Toggle driver active/inactive status
  toggleDriverStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    return axiosClient.patch(`/api/shipper/drivers/${id}/status`, {
      isActive,
    });
  },

  // Assign driver to vehicle
  assignDriver: async (
    vehicleId: string,
    driverId: string,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    return axiosClient.patch(`/api/shipper/vehicles/${vehicleId}/driver`, {
      driverId,
    });
  },

  // Fetch shipper's quotes (/api/shipper/quotes/mq)
  getMyQuotes: async (): Promise<{
    success: boolean;
    message?: string;
    quotes: any[];
  }> => {
    return axiosClient.get('/api/shipper/quotes/mq');
  },

  // Update Google review link (PUT /api/shipper/reviews/google-link)
  updateGoogleReviewLink: async (googleReviewLink: string): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return axiosClient.put('/api/shipper/reviews/google-link', {
      googleReviewLink,
    });
  },

  // Fetch payout history (/api/shipper/shipper/payout-history)
  getPayoutHistory: async (params?: {
    limit?: number;
    cursor?: string;
  }): Promise<{
    success: boolean;
    totalTransactions?: number;
    hasMore?: boolean;
    nextCursor?: string;
    transactions: any[];
  }> => {
    return axiosClient.get('/api/shipper/shipper/payout-history', { params });
  },

  // Fetch available shipments for bidding (/api/shipper/shipments/available)
  getAvailableShipments: async (params?: {
    page?: number;
    limit?: number;
    lat?: number;
    lng?: number;
  }): Promise<{
    success: boolean;
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    shipments: any[];
  }> => {
    return axiosClient.get('/api/shipper/shipments/available', { params });
  },

  // Fetch chat customer conversations (/api/shipper/chat/customers)
  getChatCustomers: async (): Promise<{
    success: boolean;
    data: any[];
  }> => {
    return axiosClient.get('/api/shipper/chat/customers');
  },

  // Get or create chat room for shipment (/api/shipper/chat/room)
  getOrCreateChatRoom: async (shipmentId: string): Promise<{
    success: boolean;
    roomId: string;
    room: any;
    shipment: any;
  }> => {
    return axiosClient.post('/api/shipper/chat/room', { shipmentId });
  },

  // Get chat room messages (/api/shipper/chat/rooms/:roomId/messages)
  getChatRoomMessages: async (roomId: string): Promise<{
    success: boolean;
    messages: any[];
  }> => {
    return axiosClient.get(`/api/shipper/chat/rooms/${roomId}/messages`);
  },

  // Send message in chat room
  sendChatMessage: async (
    roomId: string,
    formDataOrPayload: any,
  ): Promise<{
    success: boolean;
    data?: any;
    message?: any;
  }> => {
    if (formDataOrPayload instanceof FormData) {
      return axiosClient.post(`/api/shipper/chat/rooms/${roomId}/messages`, formDataOrPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return axiosClient.post(`/api/shipper/chat/rooms/${roomId}/messages`, formDataOrPayload);
  },

  // Get Stripe Subscription Plan (/api/shipper/stripe/subscription-plan)
  getSubscriptionPlan: async (): Promise<{
    success: boolean;
    data: any;
  }> => {
    return axiosClient.get('/api/shipper/stripe/subscription-plan');
  },

  // Get Shipper Profile (/api/shipper/profile)
  getProfile: async (): Promise<{
    success: boolean;
    message?: string;
    data: any;
  }> => {
    return axiosClient.get('/api/shipper/profile');
  },

  // Get Shipper Settings (/api/shipper/settings)
  getSettings: async (): Promise<{
    success: boolean;
    message?: string;
    data: any;
  }> => {
    return axiosClient.get('/api/shipper/settings');
  },

  // Update Shipper Settings (/api/shipper/settings)
  updateSettings: async (settingsData: any): Promise<{
    success: boolean;
    message?: string;
    data: any;
  }> => {
    return axiosClient.put('/api/shipper/settings', settingsData);
  },

  // Update Notification Settings (/api/shipper/settings/update-notifications)
  updateNotifications: async (notifications: any): Promise<{
    success: boolean;
    message?: string;
    data: any;
  }> => {
    return axiosClient.post('/api/shipper/settings/update-notifications', {
      notifications,
    });
  },

  // Fetch Shipper Notification Activity (/api/shipper/notification-activity)
  getNotificationActivity: async (): Promise<{
    success: boolean;
    data: any[];
  }> => {
    return axiosClient.get('/api/shipper/notification-activity');
  },

  // Fetch Subscription Billing History (/api/shipper/stripe/subscription/billing/history)
  getBillingHistory: async (): Promise<{
    success: boolean;
    data: {
      planType?: string;
      subscriptions?: any[];
      payments?: any[];
      payouts?: any[];
    };
  }> => {
    return axiosClient.get('/api/shipper/stripe/subscription/billing/history');
  },

  // Fetch Active Privacy Policy (/api/admin/privacy-policy/active)
  getPrivacyPolicy: async (): Promise<{
    success: boolean;
    message?: string;
    count?: number;
    data: any[];
  }> => {
    return axiosClient.get('/api/admin/privacy-policy/active');
  },

  // Fetch Stripe Status (/api/shipper/stripe/status)
  getStripeStatus: async (): Promise<{
    success: boolean;
    verified?: boolean;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    onboardingCompleted?: boolean;
    needsVerification?: boolean;
    requirements?: any;
  }> => {
    return axiosClient.get('/api/shipper/stripe/status');
  },

  // Update Banner Image (/api/shipper/update-banner-image)
  updateBannerImage: async (formData: FormData): Promise<{
    success: boolean;
    message?: string;
    bannerImage?: {
      url: string;
      public_id: string;
      _id: string;
    };
  }> => {
    return axiosClient.put('/api/shipper/update-banner-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data],
    });
  },

  // Update Profile Image (/api/shipper/update-profile-image)
  updateProfileImage: async (formData: FormData): Promise<{
    success: boolean;
    message?: string;
    profileImage?: {
      url: string;
      public_id: string;
      _id: string;
    };
  }> => {
    return axiosClient.put('/api/shipper/update-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data],
    });
  },
};

export default shipperService;
