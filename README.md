# Maniesta Suite – Academic Tools Platform

Modern, glassmorphism-designed academic calculators for students. Built with React 19, Tailwind CSS, Framer Motion, Firebase, and EmailJS.

## Features
- GPA Calculator (dynamic courses, live results, export PDF/CSV)
- CGPA Calculator (multiple semesters, best semester highlight)
- Normal & Scientific Calculators (history, copy, keyboard support)
- Unit Converter (length, weight, temperature, currency, area, time, speed)
- Interest Calculator (simple, compound, loan EMI)
- Contact form (EmailJS)
- Export system (Firestore saving + PDF/CSV generation)
- Dark/Light/System theme with glassmorphism UI

## Project Structure
- `client/` – React frontend (Vite)
- `server/` – Optional Express backend (placeholder)
- `functions/` – Firebase Cloud Functions (planned)

## Getting Started
1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Firebase & EmailJS credentials
3. Run `npm install` inside `client/`
4. `npm run dev` to start the development server
5. Build for production: `npm run build`

## Environment Variables
See `.env.example` for required keys.

## Architecture
- UI: React 19 + Tailwind CSS + Framer Motion
- State: React Context (theme), local state, optional Zustand store
- Data: Firebase Firestore, Firebase Analytics
- Email: EmailJS
- Bundler: Vite

## License
MIT