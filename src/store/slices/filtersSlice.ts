import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ShipmentStatus, Priority } from '@/types/shipment';

type SortBy = 'eta' | 'status' | 'priority' | 'customer' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface FiltersState {
  status: ShipmentStatus[];
  priority: Priority[];
  dateRange: {
    start: string | null; // ISO string for serialization
    end: string | null;
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
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<ShipmentStatus[]>) => {
      state.status = action.payload;
    },

    toggleStatusFilter: (state, action: PayloadAction<ShipmentStatus>) => {
      const status = action.payload;
      const index = state.status.indexOf(status);
      if (index > -1) {
        state.status.splice(index, 1);
      } else {
        state.status.push(status);
      }
    },

    setPriorityFilter: (state, action: PayloadAction<Priority[]>) => {
      state.priority = action.payload;
    },

    togglePriorityFilter: (state, action: PayloadAction<Priority>) => {
      const priority = action.payload;
      const index = state.priority.indexOf(priority);
      if (index > -1) {
        state.priority.splice(index, 1);
      } else {
        state.priority.push(priority);
      }
    },

    setDateRange: (state, action: PayloadAction<{ start: string | null; end: string | null }>) => {
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

    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },

    setSorting: (state, action: PayloadAction<{ sortBy: SortBy; sortOrder: SortOrder }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },

    clearFilters: (state) => {
      state.status = [];
      state.priority = [];
      state.dateRange = { start: null, end: null };
      state.searchQuery = '';
    },

    clearAllFiltersAndSort: () => initialState,
  },
});

export const {
  setStatusFilter,
  toggleStatusFilter,
  setPriorityFilter,
  togglePriorityFilter,
  setDateRange,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  toggleSortOrder,
  setSorting,
  clearFilters,
  clearAllFiltersAndSort,
} = filtersSlice.actions;

export default filtersSlice.reducer;