'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { markAsRead, markAsUnread, clearAllNotifications, deleteNotification } from '@/store/slices/notificationsSlice';
import { selectShipment, focusOnShipment } from '@/store/slices/mapSlice';
import { setSidebarPanel } from '@/store/slices/uiSlice';
import { SHIPMENT_STATUSES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

export default function NotificationsPanel() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications.notifications);
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);
  const shipments = useAppSelector(state => state.shipments.shipments);

  // Helper to safely format timestamp
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      return format(date, 'MMM d, h:mm a');
    } catch (error) {
      return 'Just now';
    }
  };

  const handleNotificationClick = (shipmentId: string) => {
    // Select the shipment
    dispatch(selectShipment(shipmentId));
    
    // Focus map on shipment
    const shipment = shipments[shipmentId];
    if (shipment) {
      dispatch(focusOnShipment({
        center: [shipment.currentLocation.lat, shipment.currentLocation.lng],
        zoom: 10,
      }));
    }
    
    // Switch to details panel
    dispatch(setSidebarPanel('details'));
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAsUnread = (id: string) => {
    dispatch(markAsUnread(id));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
  };

  const handleClearAll = () => {
    if (confirm('Clear all notifications?')) {
      dispatch(clearAllNotifications());
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'out_for_delivery':
        return 'warning';
      case 'delayed':
        return 'danger';
      case 'in_transit':
        return 'primary';
      default:
        return 'default';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p className="text-sm text-center font-medium">No notifications</p>
        <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="primary" size="sm">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`
              border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer
              ${!notification.read ? 'bg-blue-50' : ''}
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                )}
                <button
                  onClick={() => handleNotificationClick(notification.shipmentId)}
                  className="text-left flex-1 min-w-0"
                >
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {notification.title}
                  </p>
                </button>
              </div>
              
              {/* Actions Menu */}
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => notification.read ? handleMarkAsUnread(notification.id) : handleMarkAsRead(notification.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title={notification.read ? 'Mark as unread' : 'Mark as read'}
                >
                  {notification.read ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              onClick={() => handleNotificationClick(notification.shipmentId)}
              className="text-left w-full"
            >
              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant={getStatusBadgeVariant(notification.type)} size="sm">
                  {SHIPMENT_STATUSES[notification.type as keyof typeof SHIPMENT_STATUSES]?.label || notification.type}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(notification.timestamp)}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
