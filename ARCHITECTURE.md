# Secguard ERP + Phone Security Ecosystem

## 1. System Overview

This architecture extends the existing ERP core system with a comprehensive phone security and tracking ecosystem. The goal is to provide a unified enterprise platform for device lifecycle management, loss/theft monitoring, fraud detection, customer protection, and operational visibility.

```
                    ┌─────────────────────┐
                    │     SUPER ADMIN     │
                    └──────────┬──────────┘
                               │
               ┌───────────────┴────────────────┐
               │                                │
      ┌────────▼────────┐             ┌────────▼────────┐
      │ ERP CORE SYSTEM │             │ SECURITY ENGINE │
      └────────┬────────┘             └────────┬────────┘
               │                               │
   ┌───────────┼───────────┐         ┌─────────┼──────────┐
   │           │           │         │         │          │
Inventory   Sales      Staff Mgmt  Tracking  Fraud AI  Recovery
 Module     Module       Module     Module    Module    Module
```

## 2. High-Level Modules

### 2.1 ERP Core Module

Purpose: Manage branches, employees, inventory, sales, customers, and suppliers.

Submodules:
- Dashboard: total devices, sold phones, missing devices, flagged devices, branch analytics.
- Inventory Management: stock, IMEI, serial numbers, warehouses, transfers.
- Sales Management: receipts, invoices, customers, warranties, installments.
- Staff Management: employees, actions, permissions, suspicious activities.

### 2.2 Device Registry Module

Purpose: The core authoritative device record for every phone.

Primary table: `devices`

Fields:
- `device_id`
- `imei1`
- `imei2`
- `serial_number`
- `brand`
- `model`
- `ram`
- `storage`
- `color`
- `branch_id`
- `supplier_id`
- `current_status`
- `date_added`
- `warranty_period`
- `customer_id`
- `erp_status`
- `activation_status`
- `blacklist_reason`

Status types:
- In Stock
- Reserved
- Sold
- Returned
- Missing
- Blacklisted
- Under Investigation
- Recovered

### 2.3 Tracking Engine

Purpose: Collect device telemetry from mobile apps and correlate it with ERP and customer records.

Tracking data storage: `tracking_logs`

Fields:
- `tracking_id`
- `device_id`
- `latitude`
- `longitude`
- `ip_address`
- `sim_serial`
- `carrier`
- `device_battery`
- `timestamp`
- `network_type`
- `device_status`
- `location_source`

Tracking methods:
- GPS Tracking: primary location source.
- WiFi Triangulation: fallback when GPS is unavailable.
- IP Logging: secondary metadata and geolocation.
- SIM Detection: identify SIM swaps and changes.

### 2.4 Fraud Detection Module

Purpose: Detect illegal business activity and ERP-device mismatches.

Detection rules:
- Rule 1: If phone active = true and ERP status = unsold, flag device.
- Rule 2: If receipt exists but sale not recorded, flag staff.
- Rule 3: If IMEI appears twice, possible fraud.

Dashboard:
- suspicious employees
- unauthorized sales
- stock inconsistencies
- unusual device movement

### 2.5 Customer Security Module

Purpose: Customer-facing protection and theft reporting.

Features:
- Register Device: link phone, account, warranty, emergency contacts.
- Theft Reporting: customers report stolen devices, flag records, enable monitoring.
- Live Tracking: last location, last online time, SIM status.
- Remote Protection: lock account, logout sessions, show warning message.
- Avoid dangerous or invasive device controls.

### 2.6 Mobile Applications

Need two mobile apps:

APP 1 — Company Staff App
- Scan IMEI
- Register devices
- Verify sales
- Stock transfer
- Fraud alerts
- Customer registration

APP 2 — Customer Security App
- Device protection
- Theft reporting
- Location sharing
- SIM change alerts
- Last seen device
- Warranty details

### 2.7 Admin Panel Structure

Sidebar:
- Dashboard
- Inventory
  - All Devices
  - Add Device
  - Transfers
  - Missing Devices
- Sales
  - New Sale
  - Receipts
  - Warranties
  - Customers
- Tracking
  - Live Devices
  - Device History
  - SIM Changes
  - Location Logs
- Fraud Detection
  - Alerts
  - Investigations
  - Suspicious Staff
  - Fraud Reports
- Customers
  - Subscribers
  - Theft Cases
  - Recovery Requests
- Settings
  - Roles
  - Branches
  - Security Policies
  - API Keys

### 2.8 User Roles

- Super Admin: controls entire ecosystem, companies, subscriptions, analytics.
- Company Admin: controls branch data, inventory, staff.
- Security Officer: investigates fraud, monitors stolen phones.
- Sales Staff: registers sales, activates warranties.
- Customer: tracks own device, reports theft.

## 3. System Security Structure

Important security requirements:

Authentication:
- JWT tokens
- Refresh tokens
- MFA for admins

Permissions:
- Role-Based Access Control (RBAC)

Audit logs:
- `audit_logs`
  - `audit_id`
  - `user_id`
  - `action`
  - `timestamp`
  - `device`
  - `ip_address`
  - `branch_id`
  - `resource_type`
  - `resource_id`

Encryption:
- Encrypt tracking data and personal information at rest.
- Protect authentication tokens and sensitive API secrets.

## 4. Database Architecture

Primary databases:

- PostgreSQL: ERP data, users, inventory, sales, branches, staff, customers, audit logs.
- MongoDB: tracking logs, real-time telemetry, device history.
- Redis: caching, live sessions, real-time alerts, temporary state.

Example schema:

PostgreSQL tables:
- `users`
- `roles`
- `branches`
- `suppliers`
- `devices`
- `inventory_movements`
- `sales`
- `receipts`
- `warranties`
- `customers`
- `audit_logs`
- `fraud_cases`
- `theft_reports`

MongoDB collections:
- `tracking_logs`
- `device_telemetry`
- `stolen_device_events`
- `alert_notifications`

Redis data:
- active session store
- live device status cache
- recent alert stream
- temporary OTP/MFA state

## 5. Real-Time System

Real-time needs:
- live tracking of device location and status
- fraud alerts pushed to staff/security dashboard
- customer theft notifications and updates
- inventory sync warnings from ERP

Recommended architecture:
- WebSocket / socket.io or SignalR for live UI updates
- Pub/Sub event bus for telemetry and alerts
- Redis streams or message queue for fast alert distribution
- Background workers for fraud rule evaluation and recovery workflows

## 6. Integration Notes

Because the ERP core is already built, focus on these integration touchpoints:

- Device registry sync: keep `devices` linked between ERP inventory and security engine.
- Sales lifecycle: attach warranties, customer protection, and theft status to sold device records.
- Staff actions: audit sales registrations, transfers, and suspicious device flags.
- Tracking ingest: accept telemetry from mobile apps and update device 
  records in real time.
- Fraud process: generate alerts into `fraud_alerts` and surface them on dashboards.
- Customer portal: expose only customer-owned device data with strict RBAC and privacy controls.

## 7. Recommended Implementation Roadmap

1. Build the Device Registry module as the canonical phone record.
2. Add Tracking Engine ingestion endpoints and mapping to devices.
3. Implement Fraud Detection rules and alert dashboard.
4. Create Customer Security workflows and customer app APIs.
5. Add RBAC, audit logging, and admin security policies.
6. Integrate live telemetry and alert push notifications.
7. Expand the web admin panel with tracking, fraud, and customer sections.

## 8. Alignment with Existing Project

This document is designed to extend the existing `Secguard` platform from a security dashboard into a fully integrated ERP phone security ecosystem. The existing ERP-style mock backend and UI should be mapped into these modules so the final system supports both enterprise device control and customer-facing protection.