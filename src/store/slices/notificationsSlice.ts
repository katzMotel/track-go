import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  shipmentId: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPayload {
  shipmentId: string;
  type: string;
  title: string;
  message: string;
  timestamp?: string; // Optional
}

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
    addNotification: (state, action: PayloadAction<NotificationPayload>) => {
      const notification: Notification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        shipmentId: action.payload.shipmentId,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        timestamp: action.payload.timestamp || new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
      state.unreadCount++;
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAsUnread: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && notification.read) {
        notification.read = false;
        state.unreadCount++;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index > -1) {
        const wasUnread = !state.notifications[index].read;
        state.notifications.splice(index, 1);
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;