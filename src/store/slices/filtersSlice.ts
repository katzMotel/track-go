import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ShipmentStatus, Priority } from '@/types/shipment';

export type SortBy = 'eta' | 'status' | 'priority' | 'customer' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

interface FiltersState {
  status: ShipmentStatus[];
  priority: Priority[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

const initialState: FiltersState = {
  status: [],
  priority: [],
  dateRange: {
    start: null,
    end: null,
  },
  searchQuery: '',
  sortBy: 'eta',
  sortOrder: 'asc',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleStatusFilter: (state, action: PayloadAction<ShipmentStatus>) => {
      const index = state.status.indexOf(action.payload);
      if (index > -1) {
        state.status.splice(index, 1);
      } else {
        state.status.push(action.payload);
      }
    },
    togglePriorityFilter: (state, action: PayloadAction<Priority>) => {
      const index = state.priority.indexOf(action.payload);
      if (index > -1) {
        state.priority.splice(index, 1);
      } else {
        state.priority.push(action.payload);
      }
    },
    setDateRange: (state, action: PayloadAction<{ start: Date | null; end: Date | null }>) => {
      state.dateRange = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    clearFilters: (state) => {
      state.status = [];
      state.priority = [];
      state.dateRange = { start: null, end: null };
      state.searchQuery = '';
      state.sortBy = 'eta';
      state.sortOrder = 'asc';
    },
    // NEW: Restore filters from localStorage
    restoreFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  toggleStatusFilter,
  togglePriorityFilter,
  setDateRange,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  clearFilters,
  restoreFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;