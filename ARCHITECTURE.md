# TOUCHDOWN — ARCHITECTURE.md

## Overview
Touchdown is a **local-first mobile utility** designed to help users recall personal relationships by city and reconnect at the right moment.

The system is intentionally minimal, privacy-first, and offline-capable.

---

## High-Level Architecture

- Mobile-only application
- Local SQLite database
- No required backend
- Optional encrypted sync (future)

---

## Frontend Architecture

### Framework
- Expo React Native
- TypeScript

### State Management
- Zustand or React Context
- Local state mirrors SQLite

### Navigation
- Bottom tab navigation:
  - Home
  - Cities
  - People
  - Trips
  - Settings

Cities is the primary tab.

---

## Data Layer

### Storage
- SQLite (Expo SQLite)
- Tables:
  - people
  - cities
  - contact_methods
  - trips

### Data Flow
UI → State → SQLite
SQLite → State → UI

No server dependency.

---

## Models

### Person
Represents a real-world individual the user knows.

Key traits:
- Stored locally
- Indexed by city
- Multiple contact methods

### City
Lightweight grouping object.
Used only for indexing and display.

### ContactMethod
Represents a way to reach a person.
Includes platform-specific deep links.

### Trip
Used to surface people by timing.
Manual-only in MVP.

---

## Deep Linking Strategy

Touchdown does not send messages.
It opens the user’s existing apps.

Examples:
- SMS: sms:number
- WhatsApp: https://wa.me/number
- Instagram: instagram://user?username=handle
- Fallback to web if app not installed

---

## Capture Architecture

### Entry Points
- Quick Add
- Share Sheet (URL/Text)
- Manual Add

### Inbox Pattern
Incomplete records are allowed.
They appear in Inbox until resolved.

---

## Privacy & Security

- All data stored locally by default
- No analytics on content
- No scraping
- No background surveillance

Optional future sync:
- Client-side encryption
- Opaque blob storage
- Zero server-side inspection

---

## Scaling Characteristics

- Linear scaling
- Storage-heavy, compute-light
- Predictable costs
- No real-time services

---

## Non-Goals (Explicit)

- No AI
- No messaging
- No feeds
- No public profiles
- No discovery

---

## Design Philosophy

Touchdown is:
- A memory aid
- A timing assistant
- A launcher, not a platform

If a feature does not:
- improve recall
- improve timing
- reduce capture friction

It does not belong.

---

## End
This architecture is intentionally frozen for MVP.
