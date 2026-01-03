'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setMapBounds } from '@/store/slices/mapSlice';
import L from 'leaflet';

export default function MapController() {
  const map = useMap();
  const dispatch = useAppDispatch();
  const { center, zoom } = useAppSelector(state => state.map);

  // Add zoom control to top-right
  useEffect(() => {
    const zoomControl = L.control.zoom({ position: 'topright' });
    map.addControl(zoomControl);

    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);

  // Sync Redux state to Leaflet map
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);

  // Sync Leaflet map events to Redux
  useEffect(() => {
    const updateBounds = () => {
      const bounds = map.getBounds();
      const serializableBounds = {
        _northEast: { 
          lat: bounds.getNorthEast().lat, 
          lng: bounds.getNorthEast().lng 
        },
        _southWest: { 
          lat: bounds.getSouthWest().lat, 
          lng: bounds.getSouthWest().lng 
        },
      };
      dispatch(setMapBounds(serializableBounds));
    };

    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);

    return () => {
      map.off('moveend', updateBounds);
      map.off('zoomend', updateBounds);
    };
  }, [map, dispatch]);

  return null;
}