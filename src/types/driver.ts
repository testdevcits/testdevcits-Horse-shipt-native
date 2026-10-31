// src/types/driver.ts

export type PaymentStatus = 'paid' | 'unpaid' | 'pending' | 'refunded' | string;
export type TripStatus =
  | 'completed'
  | 'inTransit'
  | 'loading'
  | 'delivered'
  | 'accepted'
  | 'cancelled'
  | string;
export type ShipmentStatus =
  | 'accepted'
  | 'pending'
  | 'rejected'
  | 'cancelled'
  | string;
export type TransportType = 'Trucking' | 'Air' | 'Sea' | string;
export type StallSize = '1/2 Box' | 'Full Box' | '1.5 Box' | string;
export type HorseSex = 'Mare' | 'Stallion' | 'Gelding' | string;

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface CloudinaryAsset {
  url: string | null;
  public_id: string | null;
}

export interface HorseDocumentItem {
  url: string | null;
  public_id: string | null;
}

export interface HorseDocuments {
  coggins: HorseDocumentItem;
  healthCertificate: HorseDocumentItem;
  other: HorseDocumentItem;
}

export interface HorseNoteLogEntry {
  note: string;
  user: string;
  userRole: 'customer' | 'driver' | 'admin' | string;
  userName: string;
  createdAt: string;
}

export interface Horse {
  photo: CloudinaryAsset;
  documents: HorseDocuments;
  registeredName: string;
  barnName: string;
  breed: string;
  otherBreed?: string;
  sex: HorseSex;
  colour: string;
  age: number;
  requestedStallSize: StallSize;
  generalInfo: string;
  notes: string;
  notesLog: HorseNoteLogEntry[];
}

export interface ShipmentLocationPoint extends GeoCoordinates {
  _id?: string;
  updatedAt?: string;
}

export interface InnerShipment {
  _id: string;
  pickupCoords: GeoCoordinates;
  deliveryCoords: GeoCoordinates;
  pickupLocation: string;
  deliveryLocation: string;
  numberOfHorses: number;
  horses: Horse[];
  currentLocation?: ShipmentLocationPoint;
  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
}

export interface VehicleSummary {
  _id: string;
  transportType: TransportType;
  vehicleType: string;
  vehicleNumber: string;
}

export interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  role: 'driver' | string;
  profileImage: CloudinaryAsset;
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
    profileImage: CloudinaryAsset;
    driverStatus: string;
  };
  driverStatus: 'BUSY' | 'IDLE' | string;
  currentShipment: string;
  transportType: TransportType;
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

export interface ShipmentDetails extends InnerShipment {}

export interface DriverShipmentItem {
  _id: string;
  shipment: InnerShipment;
  vehicle: VehicleSummary;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  transportType: TransportType;
  stallsRequired: number;
  notes?: string;
  status: ShipmentStatus;
  tripStatus: TripStatus;
}

export type ActiveShipment = DriverShipmentItem;
export type CompletedShipment = DriverShipmentItem;

export interface MeResponse {
  success: boolean;
  driver: Driver;
  vehicle: Vehicle;
  shipment: ActiveShipment;
  allShipments: DriverShipmentItem[];
}

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
