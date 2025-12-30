import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { bulkUpdateShipments, updateShipment } from "@/store/slices/shipmentsSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { calculateProgress, interpolatePosition, findNearestCity   } from "@/utils/routeCalculation";
import { US_CITIES } from "@/utils/mockData";
import type { Shipment, ShipmentStatus } from "@/types/shipment";
import { MAP_CONFIG } from "@/lib/constants";

export function useShipmentUpdates(){
    const dispatch = useAppDispatch();
    const shipments = useAppSelector(state => state.shipments.shipments);
    const ids = useAppSelector(state => state.shipments.ids);

    const updateShipments = useCallback(() => {
        const updates: Array<Partial<Shipment> & {id: string}> = [];
        const notifications: Array<{id: string; status: ShipmentStatus; trackingNumber: string; destination: string}> = [];

        ids.forEach( id => {
            const shipment = shipments[id];
            if( shipment.status !== 'in_transit' && shipment.status !== 'out_for_delivery'){
                return;
            }

            const progress = calculateProgress(
                shipment.origin,
                shipment.currentLocation,
                shipment.destination
            );


            const incrementPerUpdate = 0.01;
            let newProgress = progress + incrementPerUpdate;

            let newStatus: ShipmentStatus = shipment.status;

            if(newProgress >= 0.95 && shipment.status === 'in_transit'){
                newStatus = 'out_for_delivery';
                notifications.push({
                    id: shipment.id,
                    status: 'out_for_delivery',
                    trackingNumber: shipment.trackingNumber,
                    destination: `${shipment.destination.city}, ${shipment.destination.state}`,
                });
            } else if(newProgress >= 1.0 && shipment.status === 'out_for_delivery'){
                newStatus = 'delivered';
                newProgress = 1.0;
                notifications.push({
                    id: shipment.id,
                    status: 'delivered',
                    trackingNumber: shipment.trackingNumber,
                    destination: shipment.destination.address,
                });
            }

            const newPosition = interpolatePosition(
                shipment.origin,
                shipment.destination,
                newProgress
            );

            let locationDetails;
            if(newStatus === 'delivered'){
                locationDetails = {
                    city: shipment.destination.city,
                    state: shipment.destination.state,
                    zip: shipment.destination.zip,
                };
            } else{
                locationDetails = findNearestCity(newPosition.lat, newPosition.lng, US_CITIES);

            }


            updates.push({
                id: shipment.id,
                currentLocation: {
                    lat: newPosition.lat,
                    lng: newPosition.lng,
                    address: newStatus === 'delivered' ? shipment.destination.address : 'In transit',
                    city: locationDetails.city,
                    state: locationDetails.state,
                    zip: locationDetails.zip,
                },
                status: newStatus,
                ...(newStatus === 'delivered' &&{
                    actualDelivery: new Date(),
                }),
            });
        });

        if(updates.length > 0){
            dispatch(bulkUpdateShipments(updates));
            console.log(`Updated ${updates.length} shipment(s)`);
        }

        notifications.forEach(notif => {
            if(notif.status === 'out_for_delivery'){
                dispatch(addNotification({
                    type: 'out_for_delivery',
                    shipmentId: notif.id,
                    message: `Shipment ${notif.trackingNumber} is out for delivery to ${notif.destination}`,
                }));
            } else if(notif.status === 'delivered'){
                dispatch(addNotification({
                    type: 'delivered',
                    shipmentId: notif.id,
                    message: `Shipment ${notif.trackingNumber} has been delivered to ${notif.destination}`,
                }));
            }
        });
    }, [dispatch, ids, shipments]);
    useEffect(() => {
        const interval = setInterval(()=> {
            updateShipments();
        }, MAP_CONFIG.UPDATE_INTERVAL);

        return () => clearInterval(interval);

    }, [updateShipments]);
}