'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchShipments } from '@/store/slices/shipmentsSlice';
import { useShipmentUpdates } from '@/hooks/useShipmentUpdates';
import { toggleRoutes } from '@/store/slices/mapSlice';
import { useRestoreState } from '@/hooks/useRestoreState';
import Sidebar from '@/components/Sidebar/Sidebar';
import { isLocalStorageAvailable } from '@/utils/localStorage';
import { Button } from '@/components/ui/Button';
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
  const sidebarOpen = useAppSelector(state => state.ui.sidebarOpen);
  const showRoutes = useAppSelector(state => state.map.showRoutes);
  const activeShipments = useAppSelector(state => 
    state.shipments.ids.filter(id => {
      const shipment = state.shipments.shipments[id];
      return shipment.status === 'in_transit' || shipment.status === 'out_for_delivery';
    }).length
  );

  const [storageAvailable, setStorageAvailable] = useState(false);

  // Restore persisted state
  useRestoreState();

  useEffect(() => {
    setStorageAvailable(isLocalStorageAvailable());
  }, []);

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  useShipmentUpdates();

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
    <div className="h-screen w-screen flex">
      {sidebarOpen && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipment Tracker</h1>
            <p className="text-sm text-gray-600">
              {ids.length} Total • {activeShipments} Active
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Real-time updates</span>
            </div>
            {storageAvailable && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                  <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                </svg>
                <span className="text-sm text-gray-600">Auto-save enabled</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 relative">
          <ShipmentMap />
          <div className='absolute bottom-6 right-6 z-10 flex flex-col gap-2'>
            <Button
              onClick={()=> dispatch(toggleRoutes())}
              variant={showRoutes ? 'primary' : 'secondary'}
              size='sm'
              className='shadow-lg'
            >
              {showRoutes? '🛣️ Hide Routes' : '🛣️ Show Routes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}