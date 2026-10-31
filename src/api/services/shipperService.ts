import axiosClient from '../axiosClient';
import API_ENDPOINTS from '../endpoints';

const shipperService = {
  // Get all registered vehicles for the shipper
  getVehicles: async (): Promise<{
    success: boolean;
    message?: string;
    vehicles: any[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.VEHICLES);
  },

  // Add new vehicle (multipart/form-data)
  addVehicle: async (
    formData: FormData,
  ): Promise<{
    success: boolean;
    message?: string;
    vehicle?: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.VEHICLES, formData, {
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
    return axiosClient.put(API_ENDPOINTS.SHIPPER.VEHICLE_BY_ID(id), formData, {
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
    return axiosClient.delete(API_ENDPOINTS.SHIPPER.VEHICLE_BY_ID(id));
  },

  // Assign vehicle to quote (POST /api/shipper/assign-vehicle)
  assignVehicleToQuote: async (payload: {
    quoteId: string;
    vehicleId: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any;
    quote?: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.ASSIGN_VEHICLE, payload);
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
    return axiosClient.get(API_ENDPOINTS.SHIPPER.DRIVERS, { params });
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
    return axiosClient.post(API_ENDPOINTS.SHIPPER.DRIVERS, payload);
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
    return axiosClient.put(API_ENDPOINTS.SHIPPER.DRIVER_BY_ID(id), payload);
  },

  // Delete driver
  deleteDriver: async (
    id: string,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    return axiosClient.delete(API_ENDPOINTS.SHIPPER.DRIVER_BY_ID(id));
  },

  // Toggle driver active/inactive status
  toggleDriverStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    return axiosClient.patch(API_ENDPOINTS.SHIPPER.TOGGLE_DRIVER_STATUS(id), {
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
    vehicle?: any;
    driver?: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.ASSIGN_DRIVER_TO_VEHICLE, {
      vehicleId,
      driverId,
    });
  },

  // Fetch shipper's quotes (/api/shipper/quotes/mq)
  getMyQuotes: async (): Promise<{
    success: boolean;
    message?: string;
    quotes: any[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.MY_QUOTES);
  },

  // Submit a shipping offer / quote (POST /api/shipper/quotes/add)
  addQuote: async (
    formData: FormData,
  ): Promise<{
    success: boolean;
    message?: string;
    quote?: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.ADD_QUOTE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete a shipper quote (/api/shipper/delete/:id)
  deleteQuote: async (
    id: string,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    return axiosClient.delete(API_ENDPOINTS.SHIPPER.DELETE_QUOTE(id));
  },

  // Ask a question about a shipment (POST /api/questions/ask)
  askQuestion: async (data: {
    shipmentId: string;
    question: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.QUESTIONS.ASK, data);
  },

  // Fetch shipment questions (GET /api/questions/:shipmentId)
  getShipmentQuestions: async (
    shipmentId: string,
  ): Promise<{
    success: boolean;
    data?: {
      answered: any[];
      pending: any[];
    };
  }> => {
    return axiosClient.get(API_ENDPOINTS.QUESTIONS.BY_SHIPMENT_ID(shipmentId));
  },

  // get Google review link (Get /api/shipper/reviews/google-link)
  getGoogleReviewLink: async (): Promise<{
    success: boolean;
    message?: string;
    googleReviewLink?: string;
    data?: any;
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.GOOGLE_REVIEW_LINK);
  },

  // Update Google review link (PUT /api/shipper/reviews/google-link)
  updateGoogleReviewLink: async (
    googleReviewLink: string,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return axiosClient.put(API_ENDPOINTS.SHIPPER.GOOGLE_REVIEW_LINK, {
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
    return axiosClient.get(API_ENDPOINTS.SHIPPER.PAYOUT_HISTORY, { params });
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
    return axiosClient.get(API_ENDPOINTS.SHIPPER.AVAILABLE_SHIPMENTS, {
      params,
    });
  },

  // Fetch shipper quote invitations (GET /api/shipper/invitations)
  getInvitations: async (): Promise<{
    success: boolean;
    count?: number;
    data: any[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.INVITATIONS);
  },

  // Fetch chat customer conversations (/api/shipper/chat/customers)
  getChatCustomers: async (): Promise<{
    success: boolean;
    data: any[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.CHAT_CUSTOMERS);
  },

  // Get or create chat room for shipment (/api/shipper/chat/room)
  getOrCreateChatRoom: async (
    shipmentId: string,
  ): Promise<{
    success: boolean;
    roomId: string;
    room: any;
    shipment: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.CHAT_ROOM, { shipmentId });
  },

  // Get chat room messages (/api/shipper/chat/rooms/:roomId/messages)
  getChatRoomMessages: async (
    roomId: string,
  ): Promise<{
    success: boolean;
    messages: any[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.CHAT_MESSAGES(roomId));
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
      return axiosClient.post(
        API_ENDPOINTS.SHIPPER.CHAT_MESSAGES(roomId),
        formDataOrPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    }
    return axiosClient.post(
      API_ENDPOINTS.SHIPPER.CHAT_MESSAGES(roomId),
      formDataOrPayload,
    );
  },

  // Get Stripe Subscription Plan (/api/shipper/stripe/subscription-plan)
  getSubscriptionPlan: async (): Promise<{
    success: boolean;
    data: any;
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.STRIPE.SUBSCRIPTION_PLAN);
  },

  // Get Shipper Profile (/api/shipper/profile)
  getProfile: async (): Promise<{
    success: boolean;
    message?: string;
    data: any;
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.PROFILE);
  },

  // Get Shipper Settings (/api/shipper/settings)
  getSettings: async (): Promise<{
    success: boolean;
    message?: string;
    data: any;
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.SETTINGS);
  },

  // Update Shipper Settings (/api/shipper/settings)
  updateSettings: async (
    settingsData: any,
  ): Promise<{
    success: boolean;
    message?: string;
    data: any;
  }> => {
    return axiosClient.put(API_ENDPOINTS.SHIPPER.SETTINGS, settingsData);
  },

  // Update Notification Settings (/api/shipper/settings/update-notifications)
  updateNotifications: async (
    notifications: any,
  ): Promise<{
    success: boolean;
    message?: string;
    data: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.UPDATE_NOTIFICATIONS, {
      notifications,
    });
  },

  // Fetch Shipper Notification Activity (/api/shipper/notification-activity)
  getNotificationActivity: async (): Promise<{
    success: boolean;
    data: any[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.NOTIFICATION_ACTIVITY);
  },

  // Mark Shipper Notifications as Read (/api/shipper/notification-activity/read)
  markNotificationsRead: async (
    ids: string[],
  ): Promise<{ success: boolean; message?: string }> => {
    return axiosClient.patch(API_ENDPOINTS.SHIPPER.NOTIFICATION_ACTIVITY_READ, {
      notificationIds: ids,
      ids: ids,
    });
  },

  // Delete Shipper Notifications (/api/shipper/notification-activity)
  deleteNotifications: async (
    ids: string[],
  ): Promise<{
    success: boolean;
    message?: string;
    data?: { deletedCount: number };
  }> => {
    return axiosClient.delete(API_ENDPOINTS.SHIPPER.NOTIFICATION_ACTIVITY, {
      data: { ids },
    });
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
    return axiosClient.get(API_ENDPOINTS.SHIPPER.STRIPE.BILLING_HISTORY);
  },

  // Fetch Subscription Status (GET /api/shipper/stripe/subscription/status)
  getSubscriptionStatus: async (): Promise<{
    success: boolean;
    hasSubscription?: boolean;
    status?: string;
    planType?: string;
    hasAccess?: boolean;
    trialActive?: boolean;
    remainingTrialDays?: number;
    trialEnd?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: string;
    isTrialing?: boolean;
    isActive?: boolean;
    isPastDue?: boolean;
    isCanceled?: boolean;
    needsRenewal?: boolean;
    needsSubscription?: boolean;
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.STRIPE.SUBSCRIPTION_STATUS);
  },

  // Create Subscription (POST /api/shipper/stripe/subscription/create)
  createSubscription: async (payload: {
    priceId?: string;
    planType?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    subscriptionId?: string;
    clientSecret?: string;
    status?: string;
    data?: any;
  }> => {
    return axiosClient.post(
      API_ENDPOINTS.SHIPPER.STRIPE.SUBSCRIPTION_CREATE,
      payload,
    );
  },

  // Cancel Subscription (POST /api/shipper/stripe/subscription/cancel)
  cancelSubscription: async (payload: {
    reason: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: {
      plan?: string;
      status?: string;
      cancelAtPeriodEnd?: boolean;
      accessValidTill?: string;
    };
  }> => {
    return axiosClient.post(
      API_ENDPOINTS.SHIPPER.STRIPE.SUBSCRIPTION_CANCEL,
      payload,
    );
  },

  // Fetch Active Privacy Policy (/api/admin/privacy-policy/active)
  getPrivacyPolicy: async (): Promise<{
    success: boolean;
    message?: string;
    count?: number;
    data: any[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.PRIVACY_POLICY);
  },

  // Fetch Active Terms & Conditions (/api/admin/terms-condition/active)
  getTermsAndConditions: async (): Promise<{
    success: boolean;
    message?: string;
    count?: number;
    data: any[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.TERMS_CONDITIONS);
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
    return axiosClient.get(API_ENDPOINTS.SHIPPER.STRIPE.STATUS);
  },

  // Create Stripe Payout Account for Shipper (POST /api/shipper/stripe/create-account)
  createStripeAccount: async (): Promise<{
    success: boolean;
    message?: string;
    stripeAccountId?: string;
    accountLinkUrl?: string;
    url?: string;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.STRIPE.CREATE_ACCOUNT);
  },

  // Get Stripe Onboarding Link for Shipper (POST /api/shipper/stripe/onboarding)
  getStripeOnboarding: async (): Promise<{
    success: boolean;
    message?: string;
    onboardingUrl?: string;
    onBoardingUrl?: string;
    url?: string;
    data?: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.STRIPE.ONBOARDING);
  },

  // Fetch Shipper Payment Card Status (/api/shipper/status)
  getShipperStatus: async (): Promise<{
    success: boolean;
    hasCard?: boolean;
    cardLast4?: string;
    cardBrand?: string;
    cardExpMonth?: number;
    cardExpYear?: number;
    message?: string;
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.STATUS);
  },

  // Create Stripe Customer for Shipper (/api/shipper/create-customer)
  createCustomer: async (): Promise<{
    success: boolean;
    message?: string;
    stripeCustomerId?: string;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.CREATE_CUSTOMER);
  },

  // Get Setup Intent for Shipper (/api/shipper/setup-intent)
  getSetupIntent: async (): Promise<{
    success: boolean;
    clientSecret?: string;
    message?: string;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.SETUP_INTENT);
  },

  // Save Payment Method for Shipper (/api/shipper/save-payment-method)
  savePaymentMethod: async (payload: {
    paymentMethodId: string;
  }): Promise<{
    success: boolean;
    message?: string;
    cardBrand?: string;
    cardLast4?: string;
    cardExpMonth?: number;
    cardExpYear?: number;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.SAVE_PAYMENT_METHOD, payload);
  },

  // Update Banner Image (/api/shipper/update-banner-image)
  updateBannerImage: async (
    formData: FormData,
  ): Promise<{
    success: boolean;
    message?: string;
    bannerImage?: {
      url: string;
      public_id: string;
      _id: string;
    };
  }> => {
    return axiosClient.put(
      API_ENDPOINTS.SHIPPER.UPDATE_BANNER_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [data => data],
      },
    );
  },

  // Update Profile Image (/api/shipper/update-profile-image)
  updateProfileImage: async (
    formData: FormData,
  ): Promise<{
    success: boolean;
    message?: string;
    profileImage?: {
      url: string;
      public_id: string;
      _id: string;
    };
  }> => {
    return axiosClient.put(
      API_ENDPOINTS.SHIPPER.UPDATE_PROFILE_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [data => data],
      },
    );
  },

  // Update Profile Details (PUT /api/shipper/update-profile)
  updateProfile: async (payload: {
    mobile?: string;
    description?: string;
    locale?: {
      address: string;
      latitude: number;
      longitude: number;
    };
  }): Promise<{
    success: boolean;
    message?: string;
    data: any;
  }> => {
    return axiosClient.put(API_ENDPOINTS.SHIPPER.UPDATE_PROFILE, payload);
  },

  // Fetch Preferred Areas
  getPreferredAreas: async (): Promise<{
    success: boolean;
    message?: string;
    data: any[];
  }> => {
    return axiosClient.get(API_ENDPOINTS.SHIPPER.PREFERRED_AREAS);
  },

  // Add Preferred Area
  addPreferredArea: async (payload: {
    locationName: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.PREFERRED_AREAS, payload);
  },

  // Update Preferred Area
  updatePreferredArea: async (
    id: string,
    payload: {
      locationName: string;
      latitude: number;
      longitude: number;
      radiusKm: number;
    },
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return axiosClient.put(
      API_ENDPOINTS.SHIPPER.PREFERRED_AREA_BY_ID(id),
      payload,
    );
  },

  deletePreferredArea: async (
    id: string,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return axiosClient.delete(API_ENDPOINTS.SHIPPER.PREFERRED_AREA_BY_ID(id));
  },

  // Submit Customer Review (POST /api/shipper/customer-reviews)
  submitCustomerReview: async (payload: {
    customerId: string;
    shipmentId: string;
    rating: number;
    reviewText: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return axiosClient.post(API_ENDPOINTS.SHIPPER.CUSTOMER_REVIEWS, payload);
  },
};

export default shipperService;
