import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SidebarPanel = 'list' | 'filters' | 'details' | 'analytics' | 'notifications';
export type Theme = 'light' | 'dark';

interface UIState {
  sidebarOpen: boolean;
  sidebarPanel: SidebarPanel;
  theme: Theme;
  modals: {
    addShipment: boolean;
    editShipment: boolean;
  };
  notificationsPanelOpen: boolean;
  fullscreen: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarPanel: 'list',
  theme: 'light',
  modals: {
    addShipment: false,
    editShipment: false,
  },
  notificationsPanelOpen: false,
  fullscreen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSidebarPanel: (state, action: PayloadAction<SidebarPanel>) => {
      state.sidebarPanel = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    toggleNotificationsPanel: (state) => {
      state.notificationsPanelOpen = !state.notificationsPanelOpen;
    },
    toggleFullscreen: (state) => {
      state.fullscreen = !state.fullscreen;
    },
    // NEW: Restore UI state from localStorage
    restoreUI: (state, action: PayloadAction<Partial<UIState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSidebarPanel,
  setTheme,
  toggleModal,
  toggleNotificationsPanel,
  toggleFullscreen,
  restoreUI,
} = uiSlice.actions;

export default uiSlice.reducer;