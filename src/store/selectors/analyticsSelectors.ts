import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { ShipmentStatus, Priority } from '@/types/shipment';

export const selectCalculatedAnalytics = createSelector(
  [(state: RootState) => state.shipments.shipments],
  (shipments) => {
    const shipmentsArray = Object.values(shipments);
    
    // Status counts
    const statusCounts: Record<ShipmentStatus, number> = {
      pending: 0,
      in_transit: 0,
      out_for_delivery: 0,
      delivered: 0,
      delayed: 0,
    };

    // Priority counts
    const priorityCounts: Record<Priority, number> = {
      standard: 0,
      express: 0,
      overnight: 0,
    };

    // Revenue by priority (simulated: standard=$50, express=$100, overnight=$150)
    const revenueByPriority: Record<Priority, number> = {
      standard: 0,
      express: 0,
      overnight: 0,
    };

    const priorityPricing: Record<Priority, number> = {
      standard: 50,
      express: 100,
      overnight: 150,
    };

    let totalRevenue = 0;
    let totalDeliveryTime = 0;
    let deliveredCount = 0;
    let onTimeCount = 0;

    shipmentsArray.forEach(shipment => {
      // Count statuses
      statusCounts[shipment.status]++;

      // Count priorities
      priorityCounts[shipment.priority]++;

      // Calculate revenue
      const revenue = priorityPricing[shipment.priority];
      revenueByPriority[shipment.priority] += revenue;
      totalRevenue += revenue;

      // Calculate delivery metrics
      if (shipment.actualDelivery) {
        deliveredCount++;
        const estimatedTime = new Date(shipment.estimatedDelivery).getTime();
        const actualTime = new Date(shipment.actualDelivery).getTime();
        const deliveryTime = (actualTime - new Date(shipment.createdAt).getTime()) / (1000 * 60 * 60); // hours
        totalDeliveryTime += deliveryTime;

        // Check if on time (within 2 hours of estimated)
        if (actualTime <= estimatedTime + 2 * 60 * 60 * 1000) {
          onTimeCount++;
        }
      }
    });

    const averageDeliveryTime = deliveredCount > 0 ? totalDeliveryTime / deliveredCount : 0;
    const onTimeDeliveryRate = deliveredCount > 0 ? (onTimeCount / deliveredCount) * 100 : 0;

    return {
      statusCounts,
      priorityCounts,
      revenueByPriority,
      totalRevenue,
      averageDeliveryTime,
      onTimeDeliveryRate,
      totalShipments: shipmentsArray.length,
    };
  }
);