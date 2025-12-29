'use client';
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectVisibleShipments } from "@/store/selectors/shipmentSelectors";
import { selectShipment } from "@/store/slices/mapSlice";
import ShipmentMarker from "./ShipmentMarker";

export default function ShipmentMarkers() {
    const dispatch = useAppDispatch();
    const shipments = useAppSelector(selectVisibleShipments);
    const selectedId = useAppSelector(state => state.map.selectedShipmentId);

    const handleSelectedShipment = (id: string) => {
        dispatch(selectShipment(id));
    };
    return(
        <>
            {shipments.map(shipment=> (
                <ShipmentMarker
                    key={shipment.id}
                    shipment={shipment}
                    isSelected={selectedId === shipment.id}
                    onSelect={handleSelectedShipment}
                />
            ))}
        </>
    );
}