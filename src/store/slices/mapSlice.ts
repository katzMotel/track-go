import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAP_CONFIG } from "@/lib/constants";
import type { LatLngBounds } from "leaflet";

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
    clusteringEnabled: boolean;
    followingShipment: string | null; // Auto-follow a shipment as it moves
  }
  
  const initialState: MapState = {
    center: MAP_CONFIG.DEFAULT_CENTER,
    zoom: MAP_CONFIG.DEFAULT_ZOOM,
    bounds: null,
    selectedShipmentId: null,
    hoveredShipmentId: null,
    showRoutes: false,
    clusteringEnabled: true,
    followingShipment: null,
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
        setMapView: (state, action: PayloadAction<{ center: [number, number]; zoom: number}>) => {
            state.center = action.payload.center;
            state.zoom = action.payload.zoom;
        },
        setMapBounds: (state, action: PayloadAction<{
            _northEast: { lat: number; lng: number };
            _southWest: { lat: number; lng: number };
          }>) => {
            state.bounds = action.payload;
          },
          
        selectShipment: (state, action: PayloadAction<string | null>) =>{
            state.selectedShipmentId = action.payload;
        },
        hoverShipment: (state, action: PayloadAction<string | null>) => {
            state.hoveredShipmentId = action.payload;
        },
        toggleRoutes: (state) => {
            state.showRoutes = !state.showRoutes;
        },
        setShowRoutes: (state, action: PayloadAction<boolean>) => {
            state.showRoutes = action.payload;
        },
        toggleClustering: (state) => {
            state.clusteringEnabled = ! state.clusteringEnabled;
        },
        setClustering: (state, action: PayloadAction<boolean>) => {
            state.clusteringEnabled = action.payload;
        },
        followShipment: (state, action: PayloadAction<string | null>) => {
            state.followingShipment = action.payload;
        },
        focusOnShipment: (state, action: PayloadAction<{center: [number,number]; zoom?:number }>) => {
            state.center = action.payload.center;
            state.zoom = action.payload.zoom || 12;
        },
        resetMapView: (state) => {
            state.center = MAP_CONFIG.DEFAULT_CENTER;
            state.zoom = MAP_CONFIG.DEFAULT_ZOOM;
            state.selectedShipmentId = null;
            state.followingShipment = null;
        },
    },
  });
  export const {
    setMapCenter,
    setMapView,
    setMapZoom,
    setMapBounds,
    selectShipment,
    hoverShipment,
    toggleRoutes,
    setShowRoutes,
    toggleClustering,
    setClustering,
    followShipment,
    focusOnShipment,
    resetMapView,
 } = mapSlice.actions;

 export default mapSlice.reducer;