import { configureStore } from '@reduxjs/toolkit';
import shipmentsReducer from './slices/shipmentsSlice';
import mapReducer from './slices/mapSlice';
import filtersReducer from './slices/filtersSlice';
import uiReducer from './slices/uiSlice';
import analyticsReducer from './slices/analyticsSlice';
import notificationsReducer from './slices/notificationsSlice';

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
        // Ignore these action types
        ignoredActions: [
          'shipments/fetchShipments/fulfilled',
          'shipments/addShipment',
          'shipments/updateShipment',
          'shipments/bulkUpdateShipments',
          'notifications/addNotification',
        ],
        // Ignore these paths in all actions
        ignoredActionPaths: [
          'payload.estimatedDelivery',
          'payload.actualDelivery',
          'payload.createdAt',
          'payload.updatedAt',
          'payload.statusHistory',
          'payload.timestamp',
          'meta.arg',
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'shipments.shipments',
          'notifications.notifications',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;