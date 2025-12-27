import { configureStore } from '@reduxjs/toolkit';
import shipmentsReducer from './slices/shipmentsSlice';
import mapReducer from '@/store/slices/mapSlice';
import filtersReducer from '@/store/slices/filtersSlice';
import uiReducer from '@/store/slices/uiSlice';
import analyticsReducer from '@/store/slices/analyticsSlice';
import notificationsReducer from '@/store/slices/notificationsSlice';

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
        // Ignore these action types for Date objects
        ignoredActions: ['shipments/addShipment', 'shipments/updateShipment'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.estimatedDelivery', 'payload.createdAt'],
        // Ignore these paths in the state
        ignoredPaths: ['shipments.shipments'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;