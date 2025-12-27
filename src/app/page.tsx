'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchShipments } from '@/store/slices/shipmentsSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const { ids, loading, error } = useAppSelector(state => state.shipments);
  const shipments = useAppSelector(state => state.shipments.shipments);

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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Shipment Tracker</h1>
      <div className="mb-4">
        <p className="text-lg">Total Shipments: {ids.length}</p>
      </div>
      
      <div className="grid gap-4">
        {ids.slice(0, 5).map(id => {
          const shipment = shipments[id];
          return (
            <div key={id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{shipment.trackingNumber}</p>
                  <p className="text-sm text-gray-600">
                    {shipment.origin.city}, {shipment.origin.state} → {shipment.destination.city}, {shipment.destination.state}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {shipment.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {ids.length > 5 && (
        <p className="mt-4 text-gray-600">...and {ids.length - 5} more shipments</p>
      )}
    </div>
  );
}