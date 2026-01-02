'use client';

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectShipment, focusOnShipment } from "@/store/slices/mapSlice";
import { setSidebarPanel } from "@/store/slices/uiSlice";
import { SHIPMENT_STATUSES, PRIORITIES } from "@/lib/constants";
import { Badge } from "../ui/Badge";
import { Shipment } from "@/types/shipment";
import { formatDistance } from "@/utils/routeCalculation";

interface ShipmentListItemProps{
    shipment: Shipment;
}

export default function ShipmentListItem({ shipment}: ShipmentListItemProps){
    const dispatch = useAppDispatch();
    const selectedId = useAppSelector(state => state.map.selectedShipmentId);
    const isSelected = selectedId === shipment.id;

    const handleClick = () => {
        dispatch(selectShipment(shipment.id));

        dispatch(focusOnShipment({
            center: [shipment.currentLocation.lat, shipment.currentLocation.lng],
            zoom: 10,
        }));
        
        dispatch(setSidebarPanel('details'));
    };

    const getStatusBadgeVariant = (status: Shipment['status']) => {
        switch(status){
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
        <button
      onClick={handleClick}
      className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">
            {shipment.trackingNumber}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {shipment.customer.name}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(shipment.status)} size="sm">
          {SHIPMENT_STATUSES[shipment.status].label}
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="flex items-center text-xs text-gray-600">
          <span className="font-medium mr-1">From:</span>
          <span className="truncate">{shipment.origin.city}, {shipment.origin.state}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <span className="font-medium mr-1">To:</span>
          <span className="truncate">{shipment.destination.city}, {shipment.destination.state}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <span className="font-medium mr-1">Current:</span>
          <span className="truncate">{shipment.currentLocation.city}, {shipment.currentLocation.state}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <Badge variant="default" size="sm">
          {PRIORITIES[shipment.priority].label}
        </Badge>
        <span className="text-xs text-gray-500">
          {new Date(shipment.estimatedDelivery).toLocaleDateString()}
        </span>
      </div>
    </button>
    );
}