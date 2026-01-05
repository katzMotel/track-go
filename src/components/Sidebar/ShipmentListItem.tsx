'use client';

import { useAppDispatch } from '@/store/hooks';
import { selectShipment, focusOnShipment } from '@/store/slices/mapSlice';
import { setSidebarPanel } from '@/store/slices/uiSlice';
import { Badge } from '@/components/ui/Badge';
import { SHIPMENT_STATUSES, PRIORITIES } from '@/lib/constants';
import type { Shipment } from '@/types/shipment';

interface ShipmentListItemProps {
  shipment: Shipment;
  isSelected: boolean;
}

export default function ShipmentListItem({ shipment, isSelected }: ShipmentListItemProps) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(selectShipment(shipment.id));
    dispatch(focusOnShipment({
      center: [shipment.currentLocation.lat, shipment.currentLocation.lng],
      zoom: 10,
    }));
    dispatch(setSidebarPanel('details'));
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
    <div
      onClick={handleClick}
      className={`
        p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors
        ${isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600 dark:border-l-blue-500' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
            {shipment.trackingNumber}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {shipment.customer.name}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(shipment.status)} size="sm">
          {SHIPMENT_STATUSES[shipment.status].label}
        </Badge>
      </div>

      {/* Route Info */}
      <div className="space-y-1 text-xs">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span className="font-medium mr-1">From:</span>
          <span className="truncate">{shipment.origin.city}, {shipment.origin.state}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span className="font-medium mr-1">To:</span>
          <span className="truncate">{shipment.destination.city}, {shipment.destination.state}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span className="font-medium mr-1">Current:</span>
          <span className="truncate">{shipment.currentLocation.city}, {shipment.currentLocation.state}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <Badge variant="default" size="sm">
          {PRIORITIES[shipment.priority].label}
        </Badge>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {new Date(shipment.estimatedDelivery).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}