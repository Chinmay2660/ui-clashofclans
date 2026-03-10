# ClasherStats - Frontend

A modern React application for tracking Clash of Clans player and clan statistics. Built with React 19, Vite, Redux Toolkit, and Tailwind CSS.

![ClasherStats](https://img.shields.io/badge/Clash%20of%20Clans-Stats%20Tracker-orange)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-cyan)

## ✨ Features

- 🔍 **Player Search** - Look up any player by tag; recent searches saved locally
- 🏰 **Clan Search** - Explore clan details, members, and war history
- 👤 **My Profile** - Quick access to your saved player profile (tag in Settings)
- 👥 **My Clan** - View your clan's stats and member list (tag in Settings)
- 🏆 **Rankings** - Global and regional leaderboards with deep-linkable tabs
- 📊 **Detailed Stats** - Heroes, achievements, war stars, donations; clan member sort/filter
- 🔗 **Copy Link** - Share player or clan page; toast on copy
- 🍞 **Breadcrumbs** - On player and clan detail pages
- 🎫 **Gold Pass** - Current season block on Home
- 🎨 **Beautiful UI** - Dark theme with CoC-inspired design
- 📱 **Responsive** - Works on all devices
- ⚠️ **Error & Offline** - ErrorBoundary and offline fallback with retry
- 🔔 **Toasts** - Feedback for save, copy, and errors

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **Vite** - Lightning fast build tool
- **Redux Toolkit** - Modern state management with slices
- **Tailwind CSS** - Utility-first styling
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library

## 📁 Project Structure

```
src/
├── assets/              # Images, icons, and static files
├── components/
│   ├── ui/              # Reusable UI (Button, Card, Badge, Input, Skeleton, StatCard, ErrorState, Breadcrumbs)
│   ├── shared/          # PlayerProfile, ClanProfile
│   ├── Home/
│   ├── Search/          # Search + recent searches
│   ├── Player/          # PlayerDetails
│   ├── Clan/            # ClanDetails, WarLog, CurrentWar, CurrentCWL, CapitalRaids
│   ├── MyProfile/
│   ├── MyClan/
│   ├── Leaderboards/
│   ├── Settings/        # Saved player/clan tags, preferences
│   ├── ErrorBoundary.jsx
│   ├── OfflineFallback.jsx
│   ├── NotFound.jsx
│   └── Loader.jsx
├── context/
│   └── ToastContext.jsx # Toasts for copy, save, errors
├── Config/
│   └── Config.jsx       # API base URL (/api/v1), endpoints
├── Store/
│   ├── slices/
│   ├── hooks.js
│   └── store.jsx
├── utils/
│   └── recentSearches.js
└── main.jsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ui-clashofclans.git
cd ui-clashofclans
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## ⚙️ Configuration

Edit `src/Config/Config.jsx` to configure:

- **API base URL** – local vs production (uses `/api/v1`).
- **Player and clan tags** – set in **Settings** (saved in localStorage), not in Config.

```javascript
// src/Config/Config.jsx
const API_BASE_URL = isLocalhost 
  ? 'http://localhost:8000/api/v1' 
  : 'https://api-clashofclans.vercel.app/api/v1';
```

## 🎨 Customization

### Theme Colors

The app uses a dark theme with custom colors defined in `tailwind.config.js`:

- **Primary**: Amber/Gold gradient
- **Secondary**: Purple/Violet gradient
- **Background**: Dark gray (#111827)

### Adding Your Profile

Set your player and clan tags in **Settings** (gear icon in the nav). Values are saved in localStorage and used by My Profile and My Clan.

## 🔧 Custom Hooks

The app provides convenient hooks for data fetching:

```javascript
import { usePlayer, useClan, useRankings, useLeagues } from './Store/hooks';

// Player data
const { player, loading, error, getPlayer, hasData } = usePlayer();

// Clan data
const { clan, getClan, hasData } = useClan();

// Rankings
const { getClanRankings, getPlayerRankings, locations } = useRankings();

// Leagues
const { leagues, warLeagues, getLeagues } = useLeagues();
```

## 🏗️ Building for Production

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment.

## 🌐 Deployment

The app is configured for deployment on:
- **Vercel** (recommended)
- **Netlify**
- Any static hosting service

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 🙏 Acknowledgments

- [Clash of Clans API](https://developer.clashofclans.com/)
- [RoyaleAPI Proxy](https://docs.royaleapi.com/#/proxy)
- Game assets © Supercell
