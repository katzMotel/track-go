'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchShipments } from '@/store/slices/shipmentsSlice';
import { toggleRoutes } from '@/store/slices/mapSlice';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { useShipmentUpdates } from '@/hooks/useShipmentUpdates';
import { useRestoreState } from '@/hooks/useRestoreState';
import { useTheme } from '@/hooks/useTheme';
import Sidebar from '@/components/Sidebar/Sidebar';
import { isLocalStorageAvailable } from '@/utils/localStorage';
import { Button } from '@/components/ui/Button';

const ShipmentMap = dynamic(
  () => import('@/components/Map/ShipmentMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-gray-100">Loading map...</div>
      </div>
    )
  }
);

export default function Home() {
  const dispatch = useAppDispatch();
  const { ids, loading, error } = useAppSelector(state => state.shipments);
  const sidebarOpen = useAppSelector(state => state.ui.sidebarOpen);
  const showRoutes = useAppSelector(state => state.map.showRoutes);
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);
  const { theme, toggleTheme } = useTheme();
  const activeShipments = useAppSelector(state => 
    state.shipments.ids.filter(id => {
      const shipment = state.shipments.shipments[id];
      return shipment.status === 'in_transit' || shipment.status === 'out_for_delivery';
    }).length
  );

  const [storageAvailable, setStorageAvailable] = useState(false);

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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-gray-100">Loading shipments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-xl text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex relative bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      {sidebarOpen && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shipment Tracker</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {ids.length} Total • {activeShipments} Active
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Real-time updates</span>
            </div>
            {storageAvailable && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                  <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">Auto-save enabled</span>
              </div>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <ShipmentMap />
          
          {/* Sidebar Toggle Button (when closed) */}
          {!sidebarOpen && (
            <div className="absolute top-4 left-4 z-[1000]">
              <Button 
                onClick={() => dispatch(toggleSidebar())} 
                variant="primary"
                className="shadow-lg"
              >
                ☰ Show Sidebar
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          )}
          
          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
            <Button
              onClick={() => dispatch(toggleRoutes())}
              variant={showRoutes ? 'primary' : 'secondary'}
              size="sm"
              className="shadow-lg"
            >
              {showRoutes ? '🛣️ Hide Routes' : '🛣️ Show Routes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}