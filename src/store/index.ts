import { configureStore } from '@reduxjs/toolkit';
import shipmentsReducer from './slices/shipmentsSlice';
import mapReducer from './slices/mapSlice';
import filtersReducer from './slices/filtersSlice';
import uiReducer from './slices/uiSlice';
import analyticsReducer from './slices/analyticsSlice';
import notificationsReducer from './slices/notificationsSlice';
import { saveState, isLocalStorageAvailable } from '@/utils/localStorage';
import { debounce } from '@/utils/debounce';

export const store = configureStore({
  reducer: {
    shipments: shipmentsReducer,
    map: mapReducer,
    filters: filtersReducer,
    ui: uiReducer,
    analytics: analyticsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'shipments/fetchShipments/fulfilled',
          'shipments/addShipment',
          'shipments/updateShipment',
          'shipments/bulkUpdateShipments',
          'notifications/addNotification',
        ],
        ignoredActionPaths: [
          'payload.estimatedDelivery',
          'payload.actualDelivery',
          'payload.createdAt',
          'payload.updatedAt',
          'payload.statusHistory',
          'payload.timestamp',
          'meta.arg',
        ],
        ignoredPaths: [
          'shipments.shipments',
          'notifications.notifications',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Subscribe to store changes and save to localStorage (debounced)
if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
  const debouncedSave = debounce(() => {
    saveState(store.getState());
  }, 1000);

  store.subscribe(() => {
    debouncedSave();
  });
}