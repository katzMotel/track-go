import { createSlice } from '@reduxjs/toolkit';
import type { ShipmentStatus, Priority } from '@/types/shipment';

interface AnalyticsState {
  deliveryRates: {
    onTime: number;
    late: number;
  };
  averageDeliveryTime: number;
  statusCounts: Record<ShipmentStatus, number>;
  priorityCounts: Record<Priority, number>;
  revenueByPriority: Record<Priority, number>;
  totalRevenue: number;
}

const initialState: AnalyticsState = {
  deliveryRates: {
    onTime: 0,
    late: 0,
  },
  averageDeliveryTime: 0,
  statusCounts: {
    pending: 0,
    in_transit: 0,
    out_for_delivery: 0,
    delivered: 0,
    delayed: 0,
  },
  priorityCounts: {
    standard: 0,
    express: 0,
    overnight: 0,
  },
  revenueByPriority: {
    standard: 0,
    express: 0,
    overnight: 0,
  },
  totalRevenue: 0,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateAnalytics: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetAnalytics: () => initialState,
  },
});

export const { updateAnalytics, resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;