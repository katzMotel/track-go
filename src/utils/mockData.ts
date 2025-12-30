import { faker } from '@faker-js/faker';
import type { Shipment, Location, ShipmentStatus, Priority, StatusHistoryEntry } from '@/types/shipment';

// Major US cities with real coordinates
const US_CITIES: Array<Omit<Location, 'address'>> = [
  { lat: 40.7128, lng: -74.0060, city: 'New York', state: 'NY', zip: '10001' },
  { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA', zip: '90001' },
  { lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL', zip: '60601' },
  { lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX', zip: '77001' },
  { lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ', zip: '85001' },
  { lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO', zip: '80201' },
  { lat: 47.6062, lng: -122.3321, city: 'Seattle', state: 'WA', zip: '98101' },
  { lat: 37.7749, lng: -122.4194, city: 'San Francisco', state: 'CA', zip: '94102' },
  { lat: 32.7157, lng: -117.1611, city: 'San Diego', state: 'CA', zip: '92101' },
  { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL', zip: '33101' },
  { lat: 33.7490, lng: -84.3880, city: 'Atlanta', state: 'GA', zip: '30301' },
  { lat: 42.3601, lng: -71.0589, city: 'Boston', state: 'MA', zip: '02101' },
  { lat: 39.9526, lng: -75.1652, city: 'Philadelphia', state: 'PA', zip: '19101' },
  { lat: 35.1495, lng: -90.0490, city: 'Memphis', state: 'TN', zip: '38103' },
  { lat: 36.1627, lng: -86.7816, city: 'Nashville', state: 'TN', zip: '37201' },
  { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX', zip: '78701' },
  { lat: 32.7767, lng: -96.7970, city: 'Dallas', state: 'TX', zip: '75201' },
  { lat: 38.9072, lng: -77.0369, city: 'Washington', state: 'DC', zip: '20001' },
  { lat: 45.5152, lng: -122.6784, city: 'Portland', state: 'OR', zip: '97201' },
  { lat: 39.7684, lng: -86.1581, city: 'Indianapolis', state: 'IN', zip: '46201' },
  { lat: 35.2271, lng: -80.8431, city: 'Charlotte', state: 'NC', zip: '28201' },
  { lat: 43.0389, lng: -87.9065, city: 'Milwaukee', state: 'WI', zip: '53201' },
  { lat: 36.7378, lng: -119.7871, city: 'Fresno', state: 'CA', zip: '93701' },
  { lat: 38.5816, lng: -121.4944, city: 'Sacramento', state: 'CA', zip: '94203' },
  { lat: 40.7608, lng: -111.8910, city: 'Salt Lake City', state: 'UT', zip: '84101' },
];

const SHIPMENT_STATUSES: ShipmentStatus[] = ['pending', 'in_transit', 'out_for_delivery', 'delivered', 'delayed'];
const PRIORITIES: Priority[] = ['standard', 'express', 'overnight'];

// Generate a realistic tracking number
function generateTrackingNumber(): string {
  const prefix = faker.helpers.arrayElement(['FDX', 'UPS', 'USPS', 'DHL']);
  const number = faker.string.numeric(12);
  return `${prefix}${number}`;
}

// Create a full location with address
function createLocation(cityData: Omit<Location, 'address'>): Location {
  return {
    ...cityData,
    address: faker.location.streetAddress(),
  };
}

// Calculate intermediate point between origin and destination
function calculateCurrentLocation(
  origin: Location,
  destination: Location,
  progress: number // 0 to 1
): Location {
  const lat = origin.lat + (destination.lat - origin.lat) * progress;
  const lng = origin.lng + (destination.lng - origin.lng) * progress;
  
  // Find nearest city for current location
  const nearest = US_CITIES.reduce((prev, curr) => {
    const prevDist = Math.hypot(prev.lat - lat, prev.lng - lng);
    const currDist = Math.hypot(curr.lat - lat, curr.lng - lng);
    return currDist < prevDist ? curr : prev;
  });

  return {
    lat,
    lng,
    address: faker.location.streetAddress(),
    city: nearest.city,
    state: nearest.state,
    zip: nearest.zip,
  };
}

// Generate status history based on current status
function generateStatusHistory(
  status: ShipmentStatus,
  origin: Location,
  destination: Location,
  currentLocation: Location,
  createdAt: Date
): StatusHistoryEntry[] {
  const history: StatusHistoryEntry[] = [];
  const now = new Date();

  // Always start with pending
  history.push({
    status: 'pending',
    timestamp: createdAt,
    location: `${origin.city}, ${origin.state}`,
    note: 'Package received at facility',
  });

  // If beyond pending, add in_transit
  if (['in_transit', 'out_for_delivery', 'delivered', 'delayed'].includes(status)) {
    history.push({
      status: 'in_transit',
      timestamp: new Date(createdAt.getTime() + faker.number.int({ min: 1, max: 4 }) * 60 * 60 * 1000),
      location: `${origin.city}, ${origin.state}`,
      note: 'Package departed facility',
    });

    // Add intermediate stops
    const numStops = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numStops; i++) {
      const stopTime = new Date(
        createdAt.getTime() + faker.number.int({ min: 6, max: 48 }) * 60 * 60 * 1000
      );
      history.push({
        status: 'in_transit',
        timestamp: stopTime,
        location: `${currentLocation.city}, ${currentLocation.state}`,
        note: 'In transit',
      });
    }
  }

  // If delayed
  if (status === 'delayed') {
    history.push({
      status: 'delayed',
      timestamp: new Date(now.getTime() - faker.number.int({ min: 2, max: 12 }) * 60 * 60 * 1000),
      location: `${currentLocation.city}, ${currentLocation.state}`,
      note: faker.helpers.arrayElement([
        'Weather delay',
        'Mechanical issue',
        'Customs clearance',
        'Address verification needed',
      ]),
    });
  }

  // If out for delivery
  if (['out_for_delivery', 'delivered'].includes(status)) {
    history.push({
      status: 'out_for_delivery',
      timestamp: new Date(now.getTime() - faker.number.int({ min: 1, max: 6 }) * 60 * 60 * 1000),
      location: `${destination.city}, ${destination.state}`,
      note: 'Out for delivery',
    });
  }

  // If delivered
  if (status === 'delivered') {
    history.push({
      status: 'delivered',
      timestamp: new Date(now.getTime() - faker.number.int({ min: 0, max: 2 }) * 60 * 60 * 1000),
      location: destination.address,
      note: 'Delivered - signed by recipient',
    });
  }

  return history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

// Calculate ETA based on status and priority
function calculateETA(
  status: ShipmentStatus,
  priority: Priority,
  createdAt: Date
): Date {
  const now = new Date();
  
  if (status === 'delivered') {
    return new Date(now.getTime() - faker.number.int({ min: 1, max: 24 }) * 60 * 60 * 1000);
  }

  let hoursToAdd: number;
  
  switch (priority) {
    case 'overnight':
      hoursToAdd = faker.number.int({ min: 12, max: 24 });
      break;
    case 'express':
      hoursToAdd = faker.number.int({ min: 24, max: 48 });
      break;
    case 'standard':
      hoursToAdd = faker.number.int({ min: 48, max: 120 });
      break;
  }

  if (status === 'delayed') {
    hoursToAdd += faker.number.int({ min: 12, max: 48 });
  }

  return new Date(createdAt.getTime() + hoursToAdd * 60 * 60 * 1000);
}

// Generate a single shipment
function generateShipment(): Shipment {
    const id = faker.string.uuid();
    const status: ShipmentStatus = faker.helpers.arrayElement(SHIPMENT_STATUSES); // <-- Add explicit type
    const priority: Priority = faker.helpers.arrayElement(PRIORITIES); // <-- Add explicit type
    
    // Pick random origin and destination cities
    const originCity = faker.helpers.arrayElement(US_CITIES);
    const destinationCity = faker.helpers.arrayElement(
      US_CITIES.filter(city => city.city !== originCity.city)
    );
    
    const origin = createLocation(originCity);
    const destination = createLocation(destinationCity);
    
    // Calculate progress based on status
    let progress: number;
    switch (status) {
      case 'pending':
        progress = 0;
        break;
      case 'in_transit':
        progress = faker.number.float({ min: 0.1, max: 0.7, fractionDigits: 2 });
        break;
      case 'out_for_delivery':
        progress = faker.number.float({ min: 0.8, max: 0.95, fractionDigits: 2 });
        break;
      case 'delivered':
        progress = 1;
        break;
      case 'delayed':
        progress = faker.number.float({ min: 0.2, max: 0.6, fractionDigits: 2 });
        break;
    }
    
    const currentLocation = progress === 0 ? origin : 
                            progress === 1 ? destination :
                            calculateCurrentLocation(origin, destination, progress);
    
    const createdAt = faker.date.recent({ days: 7 });
    const estimatedDelivery = calculateETA(status, priority, createdAt);
    const actualDelivery = status === 'delivered' ? 
      new Date(estimatedDelivery.getTime() + faker.number.int({ min: -12, max: 12 }) * 60 * 60 * 1000) : 
      undefined;
  
    const shipment: Shipment = { // <-- Explicit type annotation
      id,
      trackingNumber: generateTrackingNumber(),
      status,
      priority,
      origin,
      destination,
      currentLocation,
      estimatedDelivery,
      actualDelivery,
      customer: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      },
      package: {
        weight: faker.number.float({ min: 0.5, max: 50, fractionDigits: 1 }),
        dimensions: {
          length: faker.number.int({ min: 5, max: 36 }),
          width: faker.number.int({ min: 5, max: 24 }),
          height: faker.number.int({ min: 3, max: 18 }),
        },
        description: faker.helpers.arrayElement([
          'Electronics',
          'Clothing',
          'Books',
          'Home Goods',
          'Office Supplies',
          'Sporting Equipment',
          'Toys',
          'Medical Supplies',
          'Auto Parts',
          'Food Items',
        ]),
      },
      statusHistory: generateStatusHistory(status, origin, destination, currentLocation, createdAt),
      createdAt,
      updatedAt: new Date(),
    };
  
    return shipment;
  }

// Generate multiple shipments
export function generateMockShipments(count: number): Shipment[] {
  faker.seed(12345); // Consistent data for development
  return Array.from({ length: count }, () => generateShipment());
}

// Generate a single new shipment (for adding via UI)
export function generateNewShipment(
  origin?: Location,
  destination?: Location
): Shipment {
  const shipment = generateShipment();
  
  if (origin) shipment.origin = origin;
  if (destination) shipment.destination = destination;
  
  // New shipments start as pending
  shipment.status = 'pending';
  shipment.currentLocation = shipment.origin;
  shipment.createdAt = new Date();
  shipment.updatedAt = new Date();
  
  return shipment;
}

export { US_CITIES};