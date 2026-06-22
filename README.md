# MANIESTA SUITE – Academic Productivity Dashboard System

<p align="center">
  <img src="./src/assets/logo.png" width="110" alt="Maniesta Suite Logo" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=26&pause=1000&color=4F46E5&center=true&vCenter=true&width=900&lines=All+your+academic+tools+in+one+dashboard;GPA+and+CGPA+tracking+with+real+time+logic;Financial+tools+with+live+currency+conversion;Export+reports+in+PDF+and+CSV;Built+for+performance+and+scalability" />
</p>

<p align="center">
  A SaaS‑style academic productivity platform that replaces scattered tools with a unified, real‑time dashboard experience.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Firebase-10-FFCA28?logo=firebase" />
  <img src="https://img.shields.io/badge/Framer%20Motion-Animation-000000" />
</p>

## 📖 Product Overview

Maniesta Suite is built for students and academic workflows that require speed, accuracy, and structured tracking. It combines multiple systems into one unified SaaS‑style dashboard:

- **Academic computation engine** – GPA, CGPA, target GPA simulation
- **Financial & currency tools** – live exchange rates, interest calculations
- **Utility calculators** – unit conversion, scientific calculator
- **Export & reporting system** – PDF/CSV generation with professional styling
- **Real‑time dashboard intelligence** – activity tracking, favorites, and cross‑tab sync

---

## 🚀 Why Maniesta Suite?

Traditional academic tools are fragmented, slow, and inconsistent. Maniesta Suite solves this by providing:

- ✅ One unified dashboard for all academic tools  
- ✅ Real‑time GPA and CGPA computation  
- ✅ Cached and optimised financial APIs  
- ✅ Local‑first architecture for instant performance  
- ✅ Exportable reports for academic tracking  
- ✅ Clean SaaS‑grade UI system with glassmorphism

---

## 🧩 Core Product Modules

### 📚 Academic Engine
- GPA Calculator with real‑time updates  
- CGPA tracking across semesters  
- Target GPA simulation system  
- Grade forecasting engine  

### 💰 Financial Engine
- Currency converter supporting 150+ currencies  
- Cached exchange rate optimisation (24h cache)  
- Instant swap and conversion system  

### 🛠 Utility Engine
- Scientific calculator with history tracking  
- Unit conversion system (length, weight, temperature, area, speed, time)  
- Interest calculator for EMI, simple and compound interest  

### 📄 Export Engine
- PDF report generation with structured formatting  
- CSV export system for academic data  
- Export history tracking system  
- Optional Firebase backup layer  

### 📊 Dashboard Engine
- Real‑time activity tracking  
- Cross‑tab synchronisation  
- Favourites and recent tools system  
- Local storage persistence engine  

---

## 🎨 Product Experience

Maniesta Suite is designed like a modern SaaS dashboard. Key experience principles:

- ⚡ Instant response UI with no lag  
- 🧩 Modular tool‑based architecture  
- ✨ Clean, minimal interface  
- 🎬 Smooth animations using Framer Motion  
- 📱 Fully responsive across all devices  
- 🌗 Dark, light, and system theme support  

---

## 🏗 Architecture


┌─────────────────┐
│   UI LAYER      │  React components – rendering & interaction
├─────────────────┤
│   HOOK LAYER    │  Business logic – GPA, CGPA, currency, dashboard state
├─────────────────┤
│  SERVICE LAYER  │  Firebase, EmailJS, export generation, external APIs
├─────────────────┤
│  UTILITY LAYER  │  Pure functions – calculations, formatting, validation
├─────────────────┤
│ STORAGE LAYER   │  localStorage + optional Firebase sync
└─────────────────┘


### Data Flow


User Action → Component Trigger → Hook Execution → Service Call → Storage Update → Event Broadcast → UI Sync


---

## 💻 Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | React 18, Vite, Tailwind CSS            |
| Backend Svcs   | Firebase Firestore, Firebase Analytics, EmailJS |
| Animations     | Framer Motion                           |
| Utilities      | jsPDF, CSV Generator                    |
| State Mgmt     | React Context + localStorage (Zustand optional) |
| Deployment     | Netlify ready                           |

---

## ⚡ Performance Design

- 🧩 Lazy loading for route‑based optimisation  
- 🧮 Memoised computation for heavy logic  
- 🔄 Cached API responses for currency module  
- 📡 Event‑driven synchronisation system  
- 🔬 Hook isolation for reduced re‑renders  
- 💾 Local‑first architecture for instant UI  

---

## 🔒 Security Model

- No authentication required by default – all core logic runs locally  
- Optional Firebase integration only for export backup and analytics  
- No sensitive data collection  
- User‑controlled data export and storage  

---

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request. For major changes, discuss first to align with the architecture vision.

---

## 📄 License

MIT © [Usman Murtaza](https://usmanmurtaza.netlify.app/)

---

## 👨‍💻 Author

**Usman Murtaza**  
- Portfolio: [usmanmurtaza.netlify.app](https://usmanmurtaza.netlify.app/)  
- GitHub: [@usmannmurtazaa](https://github.com/usmannmurtazaa)

---

## 🏅 Recruiter Positioning

This project demonstrates:

- ✅ SaaS‑level frontend architecture  
- ✅ Scalable React hook‑based system design  
- ✅ Real‑time computation engine design  
- ✅ Performance‑optimised UI engineering  
- ✅ Modular system decomposition  
- ✅ Production‑ready frontend structure  

---

<p align="center">
  Made with ❤️ by Usman Murtaza
</p>
