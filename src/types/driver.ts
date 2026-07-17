// src/types/driver.ts

export interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  role: 'driver' | string;
  profileImage: {
    url: string | null;
    public_id: string | null;
  };
  assignedVehicles: string[];
  driverStatus: 'onTrip' | 'idle' | string;
  isActive: boolean;
}

export interface Vehicle {
  _id: string;
  driver: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    role: string;
    profileImage: {
      url: string | null;
      public_id: string | null;
    };
    driverStatus: string;
  };
  driverStatus: 'BUSY' | 'IDLE' | string;
  currentShipment: string;
  transportType: string;
  vehicleType: string;
  vehicleNumber: string;
  trailerType: string;
  numberOfStalls: number;
  stallSize: string;
  images: {
    public_id: string;
    url: string;
    _id: string;
  }[];
  notes: string;
}

export interface Horse {
  photo: {
    url: string | null;
    public_id: string | null;
  };
  documents: {
    coggins: { url: string | null; public_id: string | null };
    healthCertificate: { url: string | null; public_id: string | null };
    other: { url: string | null; public_id: string | null };
  };
  registeredName: string;
  barnName: string;
  breed: string;
  otherBreed: string;
  sex: string;
  colour: string;
  age: number;
  requestedStallSize: string;
  generalInfo: string;
  notes: string;
  notesLog: {
    note: string;
    user: string;
    userRole: string;
    userName: string;
    createdAt: string;
  }[];
}

export interface ShipmentDetails {
  pickupCoords: {
    latitude: number;
    longitude: number;
  };
  deliveryCoords: {
    latitude: number;
    longitude: number;
  };
  _id: string;
  pickupLocation: string;
  deliveryLocation: string;
  numberOfHorses: number;
  horses: Horse[];
  currentLocation: {
    latitude: number;
    longitude: number;
    _id: string;
    updatedAt: string;
  };
  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
}

export interface ActiveShipment {
  _id: string;
  shipment: ShipmentDetails;
  vehicle: {
    _id: string;
    transportType: string;
    vehicleType: string;
    vehicleNumber: string;
  };
  totalPrice: number;
  paymentStatus: 'paid' | 'unpaid' | string;
  transportType: string;
  stallsRequired: number;
  notes: string;
  status: 'accepted' | 'pending' | string;
  tripStatus: 'inTransit' | 'loading' | string;
}

export interface MeResponse {
  success: boolean;
  driver: Driver;
  vehicle: Vehicle;
  shipment: ActiveShipment;
  allShipments: ActiveShipment[];
}


// src/types/driver.ts

export interface LocationUpdatePayload {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
}

export interface LocationUpdateResponse {
  success: boolean;
  message: string;
  location: {
    lat: number;
    lng: number;
    coordinates: {
      type: 'Point';
      coordinates: [number, number]; // [lng, lat]
    };
    speed: number;
    heading: number;
    updatedAt: string;
  };
  tripActive: boolean;
}