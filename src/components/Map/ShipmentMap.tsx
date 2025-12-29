'use client';
import { MapContainer, TileLayer } from "react-leaflet"
import { MAP_CONFIG } from "@/lib/constants"
import MapController from "./MapController"
import ShipmentMarkers from "./ShipmentMarkers"
import 'leaflet/dist/leaflet.css';

export default function ShipmentMap() {
    return(
        <MapContainer
            center={MAP_CONFIG.DEFAULT_CENTER}
            zoom={MAP_CONFIG.DEFAULT_ZOOM}
            style={{height: '100%', width: '100%'}}
            zoomControl={true}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController />
            <ShipmentMarkers />
        </MapContainer>
    )
}