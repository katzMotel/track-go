const STORAGE_KEY = 'shipment-tracker-state';
const STORAGE_VERSION = 1;

interface PersistedState {
  version: number;
  timestamp: number;
  state: {
    filters?: any;
    ui?: any;
    map?: any;
  };
}

/**
 * Load state from localStorage
 */
export function loadState(): any {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    
    if (!serializedState) {
      return undefined;
    }

    const persistedState: PersistedState = JSON.parse(serializedState);

    // Check version compatibility
    if (persistedState.version !== STORAGE_VERSION) {
      console.log('Storage version mismatch, clearing old state');
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }

    // Check if state is stale (older than 7 days)
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - persistedState.timestamp > sevenDaysInMs) {
      console.log('Stored state is stale, clearing');
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }

    console.log('Loaded state from localStorage');
    return persistedState.state;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
}

/**
 * Save state to localStorage
 * @param state - The full Redux state
 */
export function saveState(state: any): void {
  try {
    // Only persist specific slices
    const stateToPersist: PersistedState = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      state: {
        filters: state.filters,
        ui: {
          sidebarOpen: state.ui?.sidebarOpen,
          sidebarPanel: state.ui?.sidebarPanel,
          theme: state.ui?.theme,
        },
        map: {
          selectedShipmentId: state.map?.selectedShipmentId,
          zoom: state.map?.zoom,
        },
      },
    };

    const serializedState = JSON.stringify(stateToPersist);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    // Handle quota exceeded or other errors
    if (err instanceof Error && err.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
    } else {
      console.error('Error saving state to localStorage:', err);
    }
  }
}

/**
 * Clear persisted state
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared persisted state');
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}