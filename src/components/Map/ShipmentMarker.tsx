'use client';

import { Marker } from 'react-leaflet';
import { useAppDispatch } from '@/store/hooks';
import { selectShipment, focusOnShipment } from '@/store/slices/mapSlice';
import { getMarkerIcon } from '@/utils/markerIcons';
import type { Shipment } from '@/types/shipment';
import React from 'react';

interface ShipmentMarkerProps {
  shipment: Shipment;
  isSelected: boolean;
}

function ShipmentMarker({ shipment, isSelected }: ShipmentMarkerProps) {
  const dispatch = useAppDispatch();
  const { currentLocation, trackingNumber, status, customer, destination } = shipment;

  // Validate coordinates
  const isValidCoordinate = (lat: number, lng: number): boolean => {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  // Skip rendering if coordinates are invalid
  if (!isValidCoordinate(currentLocation.lat, currentLocation.lng)) {
    console.warn(`Shipment ${shipment.id} has invalid coordinates:`, currentLocation);
    return null;
  }

  const handleClick = () => {
    dispatch(selectShipment(shipment.id));
    dispatch(focusOnShipment({
      center: [currentLocation.lat, currentLocation.lng],
      zoom: 10,
    }));
  };

  return (
    <Marker
      position={[currentLocation.lat, currentLocation.lng]}
      icon={getMarkerIcon(status, isSelected)}
      eventHandlers={{
        click: handleClick,
      }}
    />
  );
}

// Memoize with custom comparison
export default React.memo(ShipmentMarker, (prevProps, nextProps) => {
  return (
    prevProps.shipment.currentLocation.lat === nextProps.shipment.currentLocation.lat &&
    prevProps.shipment.currentLocation.lng === nextProps.shipment.currentLocation.lng &&
    prevProps.shipment.status === nextProps.shipment.status &&
    prevProps.isSelected === nextProps.isSelected
  );
});