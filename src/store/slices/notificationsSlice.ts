import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '@/types/shipment';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        read: false,
      };
      state.notifications.unshift(notification); // Add to front
      state.unreadCount++;
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount--;
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index > -1) {
        const wasUnread = !state.notifications[index].read;
        state.notifications.splice(index, 1);
        if (wasUnread) {
          state.unreadCount--;
        }
      }
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    clearReadNotifications: (state) => {
      state.notifications = state.notifications.filter(n => !n.read);
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  clearReadNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;