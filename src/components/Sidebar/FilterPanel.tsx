'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleStatusFilter,
  togglePriorityFilter,
  setSearchQuery,
  clearFilters,
} from '@/store/slices/filtersSlice';
import { SHIPMENT_STATUSES, PRIORITIES } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ShipmentStatus, Priority } from '@/types/shipment';

export default function FilterPanel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filters);

  const handleStatusToggle = (status: ShipmentStatus) => {
    dispatch(toggleStatusFilter(status));
  };

  const handlePriorityToggle = (priority: Priority) => {
    dispatch(togglePriorityFilter(priority));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.searchQuery.trim() !== '';

  return (
    <div className="p-4 space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <Input
          type="text"
          placeholder="Tracking #, customer, city..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Status Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="space-y-2">
          {(Object.keys(SHIPMENT_STATUSES) as ShipmentStatus[]).map(status => (
            <label key={status} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.status.includes(status)}
                onChange={() => handleStatusToggle(status)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {SHIPMENT_STATUSES[status].label}
              </span>
              <span
                className="ml-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: SHIPMENT_STATUSES[status].color }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <div className="space-y-2">
          {(Object.keys(PRIORITIES) as Priority[]).map(priority => (
            <label key={priority} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.priority.includes(priority)}
                onChange={() => handlePriorityToggle(priority)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {PRIORITIES[priority].label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="secondary"
          onClick={handleClearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
}