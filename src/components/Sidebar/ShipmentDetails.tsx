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
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <p className="text-sm text-center">Select a shipment to view details</p>
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
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {shipment.trackingNumber}
            </h3>
            <p className="text-sm text-gray-600">{shipment.customer.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
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

      {/* Details */}
      <div className="p-4 space-y-6">
        {/* Route */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-3">Route</h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Origin</p>
              <p className="text-sm text-gray-900">{shipment.origin.address}</p>
              <p className="text-sm text-gray-600">
                {shipment.origin.city}, {shipment.origin.state} {shipment.origin.zip}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Current Location</p>
              <p className="text-sm text-gray-900">{shipment.currentLocation.address}</p>
              <p className="text-sm text-gray-600">
                {shipment.currentLocation.city}, {shipment.currentLocation.state} {shipment.currentLocation.zip}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Destination</p>
              <p className="text-sm text-gray-900">{shipment.destination.address}</p>
              <p className="text-sm text-gray-600">
                {shipment.destination.city}, {shipment.destination.state} {shipment.destination.zip}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Distance</p>
              <p className="text-sm text-gray-900">
                {formatDistance(shipment.origin, shipment.destination)}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-3">Delivery</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Estimated Delivery</span>
              <span className="text-sm text-gray-900">
                {format(new Date(shipment.estimatedDelivery), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            {shipment.actualDelivery && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Actual Delivery</span>
                <span className="text-sm text-gray-900">
                  {format(new Date(shipment.actualDelivery), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Customer */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-3">Customer</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Name</span>
              <span className="text-sm text-gray-900">{shipment.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Email</span>
              <span className="text-sm text-gray-900">{shipment.customer.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Phone</span>
              <span className="text-sm text-gray-900">{shipment.customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Package */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-3">Package</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Description</span>
              <span className="text-sm text-gray-900">{shipment.package.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Weight</span>
              <span className="text-sm text-gray-900">{shipment.package.weight} lbs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Dimensions</span>
              <span className="text-sm text-gray-900">
                {shipment.package.dimensions.length}" × {shipment.package.dimensions.width}" × {shipment.package.dimensions.height}"
              </span>
            </div>
          </div>
        </div>

        {/* Status History */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-3">Status History</h4>
          <div className="space-y-3">
            {shipment.statusHistory.map((entry, index) => (
              <div key={index} className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-600" />
                {index < shipment.statusHistory.length - 1 && (
                  <div className="absolute left-0.5 top-3 w-0.5 h-full bg-gray-300" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {SHIPMENT_STATUSES[entry.status].label}
                  </p>
                  <p className="text-xs text-gray-600">{entry.location}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                  {entry.note && (
                    <p className="text-xs text-gray-600 mt-1">{entry.note}</p>
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