import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { bulkUpdateShipments } from '@/store/slices/shipmentsSlice';
import { addNotification } from '@/store/slices/notificationsSlice';
import { calculateProgress, interpolatePosition, findNearestCity } from '@/utils/routeCalculation';
import { US_CITIES } from '@/utils/mockData';
import { MAP_CONFIG } from '@/lib/constants';
import { SHIPMENT_STATUSES } from '@/lib/constants';
import type { Shipment } from '@/types/shipment';

export function useShipmentUpdates() {
  const dispatch = useAppDispatch();
  const shipments = useAppSelector(state => state.shipments.shipments);
  const ids = useAppSelector(state => state.shipments.ids);

  const updateShipments = useCallback(() => {
    const updates: Array<Partial<Shipment> & { id: string }> = [];

    // Only update active shipments
    const activeShipments = ids
      .map(id => shipments[id])
      .filter(s => s.status === 'in_transit' || s.status === 'out_for_delivery');

    activeShipments.forEach(shipment => {
      // Calculate current progress
      const currentProgress = calculateProgress(
        shipment.origin,
        shipment.currentLocation,
        shipment.destination
      );

      // Increment progress by 1% per update
      const newProgress = Math.min(currentProgress + 0.01, 1);

      // Determine new status based on progress
      let newStatus = shipment.status;
      let shouldNotify = false;

      if (newProgress >= 0.95 && shipment.status === 'in_transit') {
        newStatus = 'out_for_delivery';
        shouldNotify = true;
      } else if (newProgress >= 1.0 && shipment.status === 'out_for_delivery') {
        newStatus = 'delivered';
        shouldNotify = true;
      }

      // Calculate new position
      const newPosition = interpolatePosition(
        shipment.origin,
        shipment.destination,
        newProgress
      );

      // Find nearest city for the new location
      const nearestCity = findNearestCity(newPosition.lat, newPosition.lng, US_CITIES);

      // Create update object
      const update: Partial<Shipment> & { id: string } = {
        id: shipment.id,
        currentLocation: {
          lat: newPosition.lat,
          lng: newPosition.lng,
          address: shipment.currentLocation.address,
          city: nearestCity.city,
          state: nearestCity.state,
          zip: nearestCity.zip,
        },
        status: newStatus,
        updatedAt: new Date(),
      };

      // If delivered, set actual delivery time
      if (newStatus === 'delivered' && shipment.status !== 'delivered') {
        update.actualDelivery = new Date();
      }

      updates.push(update);

      // Add notification for status change
      if (shouldNotify) {
        const statusLabel = SHIPMENT_STATUSES[newStatus].label;
        dispatch(addNotification({
          shipmentId: shipment.id,
          type: newStatus,
          title: `Shipment ${statusLabel}`,
          message: `${shipment.trackingNumber} is now ${statusLabel.toLowerCase()}`,
        }));
      }
    });

    // Bulk update all shipments at once
    if (updates.length > 0) {
      dispatch(bulkUpdateShipments(updates));
      console.log(`Updated ${updates.length} shipment(s)`);
    }
  }, [dispatch, ids, shipments]);

  useEffect(() => {
    // Run updates every 5 seconds
    const interval = setInterval(() => {
      updateShipments();
    }, MAP_CONFIG.UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [updateShipments]);
}