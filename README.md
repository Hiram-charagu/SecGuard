# Secguard - Device Intelligence & Security Platform

Secguard is being structured as a production-style device intelligence and security platform for phone-selling companies. It includes a public website, authenticated web dashboard, ERP integration layer, fraud detection workflows, and future mobile device protection app.

## Quick Start

1. Run `npm install` in the project folder.
2. Start the local API server with `npm start`.
3. Open `http://localhost:3000` in your browser.
4. Use the public website pages to review the platform structure.
5. Open `http://localhost:3000/login.html` and enter any email/password to access the demo dashboard.

## File Structure

```
├── index.html                 # Public landing page
├── about.html                 # About Secguard
├── features.html              # Services and platform modules
├── security.html              # Security and privacy model
├── pricing.html               # Subscription structure
├── contact.html               # Contact form
├── demo-request.html          # Demo/onboarding request form
├── login.html                 # Auth entry for the web platform
├── dashboard.html             # Main authenticated dashboard demo
├── device-intelligence.html   # Device tracking and IMEI management
├── fraud.html                 # Fraud detection center
├── tracking.html              # Live device tracking
├── customer.html              # Customer protection portal
├── analytics.html             # Security analytics
├── audit-logs.html            # System audit logs
├── settings.html              # Configuration and settings
├── css/
│   ├── base.css               # Shared variables, reset, buttons, and forms
│   ├── website.css            # Public website and landing-page styles
│   └── platform.css           # Authenticated dashboard styles
├── js/
│   ├── website.js             # Public website navigation and form behavior
│   ├── platform.js            # Authenticated platform rendering
│   └── data-service.js        # Browser-side API integration layer
├── mock-data.js               # Server-side ERP simulation data
├── server.js                  # Local API and static file server
├── package.json               # Node server dependencies and start script
└── ARCHITECTURE.md            # System architecture notes
```

## Current Build Direction

The project is now split into two frontend surfaces:

- Public website: landing page, About, Services, Security, Pricing, Contact, and Demo Request.
- Authenticated platform: dashboard, device intelligence, fraud detection, tracking, customer protection, analytics, audit logs, and settings.

This keeps the marketing/onboarding layer separate from the operational dashboard, which makes future debugging cleaner.

## Planned Production Backend

The production backend should use Supabase as the first real foundation:

- Supabase Auth for users and sessions
- PostgreSQL for ERP/security data
- Row-Level Security for tenant, branch, role, and customer isolation
- Realtime subscriptions for alerts and dashboard updates
- Storage for receipts, warranty files, and investigation evidence
- Edge Functions for ERP webhooks, telemetry ingestion, and fraud rules

## Data Architecture

### Mock Data Service (`mock-data.js`)

The application uses a browser-side `DataManager` class and a local API server to simulate ERP data. This is now a real project structure with:

- `server.js` serving the site and ERP-style API endpoints
- `data-service.js` as the browser API integration layer
- `mock-data.js` as server-side ERP simulation data

The service layer is designed so you can swap the mock backend for a real MAPPHEX API by updating `data-service.js` to use `mapphexBaseUrl`.

**Key Classes:**
- `DataManager`: Manages data retrieval, filtering, and formatting

**Available Methods:**
```javascript
// Get devices with optional filters
dataManager.getDevices(filter = {})

// Get fraud alerts
dataManager.getFraudAlerts(filter = {})

// Get branches
dataManager.getBranches()

// Get dashboard metrics
dataManager.getDashboardMetrics()

// Get customers
dataManager.getCustomers()

// Update/Add devices (for future API integration)
dataManager.updateDevice(deviceId, updates)
dataManager.addDevice(deviceData)

// Utility functions
dataManager.formatIMEI(imei)
dataManager.getRiskLevel(score)
dataManager.formatDate(date)
```

### Data Structures

#### Devices
```javascript
{
  id: 'device_001',
  imei: '352009127765042',
  model: 'Orion X5',
  brand: 'TechVision',
  erp_status: 'unsold',              // From ERP
  activation_status: 'active',       // Live status
  branch: 'branch_delta',
  sim_changes: 1,
  last_sim_change: 1,                // minutes ago
  erp_sync_status: 'desynced',
  risk_score: 92,
  customer: null,
  warranty: null,
  timestamp: Date
}
```

#### Branches
```javascript
{
  id: 'branch_alpha',
  name: 'Branch Alpha',
  location: 'North Hub',
  city: 'City A',
  staff: 18,
  devices: 1240,
  alerts: 14,
  status: 'active'
}
```

#### Fraud Alerts
```javascript
{
  id: 'alert_001',
  type: 'unsold-active',
  severity: 'critical',              // low, medium, high, critical
  device_id: 'device_001',
  description: 'Unexpected activation after unsold ERP status',
  branch: 'branch_delta',
  devices_affected: 4,
  status: 'open',
  created_at: Date
}
```

#### Customers
```javascript
{
  id: 'cust_001',
  name: 'Alicia Nguyen',
  email: 'alicia.nguyen@email.com',
  phone: '+1-555-0121',
  devices: ['device_005'],
  protection_status: 'active',
  theft_reports: 0,
  recovery_progress: 100
}
```

#### Investigations
```javascript
{
  id: 'inv_001',
  case_number: 'FT-290',
  device_id: 'device_001',
  type: 'SIM anomaly',
  status: 'ready-for-closure',
  analyst: 'R. Coleman',
  updated_at: Date
}
```

## Dynamic Data Rendering

All pages automatically load and render data from the mock data service. The rendering functions are in `app.js`:

- `renderDashboardKPIs()` - Dashboard metrics
- `renderDeviceIntelligence()` - Device cards and table
- `renderFraudDetection()` - Fraud alerts and cases
- `renderCustomerPortal()` - Protected devices
- `renderTrackingPage()` - Live tracking KPIs
- `renderAuditLogs()` - System audit entries
- `renderAnalyticsPage()` - Analytics KPIs

## Integrating with MAPPHEX ERP

To connect to the real ERP system:

1. **Update `mock-data.js`** - Replace the static data with API calls:

```javascript
// Example: Fetch devices from MAPPHEX API
async getDevices(filter = {}) {
  const response = await fetch('https://api.mapphex.io/devices', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}
```

2. **Authentication** - Add MAPPHEX credentials to settings

3. **Real-time Sync** - Use MAPPHEX webhooks or polling for live updates

## Design System

### Colors
- **Primary**: `#5b87ff` (Blue)
- **Secondary**: `#73f3e8` (Cyan)
- **Accent**: `#d950ff` (Purple)
- **Danger**: `#ff5d8f` (Red)
- **Success**: `#35d48a` (Green)
- **Background**: `#05070f` (Dark)

### Typography
- Font: Inter (system-ui fallback)
- Base size: 16px
- Scale: 0.8 → 2.2rem

## System Architecture

For a complete ERP + phone security and tracking system structure, see `ARCHITECTURE.md`.

### Components
- Cards with glassmorphism effect
- Smooth animations with CSS transitions
- Responsive grid layout
- Dark mode with glow effects
- Sentiment-driven badges (low, medium, high, critical)

## Features Implemented

✅ Login page with authentication flow
✅ Dynamic dashboard with real data rendering and simulated live updates
✅ Device intelligence tracking with reactive ERP metrics
✅ Fraud detection center
✅ Live tracking interface with mocked telemetry feeds
✅ Customer protection portal
✅ Security analytics with Chart.js
✅ Audit log tracking
✅ System settings
✅ Responsive design (mobile, tablet, desktop)
✅ Clean data architecture for ERP integration
✅ Mock data service for realistic simulation

## Future Enhancements

- [ ] Real MAPPHEX ERP API integration
- [ ] Firebase authentication
- [ ] Real-time WebSocket updates
- [ ] Advanced mapping
- [ ] Export functionality
- [ ] Custom reporting
- [ ] Machine learning fraud scoring
- [ ] Mobile app version

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Secguard Enterprise Platform
