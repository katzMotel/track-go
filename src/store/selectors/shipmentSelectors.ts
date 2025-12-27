import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { Shipment } from '@/types/shipment';

// Base selectors
const selectShipmentsState = (state: RootState) => state.shipments.shipments;
const selectShipmentIds = (state: RootState) => state.shipments.ids;
const selectFilters = (state: RootState) => state.filters;
const selectMapBounds = (state: RootState) => state.map.bounds;

// Get all shipments as array
export const selectAllShipments = createSelector(
  [selectShipmentsState, selectShipmentIds],
  (shipments, ids) => ids.map(id => shipments[id])
);

// Get shipment by ID
export const selectShipmentById = (id: string) =>
  createSelector([selectShipmentsState], (shipments) => shipments[id]);

// Filter shipments based on active filters
export const selectFilteredShipments = createSelector(
  [selectAllShipments, selectFilters],
  (shipments, filters) => {
    let filtered = shipments;

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(s => filters.status.includes(s.status));
    }

    // Priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(s => filters.priority.includes(s.priority));
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(s => {
        const createdAt = new Date(s.createdAt).getTime();
        const start = filters.dateRange.start ? new Date(filters.dateRange.start).getTime() : 0;
        const end = filters.dateRange.end ? new Date(filters.dateRange.end).getTime() : Infinity;
        return createdAt >= start && createdAt <= end;
      });
    }

    // Search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.trackingNumber.toLowerCase().includes(query) ||
          s.customer.name.toLowerCase().includes(query) ||
          s.destination.city.toLowerCase().includes(query) ||
          s.origin.city.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

// Sort filtered shipments
export const selectSortedShipments = createSelector(
  [selectFilteredShipments, selectFilters],
  (shipments, filters) => {
    const sorted = [...shipments];
    const { sortBy, sortOrder } = filters;

    sorted.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortBy) {
        case 'eta':
          aVal = new Date(a.estimatedDelivery).getTime();
          bVal = new Date(b.estimatedDelivery).getTime();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'priority':
          const priorityOrder = { overnight: 0, express: 1, standard: 2 };
          aVal = priorityOrder[a.priority];
          bVal = priorityOrder[b.priority];
          break;
        case 'customer':
          aVal = a.customer.name;
          bVal = b.customer.name;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }
);

// Get shipments visible in current map bounds
export const selectVisibleShipments = createSelector(
  [selectSortedShipments, selectMapBounds],
  (shipments, bounds) => {
    if (!bounds) return shipments;

    return shipments.filter(s => {
      const { lat, lng } = s.currentLocation;
      return (
        lat >= bounds._southWest.lat &&
        lat <= bounds._northEast.lat &&
        lng >= bounds._southWest.lng &&
        lng <= bounds._northEast.lng
      );
    });
  }
);

// Get shipments by status
export const selectShipmentsByStatus = (status: Shipment['status']) =>
  createSelector([selectAllShipments], (shipments) =>
    shipments.filter(s => s.status === status)
  );

// Get active shipments (not delivered)
export const selectActiveShipments = createSelector(
  [selectAllShipments],
  (shipments) => shipments.filter(s => s.status !== 'delivered')
);

// Get delayed shipments
export const selectDelayedShipments = createSelector(
  [selectAllShipments],
  (shipments) => shipments.filter(s => s.status === 'delayed')
);