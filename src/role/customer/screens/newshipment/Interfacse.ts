export interface ShipmentDetailsResponse {
  success: boolean;
  shipment: Shipment;
}

export interface Shipment {
  _id: string;
  customer: string;
  shipper: string | null;

  publish: boolean;
  publishedAt: string | null;

  status: string;

  pickupLocation: string;
  pickupCoords: PickupCoords;
  pickupTimeOption: string;
  pickupDateRange: PickupDateRange;

  deliveryLocation: string;
  deliveryCoords: DeliveryCoords;
  deliveryTimeOption: string;
  deliveryDateRange: DeliveryDateRange;

  numberOfHorses: number;
  horses: Horse[];

  additionalInfo: string;
  additionalInfoLog: AdditionalInfoLog[];

  currentLocation: CurrentLocation;
  locationHistory: LocationHistory[];

  deliveryOtp: string | null;
  deliveryOtpExpires: string | null;
  deliveryOtpVerified: boolean;
  deliveredAt: string | null;

  recipientEmail: string;
  recipientUser: string | null;
  recipientInviteSent: boolean;
  inviteToken: string | null;
  inviteTokenExpiry: string | null;

  shipmentCode: string;

  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PickupCoords {
  latitude: number;
  longitude: number;
}

export interface DeliveryCoords {
  latitude: number;
  longitude: number;
}

export interface PickupDateRange {
  start: string;
  end: string;
}

export interface DeliveryDateRange {
  start: string;
  end: string;
}

export interface Horse {
  registeredName: string;
  barnName: string;
  breed: string;
  otherBreed: string;
  sex: string;
  colour: string;
  age: number;
  requestedStallSize: string;

  photo: Photo;

  documents: Documents;

  generalInfo: string;
  notes: string;
  notesLog: NotesLog[];
}

export interface Photo {
  url: string;
  public_id: string;
}

export interface Documents {
  coggins: Coggins;
  healthCertificate: HealthCertificate;
  other: OtherDocument;
}

export interface Coggins {
  url: string;
  public_id: string;
}

export interface HealthCertificate {
  url: string;
  public_id: string;
}

export interface OtherDocument {
  url: string;
  public_id: string;
}

export interface NotesLog {
  note: string;
  user: string;
  userRole: string;
  userName: string;
  createdAt: string;
}

export interface AdditionalInfoLog {
  note?: string;
  user?: string;
  userRole?: string;
  userName?: string;
  createdAt?: string;
}

export interface CurrentLocation {
  _id: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export interface LocationHistory {
  _id?: string;
  latitude?: number;
  longitude?: number;
  updatedAt?: string;
}