'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSidebarPanel, toggleSidebar } from '@/store/slices/uiSlice';
import { clearFilters } from '@/store/slices/filtersSlice';
import { selectShipment } from '@/store/slices/mapSlice';
import ShipmentList from './ShipmentList';
import FilterPanel from './FilterPanel';
import ShipmentDetails from './ShipmentDetails';
import AnalyticsPanel from './AnalyticsPanel';
import NotificationsPanel from './NotificationsPanel';
import { Button } from '@/components/ui/Button';
import { clearState } from '@/utils/localStorage';
import { useState } from 'react';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { sidebarOpen, sidebarPanel } = useAppSelector(state => state.ui);
  const { ids } = useAppSelector(state => state.shipments);
  const selectedId = useAppSelector(state => state.map.selectedShipmentId);
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);
  const [showMenu, setShowMenu] = useState(false);

  const tabs = [
    { id: 'list' as const, label: 'Shipments', count: ids.length },
    { id: 'filters' as const, label: 'Filters' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'notifications' as const, label: 'Alerts', count: unreadCount },
    { id: 'details' as const, label: 'Details', disabled: !selectedId },
  ];

  const handleClearStorage = () => {
    if (confirm('Clear all saved preferences? This will reset filters, sidebar state, and selections.')) {
      clearState();
      dispatch(clearFilters());
      dispatch(selectShipment(null));
      setShowMenu(false);
      window.location.reload();
    }
  };

  if (!sidebarOpen) {
    return (
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={() => dispatch(toggleSidebar())} variant="primary">
          ☰ Show Sidebar
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Shipment Tracker</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={handleClearStorage}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Storage
                </button>
                <button
                  onClick={() => {
                    dispatch(clearFilters());
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => dispatch(toggleSidebar())}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && dispatch(setSidebarPanel(tab.id))}
            disabled={tab.disabled}
            className={`
              flex-shrink-0 px-3 py-3 text-xs font-medium border-b-2 transition-colors relative
              ${sidebarPanel === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`
                ml-1 px-1.5 py-0.5 rounded-full text-xs
                ${tab.id === 'notifications' && tab.count > 0
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {sidebarPanel === 'list' && <ShipmentList />}
        {sidebarPanel === 'filters' && <FilterPanel />}
        {sidebarPanel === 'analytics' && <AnalyticsPanel />}
        {sidebarPanel === 'notifications' && <NotificationsPanel />}
        {sidebarPanel === 'details' && <ShipmentDetails />}
      </div>
    </div>
  );
}