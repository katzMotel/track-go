
import type { ShipmentStatus } from "@/types/shipment";


export const getMarkerIcon = (status: ShipmentStatus, isSelected: boolean = false) => {
   if( typeof window === undefined){
    return null as any;
   }
   const L = require('leaflet');
    const colors: Record<ShipmentStatus, string> = {
        pending: '#94a3b8',
        in_transit: '#3b82f6',
        out_for_delivery: '#f59e0b',
        delivered: '#10b981',
        delayed: '#ef4444',
    };
    const color = colors[status];
    const size = isSelected ? 40 : 30;

    return L.divIcon({
        html: `
        <div style="
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${isSelected ? '18px' : '14px'};
            transition: all 0.2 ease;    
        ">
        </div>
        `,
        className: 'custom-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size /2],
    });
};