```md
# Maniesta Suite

Academic Productivity Dashboard System

A modern, frontend-first academic tools platform built for students to calculate, convert, export, and track their academic performance in one unified dashboard experience.

Built with React 19, Vite, Tailwind CSS, Framer Motion, Firebase, EmailJS, and a local-first data architecture.

---

## Overview

Maniesta Suite is a modular academic productivity system that replaces scattered student tools with a single unified interface.

It combines calculators, converters, exports, and analytics into a dashboard-driven experience without requiring authentication or backend complexity.

---

## Core Capabilities

### Academic Tools

- GPA Calculator with real-time grade computation
- CGPA Calculator with multi-semester tracking
- Scientific and standard calculator with history support
- Unit conversion across multiple categories
- Interest calculator including EMI and compound interest

### Financial Utility

- Live currency converter with exchange rate caching
- 150+ currency support
- Offline fallback using cached rates

### Export System

- PDF report generation for GPA and CGPA
- CSV export for structured academic data
- Export history tracking in dashboard

### Dashboard System

- Local-first analytics using localStorage
- Recent activity tracking
- Favorite tools system
- Last calculation memory (GPA, currency, exports)
- Quick action navigation

### Contact System

- EmailJS-powered contact form
- Direct message delivery without backend server

---

## System Architecture

### Frontend Architecture
```

UI Layer
↓
Hooks Layer
↓
Services Layer
↓
Firebase / EmailJS / localStorage
↓
Utilities Layer (pure functions)

```

---

## Project Structure

```

src/
├── components/
│ ├── dashboard/
│ │ ├── widgets/
│ │ ├── DashboardLayout.jsx
│ ├── currency/
│ ├── calculator/
│ ├── common/
│
├── pages/
│ ├── Home.jsx
│ ├── GPA.jsx
│ ├── CGPA.jsx
│ ├── Dashboard.jsx
│ ├── Contact.jsx
│
├── hooks/
├── services/
├── utils/
├── constants/
├── contexts/
├── lib/firebase/
├── styles/
└── router/

```

---

## Data Flow Model

```

User Action
↓
React Component
↓
Custom Hook
↓
Service Layer
↓
localStorage / Firebase / EmailJS
↓
Dashboard Sync Event
↓
UI Auto Update

```

---

## Key Design Principles

### 1. Local-First System
- No authentication required
- All user data stored in localStorage
- Optional Firebase persistence for exports

### 2. Dashboard-Centric UX
- Every tool feeds into a central dashboard
- All user activity is tracked automatically
- Instant UI reflection without refresh

### 3. Modular Service Layer
- Separation of UI, logic, and storage
- Reusable hooks across the system
- Centralized data handling

### 4. Performance Optimized
- Lazy-loaded routes
- Memoized components
- Cached API responses (currency rates)
- Minimal re-renders via context design

---

## Tech Stack

Frontend
- React 19
- React Router 6
- Vite

Styling
- Tailwind CSS
- Glassmorphism UI system
- Framer Motion animations

Backend Services
- Firebase Firestore (export storage only)
- Firebase Analytics
- EmailJS (contact system)

State Management
- React Context API
- localStorage persistence layer

Utilities
- jsPDF (PDF exports)
- CSV generator utilities
- Currency API integration

---

## Environment Variables

```

VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID

VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY

VITE_APP_URL

```

---

## Features Breakdown

### Dashboard Intelligence
- Tracks GPA calculations automatically
- Stores currency conversions history
- Saves export activity logs
- Highlights recent tool usage

### Currency System
- Live exchange rate fetching
- 24-hour caching system
- Offline fallback support
- Swap animation between currencies

### GPA System
- Dynamic course input
- Weighted calculation engine
- Instant result updates
- Export-ready structured output

### Export Engine
- PDF formatting for academic reports
- CSV structured data output
- Firebase export history logging

---

## Performance Strategy

- Route-based code splitting
- Lazy loading for heavy calculators
- Memoized widget rendering
- Debounced input handling
- Cached API responses for currency system

---

## SEO Strategy

- Fully indexable SPA routing
- Meta tag support per route
- OpenGraph + Twitter card optimization
- Sitemap-ready route structure
- Keyword-targeted landing content for academic tools

---

## Deployment

### Netlify
- SPA redirect handling enabled
- Build output: dist/
- Environment variables injected at build time

### Build Commands
```

npm install
npm run dev
npm run build
npm run preview

```

---

## Roadmap

Planned Enhancements
- AI academic assistant chatbot
- Smart study suggestions based on GPA trends
- Cloud sync (optional login layer)
- Multi-device dashboard sync
- Advanced analytics visualization

---

## Contribution Guidelines

- Keep architecture modular
- No direct logic inside UI components
- Use services layer for all external calls
- Maintain local-first design philosophy

---

## License

MIT License

---

## Author

Built by Usman Murtaza
Focused on modern academic productivity systems and frontend architecture design.
```
