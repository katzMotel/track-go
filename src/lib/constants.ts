import { ShipmentStatus, Priority } from "@/types/shipment";

export const SHIPMENT_STATUSES: Record<ShipmentStatus, { label: string; color: string }> = {
    pending: { label: 'Pending Pickup', color: '#94a3b8' },
    in_transit: { label: 'In Transit', color: '#3b82f6' },
    out_for_delivery: { label: 'Out for Delivery', color: '#f59e0b' },
    delivered: { label: 'Delivered', color: '#10b981' },
    delayed: { label: 'Delayed', color: '#ef4444' },
  };

export const PRIORITIES: Record<Priority, {label: string;  badge: string }> ={
    standard: {label: 'Standard', badge: 'bg-gray-100 text-gray-800'},
    express: {label: 'Express', badge: 'bg-blue-100 text-blue-800'},
    overnight: {label: 'Overnight', badge: 'bg-purple-100 text-purple-800'},
};
export const MAP_CONFIG = {
    DEFAULT_CENTER: [35.1495, -90.0490] as [number, number], // Memphis
    DEFAULT_ZOOM: 10,
    MIN_ZOOM: 3,
    MAX_ZOOM: 18,
    UPDATE_INTERVAL: 5000, // 5 seconds for real-time updates
  };
  
  export const STORAGE_KEYS = {
    SHIPMENTS: 'shipment-tracker-shipments',
    FILTERS: 'shipment-tracker-filters',
    UI: 'shipment-tracker-ui',
  } as const;
  