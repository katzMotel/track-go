'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  toggleStatusFilter,
  togglePriorityFilter,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  clearFilters,
} from '@/store/slices/filtersSlice';
import { SHIPMENT_STATUSES, PRIORITIES } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { SortBy } from '@/store/slices/filtersSlice';

export default function FilterPanel() {
  const dispatch = useAppDispatch();
  const { status, priority, searchQuery, sortBy, sortOrder } = useAppSelector(state => state.filters);

  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(newSortBy));
      dispatch(setSortOrder('asc'));
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-white dark:bg-gray-800">
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search
        </label>
        <Input
          type="text"
          placeholder="Search by tracking number, customer..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      {/* Status Filters */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <div className="space-y-2">
          {Object.entries(SHIPMENT_STATUSES).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={status.includes(key as any)}
                onChange={() => dispatch(toggleStatusFilter(key as any))}
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{value.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Priority
        </label>
        <div className="space-y-2">
          {Object.entries(PRIORITIES).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={priority.includes(key as any)}
                onChange={() => dispatch(togglePriorityFilter(key as any))}
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{value.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sort By
        </label>
        <div className="space-y-2">
          {[
            { value: 'eta' as const, label: 'Estimated Delivery' },
            { value: 'status' as const, label: 'Status' },
            { value: 'priority' as const, label: 'Priority' },
            { value: 'customer' as const, label: 'Customer Name' },
            { value: 'createdAt' as const, label: 'Created Date' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`
                w-full text-left p-2 rounded text-sm transition-colors
                ${sortBy === option.value
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <span>{option.label}</span>
              {sortBy === option.value && (
                <span className="ml-2">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        onClick={() => dispatch(clearFilters())}
        variant="secondary"
        className="w-full dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        Clear All Filters
      </Button>
    </div>
  );
}