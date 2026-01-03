'use client';

import { useAppSelector } from '@/store/hooks';
import { Polyline } from 'react-leaflet';
import { SHIPMENT_STATUSES } from '@/lib/constants';

export default function RouteLines() {
  const shipments = useAppSelector(state => state.shipments.shipments);
  const ids = useAppSelector(state => state.shipments.ids);
  const showRoutes = useAppSelector(state => state.map.showRoutes);
  const selectedId = useAppSelector(state => state.map.selectedShipmentId);

  if (!showRoutes) {
    return null;
  }

  // Helper function to validate coordinates
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

  return (
    <>
      {ids.map(id => {
        const shipment = shipments[id];
        
        // Only show routes for active shipments or selected shipment
        const isActive = shipment.status === 'in_transit' || shipment.status === 'out_for_delivery';
        const isSelected = selectedId === id;
        
        if (!isActive && !isSelected) {
          return null;
        }

        // Validate all coordinates before rendering
        const hasValidOrigin = isValidCoordinate(shipment.origin.lat, shipment.origin.lng);
        const hasValidCurrent = isValidCoordinate(shipment.currentLocation.lat, shipment.currentLocation.lng);
        const hasValidDestination = isValidCoordinate(shipment.destination.lat, shipment.destination.lng);

        if (!hasValidOrigin || !hasValidCurrent || !hasValidDestination) {
          console.warn(`Shipment ${id} has invalid coordinates, skipping route`);
          return null;
        }

        // Define route segments
        const completedRoute = [
          [shipment.origin.lat, shipment.origin.lng],
          [shipment.currentLocation.lat, shipment.currentLocation.lng],
        ] as [number, number][];

        const remainingRoute = [
          [shipment.currentLocation.lat, shipment.currentLocation.lng],
          [shipment.destination.lat, shipment.destination.lng],
        ] as [number, number][];

        // Get color based on status
        const statusColor = SHIPMENT_STATUSES[shipment.status].color;
        
        return (
          <div key={id}>
            {/* Completed route (solid line) */}
            <Polyline
              positions={completedRoute}
              pathOptions={{
                color: statusColor,
                weight: isSelected ? 4 : 2,
                opacity: isSelected ? 0.8 : 0.6,
              }}
            />
            
            {/* Remaining route (dashed line) */}
            <Polyline
              positions={remainingRoute}
              pathOptions={{
                color: statusColor,
                weight: isSelected ? 4 : 2,
                opacity: isSelected ? 0.6 : 0.4,
                dashArray: '10, 10',
              }}
            />
          </div>
        );
      })}
    </>
  );
}