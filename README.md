# ⚡ FocusForge: Gamified Productivity Suite

FocusForge is a high-energy, Neo-Brutalist productivity ecosystem designed to help users crush distractions and level up their focus. It combines a dynamic React dashboard, a robust Node.js/Express backend, and a high-performance Chrome Extension.

## 🚀 Key Features

- **Gamified Focus**: Earn XP and level up for every minute you stay focused.
- **Neo-Brutalist UI**: A bold, high-contrast design system featuring Mustard Yellow (#FCD34D), Lavender (#A78BFA), and Mint Green (#6EE7B7) with thick black borders and sharp shadows.
- **Squad Sync**: Real-time social analytics to see how you rank against your squad's focus vs. doomscrolling ratios.
- **Focus Guard (Extension)**: Active domain blocking with mindfulness-driven interception overlays.
- **Blocklist Management**: Directly manage your intercepted domains from the dashboard.
- **Rewards Store**: Redeem your hard-earned XP for brand-name rewards (Zomato, Amazon, etc.).
- **Parent Portal**: Dedicated dashboard for parents to monitor their linked kids' focus analytics, XP progression, and distraction patterns.
- **Dynamic Analytics**: 7-day attention breakdown using customized Recharts visualizations.

## 🛠️ Tech Stack

### Frontend
- **React 18** (TypeScript)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **React Context** (State Management)
- **Recharts** (Data Visualization)
- **Lucide React** (Icons)

### Backend
- **Node.js & Express**
- **MongoDB Atlas** (Database)
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)

### Extension
- **Chrome Manifest V3**
- **JavaScript/TypeScript** (Service Workers & Content Scripts)

## 🏁 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd focusforge-frontend
npm install
npm run dev
```
Dashboard will be available at `http://localhost:5173`.

### 3. Backend Setup
```bash
# Navigate to the backend directory
cd focusforge-backend
npm install
# Configure your .env with MONGO_URI and JWT_SECRET
npm run dev
```
API will be available at `http://localhost:5000`.

### 4. Extension Setup
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `focus-guard` directory.

## 🏗️ Architecture
For a deep dive into the system design, data flow, and technology layers, refer to the [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md).

## 🎨 Design Language
FocusForge uses a strict **Neo-Brutalist** aesthetic:
- **Primary Color**: #FCD34D (Mustard Yellow)
- **Accent Color**: #A78BFA (Lavender Purple)
- **Success Color**: #6EE7B7 (Mint Green)
- **Border**: 2px solid #111827
- **Shadow**: 4px 4px 0px #111827 (Sharp, non-blurred)

---
*Created by the FocusForge Team. Build better habits, one session at a time.*
