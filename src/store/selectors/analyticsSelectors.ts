import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { selectAllShipments } from './shipmentSelectors';

// Calculate analytics from shipments
export const selectCalculatedAnalytics = createSelector(
  [selectAllShipments],
  (shipments) => {
    const totalShipments = shipments.length;

    // Status counts
    const statusCounts = shipments.reduce(
      (acc, s) => {
        acc[s.status]++;
        return acc;
      },
      { pending: 0, in_transit: 0, out_for_delivery: 0, delivered: 0, delayed: 0 }
    );

    // Average delivery time (only for delivered shipments)
    const deliveredShipments = shipments.filter(s => s.status === 'delivered' && s.actualDelivery);
    const totalDeliveryTime = deliveredShipments.reduce((sum, s) => {
      const created = new Date(s.createdAt).getTime();
      const delivered = new Date(s.actualDelivery!).getTime();
      return sum + (delivered - created);
    }, 0);
    const averageDeliveryTime = deliveredShipments.length > 0 
      ? totalDeliveryTime / deliveredShipments.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    // On-time delivery rate
    const onTimeDeliveries = deliveredShipments.filter(s => {
      const eta = new Date(s.estimatedDelivery).getTime();
      const actual = new Date(s.actualDelivery!).getTime();
      return actual <= eta;
    }).length;
    const onTimeDeliveryRate = deliveredShipments.length > 0
      ? (onTimeDeliveries / deliveredShipments.length) * 100
      : 0;

    // Delayed shipments
    const delayedShipments = statusCounts.delayed;

    // Revenue by priority (mock calculation)
    const priorityRates = { standard: 10, express: 25, overnight: 50 };
    const revenueByPriority = shipments.reduce(
      (acc, s) => {
        acc[s.priority] += priorityRates[s.priority] * s.package.weight;
        return acc;
      },
      { standard: 0, express: 0, overnight: 0 }
    );

    // Shipments per day (last 7 days)
    const today = new Date();
    const shipmentsPerDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = shipments.filter(s => {
        const created = new Date(s.createdAt);
        return created >= date && created < nextDay;
      }).length;

      return {
        date: date.toISOString().split('T')[0],
        count,
      };
    }).reverse();

    // Top destinations
    const destinationCounts = shipments.reduce((acc, s) => {
      const city = `${s.destination.city}, ${s.destination.state}`;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topDestinations = Object.entries(destinationCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalShipments,
      statusCounts,
      averageDeliveryTime: Math.round(averageDeliveryTime * 10) / 10,
      onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 10) / 10,
      delayedShipments,
      revenueByPriority,
      shipmentsPerDay,
      topDestinations,
    };
  }
);

// Get unread notification count
export const selectUnreadNotificationCount = (state: RootState) =>
  state.notifications.unreadCount;

// Get recent notifications (last 10)
export const selectRecentNotifications = createSelector(
  [(state: RootState) => state.notifications.notifications],
  (notifications) => notifications.slice(0, 10)
);