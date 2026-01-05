'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectShipment } from '@/store/slices/mapSlice';
import { SHIPMENT_STATUSES, PRIORITIES } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDistance } from '@/utils/routeCalculation';
import { format } from 'date-fns';

export default function ShipmentDetails() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(state => state.map.selectedShipmentId);
  const shipment = useAppSelector(state => 
    selectedId ? state.shipments.shipments[selectedId] : null
  );

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8 bg-white dark:bg-gray-800">
        <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm text-center">Select a shipment from the list or map to view details</p>
      </div>
    );
  }

  const handleClose = () => {
    dispatch(selectShipment(null));
  };

  const getStatusBadgeVariant = (status: typeof shipment.status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'out_for_delivery':
        return 'warning';
      case 'delayed':
        return 'danger';
      case 'in_transit':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
              {shipment.trackingNumber}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{shipment.customer.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="ml-2">
            ✕
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(shipment.status)}>
            {SHIPMENT_STATUSES[shipment.status].label}
          </Badge>
          <Badge variant="default">
            {PRIORITIES[shipment.priority].label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Route Information */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Route
          </h4>
          <div className="space-y-4">
            <div className="relative pl-6 pb-4 border-l-2 border-gray-200 dark:border-gray-700">
              <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Origin</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{shipment.origin.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {shipment.origin.city}, {shipment.origin.state} {shipment.origin.zip}
              </p>
            </div>

            <div className="relative pl-6 pb-4 border-l-2 border-gray-200 dark:border-gray-700">
              <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current Location</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{shipment.currentLocation.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {shipment.currentLocation.city}, {shipment.currentLocation.state} {shipment.currentLocation.zip}
              </p>
            </div>

            <div className="relative pl-6">
              <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-800" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Destination</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{shipment.destination.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {shipment.destination.city}, {shipment.destination.state} {shipment.destination.zip}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Total Distance</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDistance(shipment.origin, shipment.destination)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Delivery
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-500 dark:text-gray-400">Estimated Delivery</span>
              <span className="text-sm text-gray-900 dark:text-gray-100 text-right">
                {format(new Date(shipment.estimatedDelivery), 'MMM d, yyyy')}
                <br />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(shipment.estimatedDelivery), 'h:mm a')}
                </span>
              </span>
            </div>
            {shipment.actualDelivery && (
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 dark:text-gray-400">Actual Delivery</span>
                <span className="text-sm text-gray-900 dark:text-gray-100 text-right">
                  {format(new Date(shipment.actualDelivery), 'MMM d, yyyy')}
                  <br />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(shipment.actualDelivery), 'h:mm a')}
                  </span>
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Created</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {format(new Date(shipment.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Customer
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Name</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{shipment.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
              <span className="text-sm text-gray-900 dark:text-gray-100 truncate ml-2">{shipment.customer.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Phone</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{shipment.customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Package Information */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Package
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Description</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{shipment.package.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Weight</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{shipment.package.weight} lbs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Dimensions</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {shipment.package.dimensions.length}" × {shipment.package.dimensions.width}" × {shipment.package.dimensions.height}"
              </span>
            </div>
          </div>
        </div>

        {/* Status History */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Status History
          </h4>
          <div className="space-y-4">
            {shipment.statusHistory.map((entry, index) => (
              <div key={index} className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                {index < shipment.statusHistory.length - 1 && (
                  <div className="absolute left-0.5 top-4 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {SHIPMENT_STATUSES[entry.status].label}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{entry.location}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                  {entry.note && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">{entry.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}