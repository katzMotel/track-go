import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SidebarPanel = 'list' | 'details' | 'analytics' | 'filters';
type ModalType = 'add-shipment' | 'edit-shipment' | 'delete-confirm' | null;
type Theme = 'light' | 'dark' | 'system';

interface UIState {
  sidebarOpen: boolean;
  sidebarPanel: SidebarPanel;
  sidebarWidth: number; // px
  modalOpen: ModalType;
  modalData: any; // Data for the active modal
  theme: Theme;
  notificationsPanelOpen: boolean;
  mapControlsVisible: boolean;
  isFullscreen: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarPanel: 'list',
  sidebarWidth: 384, // Default 384px (Tailwind w-96)
  modalOpen: null,
  modalData: null,
  theme: 'light',
  notificationsPanelOpen: false,
  mapControlsVisible: true,
  isFullscreen: false,
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
      // Auto-open sidebar when changing panels
      if (!state.sidebarOpen) {
        state.sidebarOpen = true;
      }
    },

    setSidebarWidth: (state, action: PayloadAction<number>) => {
      // Clamp between 300px and 600px
      state.sidebarWidth = Math.max(300, Math.min(600, action.payload));
    },

    openModal: (state, action: PayloadAction<{ type: ModalType; data?: any }>) => {
      state.modalOpen = action.payload.type;
      state.modalData = action.payload.data || null;
    },

    closeModal: (state) => {
      state.modalOpen = null;
      state.modalData = null;
    },

    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    toggleNotificationsPanel: (state) => {
      state.notificationsPanelOpen = !state.notificationsPanelOpen;
    },

    setNotificationsPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.notificationsPanelOpen = action.payload;
    },

    toggleMapControls: (state) => {
      state.mapControlsVisible = !state.mapControlsVisible;
    },

    setMapControlsVisible: (state, action: PayloadAction<boolean>) => {
      state.mapControlsVisible = action.payload;
    },

    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },

    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },

    resetUI: () => initialState,
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSidebarPanel,
  setSidebarWidth,
  openModal,
  closeModal,
  setTheme,
  toggleTheme,
  toggleNotificationsPanel,
  setNotificationsPanelOpen,
  toggleMapControls,
  setMapControlsVisible,
  toggleFullscreen,
  setFullscreen,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;