export interface Horse {
  _id: string;
  owner: string;
  registeredName: string;
  barnName: string;
  breed: string;
  otherBreed: string;
  colour: string;
  age: string;
  sex: string;
  defaultStallSize: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetHorsesResponse {
  success: boolean;
  horses: Horse[];
}

export interface CreateHorsePayload {
  registeredName: string;
  barnName: string;
  breed: string;
  colour: string;
  age: string;
  sex: string;
  defaultStallSize: string;
  notes?: string;
}


export interface Shipment {
  _id: string;
  shipmentCode: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled';
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


export interface CustomerProfileResponse {
  success: boolean;
  message: string;
  data: {
    uniqueId: string;
    name: string;
    email: string;
    role: 'customer';
    firstName: string;
    lastName: string;
    locale: string;
    emailVerified: boolean;
    phone: string;
    phoneVerified: boolean;
    currentLocation: null;
    isLogin: boolean;
    profileImage: string;
    bannerImage: string;
  };
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