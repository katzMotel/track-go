import type { Location } from "@/types/shipment";

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles(default) or kilometers 
*/ 

export function calculateDistance(point1: Location, point2: Location, unit: 'miles' | 'km' = 'miles'): number{
    const R = unit === 'miles' ? 3959 : 6371; // Earth's radius in miles or km
    const lat1 = (point1.lat * Math.PI) / 180;
    const lat2 = (point2.lat * Math.PI) / 180;
    const deltaLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const deltaLng = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a = 
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLat / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Convert miles to kilometers
 */

export function milesToKm(miles: number): number{
    return miles * 1.60934;
}

/**
 * Convert kilometers to miles
 */

export function kmToMiles(km: number):number{
    return km * 0.621371;
}

/**
 * Calculate progress (0 to 1) of current location between origin and destination
 */

export function calculateProgress(origin: Location, current: Location, destination: Location): number{
    const totalDistance = calculateDistance(origin, destination, 'miles');
    const currentDistance = calculateDistance(origin, current, 'miles');

    if(totalDistance === 0) return 1;
    const progress = currentDistance / totalDistance;
    return Math.min(Math.max(progress, 0), 1);
}

/**
 * Calculate new position along route based on progress
 * progress is between 0(origin) and 1(destination)
 */

export function interpolatePosition(origin: Location, destination: Location, progress: number): {lat: number, lng:number}{
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    const lat = origin.lat + (destination.lat - origin.lat) * clampedProgress;
    const lng = origin.lng + (destination.lng - origin.lng) * clampedProgress;

    return {lat, lng};
}

/**
 * Find nearest city from list based on coordinates
 */

export function findNearestCity(lat: number, lng: number, cities: Array<{lat: number, lng:number, city:string, state:string, zip: string}>) :{city:string, state:string,zip:string} {
    if(cities.length === 0){
        return {city: 'Unknown', state: 'Unknown', zip: '00000'};
    }
    let nearest = cities[0];
    let minDistance = Math.hypot(cities[0].lat - lat, cities[0].lng - lng);

    for (const city of cities){
        const distance = Math.hypot(city.lat - lat, city.lng - lng);
        if(distance < minDistance){
            minDistance = distance;
            nearest = city;
        }
    }

    return { city: nearest.city, state: nearest.state, zip: nearest.zip};
}

/**
 * Get formatted distance string with both units
 * Ex: "2,453 mi (3,948 km)"
 */

export function formatDistance(point1: Location, point2: Location): string{
    const miles = calculateDistance(point1, point2, 'miles');
    const km = milesToKm(miles);

    return `${Math.round(miles).toLocaleString()} mi (${Math.round(km).toLocaleString()} km)`;
}