import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Shipment } from '@/types/shipment';
import { generateMockShipments } from '@/utils/mockData';

interface ShipmentsState {
  shipments: Record<string, Shipment>; // Normalized by ID
  ids: string[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

const initialState: ShipmentsState = {
  shipments: {},
  ids: [],
  loading: false,
  error: null,
  lastUpdated: Date.now(),
};

// Async thunk to fetch/generate initial shipments
export const fetchShipments = createAsyncThunk(
  'shipments/fetchShipments',
  async () => {
    // In a real app, this would be an API call
    // For now, generate mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return generateMockShipments(50); // Generate 50 shipments
  }
);

const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    addShipment: (state, action: PayloadAction<Shipment>) => {
      const shipment = action.payload;
      state.shipments[shipment.id] = shipment;
      state.ids.push(shipment.id);
      state.lastUpdated = Date.now();
    },
    
    updateShipment: (state, action: PayloadAction<Partial<Shipment> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      if (state.shipments[id]) {
        state.shipments[id] = {
          ...state.shipments[id],
          ...updates,
          updatedAt: new Date(),
        };
        state.lastUpdated = Date.now();
      }
    },
    
    updateShipmentLocation: (state, action: PayloadAction<{ id: string; location: Shipment['currentLocation'] }>) => {
      const { id, location } = action.payload;
      if (state.shipments[id]) {
        state.shipments[id].currentLocation = location;
        state.shipments[id].updatedAt = new Date();
        state.lastUpdated = Date.now();
      }
    },
    
    deleteShipment: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.shipments[id];
      state.ids = state.ids.filter(shipmentId => shipmentId !== id);
      state.lastUpdated = Date.now();
    },
    
    bulkUpdateShipments: (state, action: PayloadAction<Array<Partial<Shipment> & { id: string }>>) => {
      action.payload.forEach(update => {
        const { id, ...updates } = update;
        if (state.shipments[id]) {
          state.shipments[id] = {
            ...state.shipments[id],
            ...updates,
            updatedAt: new Date(),
          };
        }
      });
      state.lastUpdated = Date.now();
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        // Normalize the data
        action.payload.forEach(shipment => {
          state.shipments[shipment.id] = shipment;
          state.ids.push(shipment.id);
        });
        state.lastUpdated = Date.now();
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shipments';
      });
  },
});

export const {
  addShipment,
  updateShipment,
  updateShipmentLocation,
  deleteShipment,
  bulkUpdateShipments,
} = shipmentsSlice.actions;

export default shipmentsSlice.reducer;