export const API_ENDPOINTS = {
  // Authentication & Authorization
  AUTH: {
    LOGIN_DRIVER: '/api/driver/driver/login',
    LOGIN: '/api/auth/login',
    GOOGLE_LOGIN: '/api/auth/firebase/google',
    SIGNUP: '/api/auth/signup',
    VERIFY_SIGNUP_OTP: '/api/auth/signup/verify-otp',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_RESET_OTP: '/api/auth/verify-reset-otp',
    RESET_PASSWORD: '/api/auth/reset-password',
  },

  // Admin & General Common Endpoints
  ADMIN: {
    COLORS_ALL: '/api/admin/colors/all',
    TERMS_CONDITIONS: '/api/admin/terms-condition/active',
    PRIVACY_POLICY: '/api/admin/privacy-policy/active',
  },

  // Customer Endpoints
  CUSTOMER: {
    PROFILE: '/api/customer/profile',
    PROFILE_DETAILS: '/api/customer/profile-details',
    PROFILE_IMAGE: '/api/customer/profile-image',
    HORSES: '/api/customer/horses',
    HORSE_BY_ID: (id: string) => `/api/customer/horses/${id}`,
    COMPLETED_SHIPMENTS: '/api/customer/shipments/completed',
    SHIPMENTS: '/api/customer/shipments',
    SHIPMENT_BY_ID: (id: string) => `/api/customer/shipments/${id}`,
    PUBLISH_SHIPMENT: (id: string) => `/api/customer/shipments/${id}/publish`,
    SHIPMENT_METADATA: (id: string) => `/api/customer/shipments/${id}/metadata`,
    MATCHING_SHIPPERS: (id: string) =>
      `/api/customer/shipments/${id}/matching-shippers`,
    SEND_INVITATION: '/api/customer/shipments/send-invitation',
    NOTIFICATIONS_ACTIVITY: '/api/customer/notification-activity',
    NOTIFICATIONS_READ: '/api/customer/notification-activity/read',
    NOTIFICATIONS_DELETE: '/api/customer/notifications/delete',
    NOTIFICATIONS: '/api/customer/notifications',
    NOTIFICATIONS_SETTING_BY_KEY: (key: string) =>
      `/api/customer/notifications/${key}`,
    NOTIFICATIONS_SUBSCRIBE: '/api/customer/notifications/subscribe',
    CHAT_SHIPPERS: '/api/customer/chat/shippers',
    CHAT_ROOM: '/api/customer/chat/room',
    CHAT_MESSAGES: (roomId: string) =>
      `/api/customer/chat/rooms/${roomId}/messages`,
    PAYMENTS: '/api/customer/payments',
    REVIEWS_RECEIVED: '/api/customer/reviews/received',
    REVIEWS: '/api/customer/reviews',
    TOP_RATED_SHIPPERS: '/api/customer/shippers/top-rated',
    SHIPPER_PROFILE_BY_ID: (id: string) =>
      `/api/customer/shipper-profile/${id}`,
    SHIPPER_REVIEW_BY_ID: (id: string) => `/api/customer/shipper${id}`,
    WISHLIST: '/api/customer/wishlist',
    TOGGLE_WISHLIST: (shipperId: string) =>
      `/api/customer/wishlist/${shipperId}/toggle`,
    QUOTES_BY_SHIPMENT: (shipmentId: string, page = 1, limit = 5) =>
      `/api/customer/quotes/${shipmentId}?page=${page}&limit=${limit}`,
    PAY_QUOTE: (quoteId: string) => `/api/customer/quotes/${quoteId}/pay`,
    ACCEPT_QUOTE: (quoteId: string) => `/api/customer/quotes/${quoteId}/accept`,
    CANCEL_QUOTE: (quoteId: string) => `/api/customer/quotes/${quoteId}/cancel`,
  },

  // Questions & Answers
  QUESTIONS: {
    ASK: '/api/questions/ask',
    BY_SHIPMENT_ID: (shipmentId: string) => `/api/questions/${shipmentId}`,
    ANSWER: '/api/questions/answer',
  },

  // Shipper Endpoints
  SHIPPER: {
    VEHICLES: '/api/shipper/vehicles',
    VEHICLE_BY_ID: (id: string) => `/api/shipper/vehicles/${id}`,
    ASSIGN_VEHICLE: '/api/shipper/assign-vehicle',
    ASSIGN_DRIVER_TO_VEHICLE: '/api/shipper/vehicles/assign-driver',
    DRIVERS: '/api/shipper/drivers',
    DRIVER_BY_ID: (id: string) => `/api/shipper/drivers/${id}`,
    TOGGLE_DRIVER_STATUS: (id: string) =>
      `/api/shipper/drivers/${id}/toggle-status`,
    MY_QUOTES: '/api/shipper/quotes/mq',
    ADD_QUOTE: '/api/shipper/quotes/add',
    DELETE_QUOTE: (id: string) => `/api/shipper/delete/${id}`,
    GOOGLE_REVIEW_LINK: '/api/shipper/reviews/google-link',
    PAYOUT_HISTORY: '/api/shipper/shipper/payout-history',
    AVAILABLE_SHIPMENTS: '/api/shipper/shipments/available',
    INVITATIONS: '/api/shipper/invitations',
    CHAT_CUSTOMERS: '/api/shipper/chat/customers',
    CHAT_ROOM: '/api/shipper/chat/room',
    CHAT_MESSAGES: (roomId: string) =>
      `/api/shipper/chat/rooms/${roomId}/messages`,
    PROFILE: '/api/shipper/profile',
    UPDATE_PROFILE: '/api/shipper/update-profile',
    UPDATE_BANNER_IMAGE: '/api/shipper/update-banner-image',
    UPDATE_PROFILE_IMAGE: '/api/shipper/update-profile-image',
    SETTINGS: '/api/shipper/settings',
    UPDATE_NOTIFICATIONS: '/api/shipper/settings/update-notifications',
    NOTIFICATION_ACTIVITY: '/api/shipper/notification-activity',
    NOTIFICATION_ACTIVITY_READ: '/api/shipper/notification-activity/read',
    STATUS: '/api/shipper/status',
    CREATE_CUSTOMER: '/api/shipper/create-customer',
    SETUP_INTENT: '/api/shipper/setup-intent',
    SAVE_PAYMENT_METHOD: '/api/shipper/save-payment-method',
    PREFERRED_AREAS: '/api/shipper/preferred-areas',
    PREFERRED_AREA_BY_ID: (id: string) => `/api/shipper/preferred-areas/${id}`,
    CUSTOMER_REVIEWS: '/api/shipper/customer-reviews',
    STRIPE: {
      SUBSCRIPTION_PLAN: '/api/shipper/stripe/subscription-plan',
      BILLING_HISTORY: '/api/shipper/stripe/subscription/billing/history',
      SUBSCRIPTION_STATUS: '/api/shipper/stripe/subscription/status',
      SUBSCRIPTION_CREATE: '/api/shipper/stripe/subscription/create',
      SUBSCRIPTION_CANCEL: '/api/shipper/stripe/subscription/cancel',
      STATUS: '/api/shipper/stripe/status',
      CREATE_ACCOUNT: '/api/shipper/stripe/create-account',
      ONBOARDING: '/api/shipper/stripe/onboarding',
    },
  },

  // Driver Endpoints
  DRIVER: {
    ME: '/api/driver/driver/me',
    UPDATE_LOCATION: '/api/shipper/driver/update-location',
    SEND_DELIVERY_OTP: (shipmentId: string) =>
      `/api/driver/driver/shipment/${shipmentId}/send-delivery-otp`,
    VERIFY_DELIVERY_OTP: (shipmentId: string) =>
      `/api/driver/driver/shipment/${shipmentId}/verify-delivery-otp`,
    START_TRIP: '/api/shipper/driver/start-trip',
  },

  // Tracking Endpoints
  TRACKING: {
    LIVE_TRACKING: (shipmentId: string) => `/api/tracking/track/${shipmentId}`,
  },
};

export default API_ENDPOINTS;
