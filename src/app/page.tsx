'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchShipments } from '@/store/slices/shipmentsSlice';

// Dynamic import to avoid SSR issues with Leaflet
const ShipmentMap = dynamic(
  () => import('@/components/Map/ShipmentMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading map...</div>
      </div>
    )
  }
);

export default function Home() {
  const dispatch = useAppDispatch();
  const { ids, loading, error } = useAppSelector(state => state.shipments);

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading shipments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment Tracker</h1>
          <p className="text-sm text-gray-600">Total Shipments: {ids.length}</p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <ShipmentMap />
      </div>
    </div>
  );
}