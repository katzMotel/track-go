'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setMapBounds } from '@/store/slices/mapSlice';

export default function MapController() {
  const map = useMap();
  const dispatch = useAppDispatch();
  const { center, zoom } = useAppSelector(state => state.map);

  // Update map view when Redux state changes
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);

  // Track map bounds for filtering visible shipments
  useEffect(() => {
    const updateBounds = () => {
      const bounds = map.getBounds();
      
      // Convert to serializable plain object
      const serializableBounds = {
        _northEast: {
          lat: bounds.getNorthEast().lat,
          lng: bounds.getNorthEast().lng,
        },
        _southWest: {
          lat: bounds.getSouthWest().lat,
          lng: bounds.getSouthWest().lng,
        },
      };
      
      dispatch(setMapBounds(serializableBounds as any));
    };

    // Initial bounds
    updateBounds();

    // Update on map movement
    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);

    return () => {
      map.off('moveend', updateBounds);
      map.off('zoomend', updateBounds);
    };
  }, [map, dispatch]);

  return null; // This component doesn't render anything
}