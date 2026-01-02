import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
  center: [number, number];
  zoom: number;
  bounds: {
    _northEast: { lat: number; lng: number };
    _southWest: { lat: number; lng: number };
  } | null;
  selectedShipmentId: string | null;
  hoveredShipmentId: string | null;
  showRoutes: boolean;
  showClustering: boolean;
}

const initialState: MapState = {
  center: [39.8283, -98.5795], // Geographic center of US
  zoom: 5,
  bounds: null,
  selectedShipmentId: null,
  hoveredShipmentId: null,
  showRoutes: false,
  showClustering: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload;
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setMapBounds: (state, action: PayloadAction<MapState['bounds']>) => {
      state.bounds = action.payload;
    },
    selectShipment: (state, action: PayloadAction<string | null>) => {
      state.selectedShipmentId = action.payload;
    },
    hoverShipment: (state, action: PayloadAction<string | null>) => {
      state.hoveredShipmentId = action.payload;
    },
    focusOnShipment: (state, action: PayloadAction<{ center: [number, number]; zoom: number }>) => {
      state.center = action.payload.center;
      state.zoom = action.payload.zoom;
    },
    toggleRoutes: (state) => {
      state.showRoutes = !state.showRoutes;
    },
    toggleClustering: (state) => {
      state.showClustering = !state.showClustering;
    },
    // NEW: Restore map state from localStorage
    restoreMap: (state, action: PayloadAction<Partial<MapState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setMapCenter,
  setMapZoom,
  setMapBounds,
  selectShipment,
  hoverShipment,
  focusOnShipment,
  toggleRoutes,
  toggleClustering,
  restoreMap,
} = mapSlice.actions;

export default mapSlice.reducer;