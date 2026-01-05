# 📦 Shipment Tracker

A real-time shipment tracking application with interactive map visualization, built with Next.js 14, Redux Toolkit, TypeScript, and Leaflet.

## 🚀 [Live Demo](https://track-go.vercel.app)



---

## ✨ Features

### Core Functionality
- **Real-time Tracking**: 50+ shipments updating every 5 seconds with smooth animations
- **Interactive Map**: Leaflet-based map with custom markers and route visualization
- **Advanced Filtering**: Multi-criteria filtering (status, priority, search)
- **Analytics Dashboard**: 6 interactive charts with Recharts showing delivery metrics
- **Notifications System**: Real-time alerts for status changes with read/unread management
- **Detailed Views**: Comprehensive shipment information with status history timeline

### Technical Features
- **State Management**: Redux Toolkit with normalized state pattern (6 slices)
- **Performance Optimized**: Bulk updates (250ms → 15ms), memoized selectors, React.memo
- **localStorage Persistence**: Auto-save filters, UI preferences, and selections
- **Dark Mode**: Full dark mode support with theme persistence
- **TypeScript**: 100% type-safe codebase
- **Responsive Design**: Mobile-friendly interface (planned)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4
- **Mapping**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Mock Data**: @faker-js/faker

### Architecture Patterns
- Normalized state with entity adapters
- Memoized selectors for performance
- Custom hooks for business logic
- Component composition
- Feature-based folder structure

---

## 🏗️ Architecture Highlights

### State Management
```
store/
├── slices/
│   ├── shipmentsSlice.ts      # Normalized entities
│   ├── filtersSlice.ts        # Filter state
│   ├── mapSlice.ts            # Map center, zoom, selection
│   ├── uiSlice.ts             # Sidebar, theme
│   ├── notificationsSlice.ts # Alert system
│   └── analyticsSlice.ts      # Computed metrics
└── selectors/
    ├── shipmentSelectors.ts   # Memoized filtering/sorting
    └── analyticsSelectors.ts  # Computed analytics
```

### Key Design Decisions

**1. Normalized State Pattern**
- Used `createEntityAdapter` for O(1) lookups
- Separated concerns across 6 Redux slices
- Prevents deeply nested state updates

**2. Performance Optimizations**
- **Bulk Updates**: `bulkUpdateShipments` updates 50+ shipments in 15ms
- **Memoized Selectors**: Reselect prevents unnecessary recalculations
- **React.memo**: Optimized shipment list items
- **Debounced Save**: localStorage writes max once per second

**3. Real-time Simulation**
- Interpolates positions between origin/destination
- Updates progress by 1% every 5 seconds
- Triggers notifications on status changes
- Auto-advances: in_transit → out_for_delivery → delivered

**4. Route Visualization**
- Dual polylines: solid (completed) + dashed (remaining)
- Color-coded by shipment status
- Visual emphasis on selected shipment
- Conditional rendering for performance

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Initial Load | < 2s |
| Bulk Update (50 shipments) | 15ms |
| Filter Application | < 50ms |
| Map Render | 60fps |
| localStorage Save | Debounced (1s) |

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/shipment-tracker.git
cd shipment-tracker

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Setup
No environment variables required - mock data is generated in-browser.

---

## 📁 Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── Map/               # Map components
│   │   ├── ShipmentMap.tsx
│   │   ├── ShipmentMarkers.tsx
│   │   ├── RouteLines.tsx
│   │   └── MapController.tsx
│   ├── Sidebar/           # Sidebar panels
│   │   ├── Sidebar.tsx
│   │   ├── ShipmentList.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── AnalyticsPanel.tsx
│   │   ├── NotificationsPanel.tsx
│   │   └── ShipmentDetails.tsx
│   └── ui/                # Reusable UI components
│       ├── Badge.tsx
│       ├── Button.tsx
│       └── Input.tsx
├── store/
│   ├── index.ts           # Store configuration
│   ├── slices/            # Redux slices
│   └── selectors/         # Memoized selectors
├── hooks/
│   ├── useShipmentUpdates.ts  # Real-time update logic
│   ├── useRestoreState.ts     # localStorage restoration
│   └── useTheme.ts            # Dark mode management
├── utils/
│   ├── mockData.ts        # Shipment generation
│   ├── routeCalculation.ts    # Distance/position math
│   ├── markerIcons.ts     # Custom Leaflet markers
│   └── localStorage.ts    # Persistence utilities
├── types/
│   └── shipment.ts        # TypeScript definitions
└── lib/
    └── constants.ts       # App-wide constants
```

---

## 🎯 Key Features Explained

### 1. Real-time Updates
```typescript
// useShipmentUpdates.ts
// Updates 50+ shipments every 5 seconds
// Calculates new positions via interpolation
// Dispatches bulk update to Redux
// Triggers notifications on status changes
```

### 2. Advanced Filtering
- **Multi-criteria**: Status + Priority + Search query
- **Memoized selector**: Only recalculates when dependencies change
- **Sort options**: ETA, Status, Priority, Customer, Created Date
- **Persisted**: Filters saved to localStorage

### 3. Analytics Dashboard
- **6 Chart Types**: Pie, Line, Bar (vertical/horizontal)
- **Key Metrics**: On-time rate, avg delivery time, revenue, active shipments
- **Computed Data**: Selector calculates analytics from shipment state
- **Real-time Updates**: Charts update as shipments move

### 4. Route Visualization
- **Solid Line**: Origin → Current location (completed route)
- **Dashed Line**: Current → Destination (remaining route)
- **Color-coded**: Matches shipment status
- **Interactive**: Click shipment to highlight route

---



## 🎓 What I Learned

### Technical Skills
- **Redux at Scale**: Managing complex state across 6 slices with normalized patterns
- **Performance Optimization**: Profiling, memoization, bulk updates
- **TypeScript Patterns**: Discriminated unions, generic components, type guards
- **Real-time Simulation**: Interpolation math, interval management, state transitions

### Architecture Decisions
- **Why Redux over Context**: Better DevTools, middleware, memoized selectors
- **Why Normalized State**: O(1) lookups, avoids nested updates, easier updates
- **Why Memoization**: Prevents expensive recalculations on every render
- **Why Feature-based Structure**: Scales better than type-based (components/, utils/)

### Problem-Solving
- **Challenge**: Updating 50 shipments caused lag
  - **Solution**: `bulkUpdateShipments` with single dispatch (250ms → 15ms)
- **Challenge**: Filters recalculating on every render
  - **Solution**: Memoized selectors with proper dependency arrays
- **Challenge**: localStorage causing circular dependencies
  - **Solution**: Action-based restoration instead of preloadedState

---

## 🚧 Future Enhancements

- [ ] Mobile responsive design
- [ ] Export to CSV
- [ ] Keyboard shortcuts (ESC, Ctrl+F, arrows)
- [ ] WebSocket integration for real backend
- [ ] User authentication
- [ ] Multi-tenant support
- [ ] Advanced analytics (heatmaps, predictive ETA)
- [ ] Notification preferences

---

## 📝 Development Notes

### Running Tests
```bash
npm run test        # Run tests (if implemented)
npm run test:watch  # Watch mode
```

### Building for Production
```bash
npm run build       # Create optimized build
npm run start       # Start production server
```

### Linting
```bash
npm run lint        # Run ESLint
```

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for learning or portfolio purposes.

---

## 👨‍💻 Author

**Dylan Giddens**
- Portfolio: [dylangiddenswebdesign.com](https://www.dylangiddenswebdesign.com)
- LinkedIn: [linkedin.com/in/dylan-p-giddens(https://linkedin.com/in/dylan-p-giddens)
- GitHub: [@katzMotel](https://github.com/katzMotel)

---

## 🙏 Acknowledgments

- Inspired by modern logistics tracking systems (FedEx, UPS)
- Map tiles from OpenStreetMap


---

**⭐ If you found this project helpful, please give it a star!**