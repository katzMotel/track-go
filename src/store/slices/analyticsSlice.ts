import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ShipmentStatus } from '@/types/shipment';

interface AnalyticsState {
  totalShipments: number;
  statusCounts: Record<ShipmentStatus, number>;
  averageDeliveryTime: number; // hours
  onTimeDeliveryRate: number; // percentage
  delayedShipments: number;
  revenueByPriority: {
    standard: number;
    express: number;
    overnight: number;
  };
  shipmentsPerDay: Array<{ date: string; count: number }>;
  topDestinations: Array<{ city: string; count: number }>;
  lastCalculated: number;
}

const initialState: AnalyticsState = {
  totalShipments: 0,
  statusCounts: {
    pending: 0,
    in_transit: 0,
    out_for_delivery: 0,
    delivered: 0,
    delayed: 0,
  },
  averageDeliveryTime: 0,
  onTimeDeliveryRate: 0,
  delayedShipments: 0,
  revenueByPriority: {
    standard: 0,
    express: 0,
    overnight: 0,
  },
  shipmentsPerDay: [],
  topDestinations: [],
  lastCalculated: Date.now(),
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateAnalytics: (state, action: PayloadAction<Partial<AnalyticsState>>) => {
      Object.assign(state, action.payload);
      state.lastCalculated = Date.now();
    },

    incrementStatusCount: (state, action: PayloadAction<ShipmentStatus>) => {
      state.statusCounts[action.payload]++;
      state.totalShipments++;
    },

    decrementStatusCount: (state, action: PayloadAction<ShipmentStatus>) => {
      state.statusCounts[action.payload]--;
      state.totalShipments--;
    },

    updateStatusCount: (
      state,
      action: PayloadAction<{ oldStatus: ShipmentStatus; newStatus: ShipmentStatus }>
    ) => {
      state.statusCounts[action.payload.oldStatus]--;
      state.statusCounts[action.payload.newStatus]++;
    },

    setAverageDeliveryTime: (state, action: PayloadAction<number>) => {
      state.averageDeliveryTime = action.payload;
    },

    setOnTimeDeliveryRate: (state, action: PayloadAction<number>) => {
      state.onTimeDeliveryRate = action.payload;
    },

    setShipmentsPerDay: (state, action: PayloadAction<Array<{ date: string; count: number }>>) => {
      state.shipmentsPerDay = action.payload;
    },

    setTopDestinations: (state, action: PayloadAction<Array<{ city: string; count: number }>>) => {
      state.topDestinations = action.payload;
    },

    resetAnalytics: () => initialState,
  },
});

export const {
  updateAnalytics,
  incrementStatusCount,
  decrementStatusCount,
  updateStatusCount,
  setAverageDeliveryTime,
  setOnTimeDeliveryRate,
  setShipmentsPerDay,
  setTopDestinations,
  resetAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;