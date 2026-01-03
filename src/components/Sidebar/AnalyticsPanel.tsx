'use client';

import { useAppSelector } from '@/store/hooks';
import { selectCalculatedAnalytics } from '@/store/selectors/analyticsSelectors';
import { SHIPMENT_STATUSES, PRIORITIES } from '@/lib/constants';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPanel() {
  const analytics = useAppSelector(selectCalculatedAnalytics);
  const shipments = useAppSelector(state => Object.values(state.shipments.shipments));

  // Status distribution data
  const statusData = Object.entries(analytics.statusCounts).map(([status, count]) => ({
    name: SHIPMENT_STATUSES[status as keyof typeof SHIPMENT_STATUSES].label,
    value: count,
    color: SHIPMENT_STATUSES[status as keyof typeof SHIPMENT_STATUSES].color,
  }));

  // Priority distribution data
  const priorityData = Object.entries(analytics.priorityCounts).map(([priority, count]) => ({
    name: PRIORITIES[priority as keyof typeof PRIORITIES].label,
    count,
  }));

  // Revenue by priority data
  const revenueData = Object.entries(analytics.revenueByPriority).map(([priority, revenue]) => ({
    name: PRIORITIES[priority as keyof typeof PRIORITIES].label,
    revenue: Math.round(revenue),
  }));

  // Delivery trend data (last 7 days simulated)
  const trendData = [
    { day: 'Mon', delivered: 8, delayed: 2, inTransit: 15 },
    { day: 'Tue', delivered: 12, delayed: 1, inTransit: 13 },
    { day: 'Wed', delivered: 10, delayed: 3, inTransit: 14 },
    { day: 'Thu', delivered: 15, delayed: 1, inTransit: 10 },
    { day: 'Fri', delivered: 13, delayed: 2, inTransit: 12 },
    { day: 'Sat', delivered: 9, delayed: 1, inTransit: 16 },
    { day: 'Today', delivered: analytics.statusCounts.delivered || 0, delayed: analytics.statusCounts.delayed || 0, inTransit: analytics.statusCounts.in_transit || 0 },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Key Metrics */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-xs text-blue-700 font-medium">On-Time Rate</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {analytics.onTimeDeliveryRate.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-xs text-green-700 font-medium">Avg Delivery</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {analytics.averageDeliveryTime.toFixed(1)}h
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-xs text-purple-700 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              ${(analytics.totalRevenue / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <p className="text-xs text-orange-700 font-medium">Active Now</p>
            <p className="text-2xl font-bold text-orange-900 mt-1">
              {(analytics.statusCounts.in_transit || 0) + (analytics.statusCounts.out_for_delivery || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Status Distribution</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  const percent = entry.percent;
                  if (percent === undefined) return '';
                  return `${entry.name}: ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Delivery Trend */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-3">7-Day Delivery Trend</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} name="Delivered" />
              <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} name="Delayed" />
              <Line type="monotone" dataKey="inTransit" stroke="#3b82f6" strokeWidth={2} name="In Transit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Shipments by Priority</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by Priority */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Revenue by Priority</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Summary Statistics</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Shipments</span>
            <span className="font-semibold text-gray-900">{shipments.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivered</span>
            <span className="font-semibold text-green-600">{analytics.statusCounts.delivered || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">In Transit</span>
            <span className="font-semibold text-blue-600">{analytics.statusCounts.in_transit || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Out for Delivery</span>
            <span className="font-semibold text-orange-600">{analytics.statusCounts.out_for_delivery || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delayed</span>
            <span className="font-semibold text-red-600">{analytics.statusCounts.delayed || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending</span>
            <span className="font-semibold text-gray-600">{analytics.statusCounts.pending || 0}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600 font-medium">Avg Revenue/Shipment</span>
            <span className="font-semibold text-gray-900">
              ${shipments.length > 0 ? (analytics.totalRevenue / shipments.length).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}