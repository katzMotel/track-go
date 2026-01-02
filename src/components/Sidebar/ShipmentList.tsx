'use client';

import { useAppSelector } from '@/store/hooks';
import { selectSortedShipments } from '@/store/selectors/shipmentSelectors';
import ShipmentListItem from './ShipmentListItem';

export default function ShipmentList() {
  const shipments = useAppSelector(selectSortedShipments);

  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-sm">No shipments found</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {shipments.map(shipment => (
        <ShipmentListItem key={shipment.id} shipment={shipment} />
      ))}
    </div>
  );
}