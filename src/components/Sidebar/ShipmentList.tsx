'use client';

import { useAppSelector } from '@/store/hooks';
import { selectFilteredShipments } from '@/store/selectors/shipmentSelectors';
import ShipmentListItem from './ShipmentListItem';

export default function ShipmentList() {
  const filteredShipments = useAppSelector(selectFilteredShipments);
  const selectedId = useAppSelector(state => state.map.selectedShipmentId);

  if (filteredShipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
        <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm text-center">No shipments found</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-800">
      {filteredShipments.map(shipment => (
        <ShipmentListItem
          key={shipment.id}
          shipment={shipment}
          isSelected={selectedId === shipment.id}
        />
      ))}
    </div>
  );
}