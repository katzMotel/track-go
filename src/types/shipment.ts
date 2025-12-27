export type ShipmentStatus = 
  | 'pending' 
  | 'in_transit' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'delayed';

export type Priority = 'standard' | 'express' | 'overnight';

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface StatusHistoryEntry {
  status: ShipmentStatus;
  timestamp: Date;
  location: string;
  note?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  priority: Priority;
  origin: Location;
  destination: Location;
  currentLocation: Location;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  package: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    description: string;
  };
  statusHistory: StatusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: 'delay' | 'delivered' | 'out_for_delivery' | 'exception';
  shipmentId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}