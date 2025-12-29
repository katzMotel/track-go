'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Shipment } from '@/types/shipment';
import { getMarkerIcon } from '@/utils/markerIcons';
import { SHIPMENT_STATUSES } from '@/lib/constants';

interface ShipmentMarkerProps{
    shipment: Shipment;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const ShipmentMarker = React.memo(({shipment, isSelected, onSelect}: ShipmentMarkerProps) => {
    const { currentLocation, trackingNumber, status, customer, destination} = shipment;
    return (
        <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon = {getMarkerIcon(status, isSelected)}
            eventHandlers={{
                click: () => onSelect(shipment.id),
            }}
        >
            <Popup>
                <div className='p-2 min-w-[200px]'>
                    <p className='font-semibold text-sm mb-1'>{trackingNumber}</p>
                    <div className="flex-items-center gap-2 mb-2">
                        <span
                            className='px-2 py-0.5 rounded text-xs font-medium text-white'
                            style={{backgroundColor: SHIPMENT_STATUSES[status].color}}
                        >
                            {SHIPMENT_STATUSES[status].label}
                        </span>
                    </div>
                    <p className='text-xs text-gray-600 mb-1'>
                        <span className='font-medium'>Customer:</span> {customer.name}
                    </p>
                    <p className='text-xs text-gray-600 mb-1'>
                        <span className='font-medium'>Destination:</span> {destination.city}, {destination.state}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
}, (prev, next) => {
    return(
        prev.shipment.currentLocation.lat === next.shipment.currentLocation.lat &&
        prev.shipment.currentLocation.lng === next.shipment.currentLocation.lng &&
        prev.shipment.status === next.shipment.status &&
        prev.isSelected === next.isSelected
    );
});
ShipmentMarker.displayName = 'ShipmentMarker';
export default ShipmentMarker;