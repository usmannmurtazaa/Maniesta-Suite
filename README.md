Here is a refined, production level version of your README with improved structure, consistency, clarity, and senior level documentation quality.

---

<p align="center">
  <img src="./src/assets/logo.png" alt="Maniesta Suite Logo" width="120" />
</p>

<h1 align="center">Maniesta Suite</h1>

<p align="center">
  <strong>Academic Productivity Dashboard System</strong><br/>
  A modern frontend first platform for students to calculate, convert, export, and track academic performance in one unified dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Firebase-10-FFCA28?logo=firebase" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## Overview

Maniesta Suite is a modular academic productivity system designed to replace scattered student tools with a unified interface.

It provides calculators, converters, export systems, analytics, and a dashboard that tracks user activity locally without requiring authentication.

---

## Core Capabilities

### Academic Tools

* GPA Calculator with real time computation and target planning
* CGPA Calculator with semester based tracking
* Standard and scientific calculator with history support
* Unit converter covering length, weight, temperature, area, time, speed
* Interest calculator supporting simple, compound, and EMI

### Financial Tools

* Live currency converter supporting 150 plus currencies
* Cached exchange rates for performance optimization
* Swap and copy functionality for quick usage

### Export System

* PDF academic reports with branding
* CSV structured data export
* Export history tracking
* Optional Firestore backup

### Dashboard Intelligence

* Tracks GPA, CGPA, currency conversions, and exports
* Stores last activity state in localStorage
* Cross tab synchronization using custom events
* Favorite tools and recent activity tracking

### Contact System

* EmailJS based contact form
* Validation with accessible feedback

---

## Architecture

UI Layer
React pages and components handle rendering and interaction

Hooks Layer
Custom hooks manage domain logic like GPA, CGPA, currency, and activity tracking

Services Layer
Handles external integrations such as Firebase, EmailJS, exports, and analytics

Utilities Layer
Pure functions for calculations, validation, and formatting

Storage Layer
localStorage and Firebase for persistence

---

## Data Flow

User Action → Component → Hook → Service → Storage
Storage update → custom event → UI sync

---

## Project Structure

src
components reusable UI components
pages route level screens
hooks business logic hooks
services external integrations and APIs
utils pure functions
constants fixed configuration values
contexts theme and dashboard state
store optional global state
router routing configuration
styles global styles
main entry point

---

## Design System

* Glassmorphism based UI design
* Fully responsive from mobile to large desktop screens
* Dark, light, and system theme support
* Smooth Framer Motion transitions
* SVG based icons only, no emojis in production UI
* Consistent spacing and typography system

---

## Typography System

* Brand and logo: Cinzel or Agbalumo
* Headings: Playfair Display
* Body text: Google Sans
* Numbers and calculations: JetBrains Mono or STIX Two Math

---

## Tech Stack

Frontend
React, React Router, Vite

Styling
Tailwind CSS, custom design tokens, Framer Motion

Backend Services
Firebase Firestore, Firebase Analytics, EmailJS

State Management
React Context, localStorage, optional Zustand

Utilities
jsPDF, CSV generator, currency API integration

Deployment
Netlify

---

## Installation

Clone repository
git clone repository-url
cd maniesta-suite

Install dependencies
npm install

Start development server
npm run dev

Build production
npm run build

---

## Environment Variables

Firebase configuration required for analytics and export backup
EmailJS required for contact form functionality

Without these, core UI still works normally

---

## Key Features

Dashboard Intelligence
Tracks all tool usage automatically and updates in real time

Currency Converter
Live rates with caching for performance optimization

GPA and CGPA System
Dynamic grading system with target planning

Export Engine
Generates PDF and CSV reports with structured formatting

Theming System
Persistent theme with system preference detection

---

## Performance Strategy

* Lazy loading for route based code splitting
* Memoized tool lists using useMemo
* Local caching for API calls
* Event based state synchronization
* Reduced re renders via hook isolation

---

## Contributing Guidelines

* Keep UI and logic separated
* Use hooks for all business logic
* Use services for external integrations
* Maintain local first architecture
* Avoid inline calculations inside components
* Ensure full responsiveness on all screen sizes

---

## License

MIT License

---

## Author

Usman Murtaza
Portfolio: https://usmanmurtaza.netlify.app/

GitHub: @usmannmurtazaa