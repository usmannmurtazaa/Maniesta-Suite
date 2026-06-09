```
# Maniesta Suite — Academic Tools Platform

Premium, glassmorphism‑designed academic calculators for students worldwide.  
Built with React 19, Tailwind CSS, Framer Motion, Firebase, and EmailJS.

---

## ✨ Features

- **GPA Calculator** — dynamic courses, live results, celebration animation for high GPA, export to PDF/CSV
- **CGPA Calculator** — multiple semesters, best semester highlight, export to PDF/CSV
- **Normal & Scientific Calculators** — history, copy to clipboard, full keyboard support
- **Unit Converter** — length, weight, temperature, currency, area, time, speed
- **Interest Calculator** — simple, compound, loan EMI
- **Contact Form** — sends messages via EmailJS
- **Export System** — professional PDF reports + structured CSV, persisted to Firestore
- **Dark / Light / System Theme** — glassmorphism UI with animated transitions
- **Analytics** — centralized Firebase Analytics with typed event tracking
- **Enterprise Architecture** — clean separation of `lib/`, `services/`, `hooks/`, `utils/`, and `components/`

---

## 📁 Project Structure (Root Level)

```
maniesta-suite/
├── public/                  # Static assets
├── src/
│   ├── lib/firebase/        # Firebase app, firestore, analytics initialization
│   ├── services/            # Business logic layer (analytics, firestore, email, export)
│   ├── hooks/               # Custom React hooks (useGPA, useCGPA, useCalculator, useExport, …)
│   ├── utils/               # Pure functions (calculations, grades, validators, device info)
│   ├── constants/           # Grade scales, limits, analytics events
│   ├── components/          # UI components (calculators, common, layout, contact)
│   ├── pages/               # Page components (Home, GPA, CGPA, …)
│   ├── router/              # React Router configuration
│   ├── contexts/            # Theme context
│   ├── store/               # Zustand store (optional global state)
│   ├── styles/              # Global & animation CSS
│   └── App.jsx / main.jsx   # Entry points
├── .env                     # Environment variables
├── index.html               # Entry HTML
├── netlify.toml             # Deployment config
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies & scripts
```

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/maniesta-suite.git
   cd maniesta-suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Rename `.env.example` to `.env` and fill in your credentials:
   - Firebase configuration (`VITE_FIREBASE_*`)
   - EmailJS (`VITE_EMAILJS_*`)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics measurement ID |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `VITE_APP_URL` | (optional) Production URL |

---

## 🧱 Architecture

### Layered Design
- **`lib/`** — Infrastructure layer (Firebase init only, no business logic)
- **`services/`** — Business logic layer
  - `analytics/` — Centralized event tracking with typed constants
  - `firestore/` — CRUD operations for export records
  - `export/` — PDF/CSV generation & download orchestrator
  - `email/` — EmailJS wrapper
- **`hooks/`** — React hooks connecting services to UI
  - `useGPA`, `useCGPA` — domain‑specific state management
  - `useCalculator` — shared calculator engine
  - `useExport` — unified export flow
  - `useAnalytics` — page view tracking
- **`utils/`** — Pure functions (no React, no side‑effects)
  - `calculations/` — GPA, CGPA, interest, expression evaluators
  - `analytics.js` — device/browser detection
  - `grades.js` — grade scales & standing
  - `validators.js` — form validators
- **`constants/`** — Immutable application constants (grade scales, limits, event names)

### Data Flow
```
UI (components)  →  hooks  →  services  →  lib/firebase  →  Firebase / EmailJS
                         ↕
                       utils (pure calculations)
```

### Design System
- **Glassmorphism** via Tailwind utilities (`glass`, `glass-card`, `shadow-glass-lg`)
- **Animated backgrounds** with floating gradient blobs and Framer Motion
- **Micro‑interactions** on all buttons, inputs, and cards
- **Responsive** from 320px to 1920px+
- **Dark / Light / System** theme with seamless transitions

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 6 |
| Styling | Tailwind CSS 3, CSS variables |
| Animation | Framer Motion |
| Backend / Data | Firebase Firestore |
| Analytics | Firebase Analytics |
| Email | EmailJS |
| PDF / CSV | jsPDF, custom CSV generator |
| State | React Context, Zustand |
| Build | Vite 5 |
| Deployment | Netlify |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request.  
For major changes, discuss first to align with the architecture vision.

---

## 📄 License

MIT — built and maintained with ❤️ by Usman Murtaza.
```

---