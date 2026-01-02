'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSidebarPanel, toggleSidebar } from '@/store/slices/uiSlice';
import ShipmentList from './ShipmentList';
import FilterPanel from './FilterPanel';
import ShipmentDetails from './ShipmentDetails';
import { Button } from '@/components/ui/Button';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { sidebarOpen, sidebarPanel } = useAppSelector(state => state.ui);
  const { ids } = useAppSelector(state => state.shipments);
  const selectedId = useAppSelector(state => state.map.selectedShipmentId);

  const tabs = [
    { id: 'list' as const, label: 'All Shipments', count: ids.length },
    { id: 'filters' as const, label: 'Filters' },
    { id: 'details' as const, label: 'Details', disabled: !selectedId },
  ];

  if (!sidebarOpen) {
    return (
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={() => dispatch(toggleSidebar())} variant="primary">
          ☰ Show Sidebar
        </Button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Shipment Tracker</h2>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && dispatch(setSidebarPanel(tab.id))}
            disabled={tab.disabled}
            className={`
              flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${sidebarPanel === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
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
        {sidebarPanel === 'details' && <ShipmentDetails />}
      </div>
    </div>
  );
}