export interface HorsePhoto {
  url?: string;
  uri?: string;
  name?: string;
  type?: string;
  public_id?: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
}

export interface HorseDocumentItem {
  url?: string;
  uri?: string;
  name?: string;
  type?: string;
  public_id?: string;
  originalName?: string;
}


export interface HorseDocuments {
  coggins?: HorseDocumentItem;
  healthCertificate?: HorseDocumentItem;
}

export interface Horse {
  _id: string;
  owner?: string;
  registeredName: string;
  barnName: string;
  breed: string;
  otherBreed?: string;
  colour: string;
  age: string;
  sex: string;
  defaultStallSize: string;
  notes?: string;
  photo?: HorsePhoto;
  documents?: HorseDocuments;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface GetHorsesResponse {
  success: boolean;
  horses: Horse[];
}

export interface CreateHorsePayload {
  registeredName: string;
  barnName: string;
  breed: string;
  otherBreed?: string;
  colour: string;
  age: string;
  sex: string;
  defaultStallSize: string;
  notes?: string;
  photo?: any;
  coggins?: any;
  healthCertificate?: any;
}


export interface Shipment {
  _id: string;
  shipmentCode: string;
  quoteId?: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled' | 'open_for_offers' | string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDateRange: {
    start: string;
    end: string;
  };
  deliveryDateRange: {
    start: string;
    end: string;
  };
  numberOfHorses: number;
  totalPrice: number | null;
  isInProgress: boolean;
  isCompleted: boolean;
  publish: boolean;
  shipper: {
    _id: string;
    name: string;
    email: string;
  };
  horses: any[]; // You can further define this if needed
}

export interface GetShipmentsResponse {
  success: boolean;
  count: number;
  shipments: Shipment[];
}



export interface TopRatedShipper {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  reviewText: string;
  region: string;
  googleReviewLink: string | null;
}

export interface TopRatedShippersResponse {
  success: boolean;
  data: TopRatedShipper[];
}



export interface ProfileImage {
  url: string;
  public_id: string;
  _id: string;
}

export interface CustomerProfileData {
  _id: string;
  uniqueId: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  profileImage: ProfileImage;
  isActive: boolean;
  // Mocked for UI based on screenshot
  shipmentCount?: number;
  rating?: number;
}

export interface CustomerProfileResponse {
  success: boolean;
  message: string;
  data: CustomerProfileData;
}


export interface TermsCondition {
  _id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetTermsConditionsResponse {
  success: boolean;
  message: string;
  data: TermsCondition[];
}

export interface NotificationSubscriptionPayload {
  subscription: {
    endpoint: string;
    expirationTime: number | null;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

export interface NotificationSubscriptionResponse {
  success: boolean;
  message: string;
}

export interface GetShipmentByIdResponse {
  success: boolean;
  shipment: Shipment;
}


export interface GetQuotesResponse {
  success: boolean;
  shipmentId: string;
  totalQuotes: number;
  currentPage: number;
  totalPages: number;
  quotes: Quote[];
}

export interface Quote {
  _id: string;
  shipment: string;
  contractId: string;
  totalPrice: number;
  currency: string;
  paymentMethod: string;
  paymentDue: string;
  paymentStatus: string;
  platformFee: number;
  balanceInWallet: number;
  notes: string;
  status: string;
  termsAccepted: boolean;
  contractAccepted: boolean;
  tripStatus: string;
  isTrackingActive: boolean;
  cancellationWindowDays: number;
  cancellationLastDate: string;
  isCancelled: boolean;
  refundAmount: number;
  refundStatus: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  contract: {
    url: string;
    public_id: string;
  };

  shipperContract: {
    url: string;
    public_id: string;
  } | null;

  shipper: {
    _id: string;
    name: string;
    email: string;
  };

  currentLocation: {
    lat: number | null;
    lng: number | null;
    updatedAt: string | null;
  };

  vehicle: any;
  transportType: string | null;
  stallsRequired: number | null;
  stripePaymentIntentId: string | null;
  stripeTransferId: string | null;
  paidAt: string | null;
  paymentReleasedAt: string | null;
  customerSignature: string | null;
  shipperSignature: string;
  contractAcceptedAt: string | null;
  assignedDriver: any;
  tripStartedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancelReason: string;
  expiresAt: string | null;
}

export interface GetQuestionsResponse {
  success: boolean;
  data: {};
}

export interface Question {
  _id: string;
  question: string;
  answer?: string;
  createdAt: string;
  updatedAt: string;
}


export interface MatchingShippersResponse {
  success: boolean;
  count: number;
  shippers: string[];
  invitedShippers: string[];
}

export interface ShipperReviewsResponse {
  success: boolean;
  message: string;
  data: ShipperReviewsData;
}

export interface ShipperReviewsData {
  shipper: Shipper;
  reviews: Review[];
  pagination: Pagination;
}

export interface Shipper {
  _id: string;
  name: string;
  googleReviewLink: string | null;
  locale: Locale;
  profileImage: ProfileImage;
}

export interface Locale {
  address: string;
  latitude: number;
  longitude: number;
}

export interface ProfileImage {
  _id: string;
  url: string;
  public_id: string;
}

export interface Review {
  _id: string;
  customer?: string;
  rating?: number;
  review?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface CancelQuoteRequest {
  reason: string;
}

export interface CancelQuoteResponse {
  success: boolean;
  message: string;
  data: {
    totalAmount: number;
    platformFee: number;
    refundAmount: number;
    refundStatus: string;
  };
}

export interface PayQuoteResponse {
  success: boolean;
  message: string;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface AcceptQuoteResponse {
  success: boolean;
  message: string;
  data: any; // This will be your updated Quote object
}

export interface PublishShipmentResponse {
  success: boolean;
  message: string;
  data?: any; // This will return the updated shipment object with status 'published'
}