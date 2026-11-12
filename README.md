# AERO-OPS // Space Mission Control Simulator (`ARTEMIS-IV / ORION-MPCV-04`)

Enterprise-grade 3D Aerospace Mission Operations Platform & Real-Time Telemetry Simulator built with **React 19**, **Vite**, **JavaScript (ES6+ / JSX)**, **Three.js**, **Zustand**, **Recharts**, **Lucide React**, and **Tailwind CSS**.

> **Telemetry & Orbital Modeling Notice:** All spacecraft telemetry streams, satellite tracking coordinates, and emergency scenarios are **simulated in-browser** for demonstration and training purposes (no fake live NASA API claims). Planetary physical metrics (diameter, orbital period, rotation period, distance from Sun, and mean surface temperature) are grounded in the [NASA NSSDCA Planetary Fact Sheet (Metric)](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) and [NASA Sun Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html).

## Architecture & Module Inventory

```text
src/
├── components/
│   ├── common/
│   │   ├── MetricCard.jsx
│   │   ├── PanelHeader.jsx
│   │   └── StatusBadge.jsx
│   ├── layout/
│   │   ├── AppShell.jsx
│   │   ├── BottomStatusBar.jsx
│   │   ├── LeftSidebar.jsx
│   │   ├── MissionControlBar.jsx
│   │   └── TopNavbar.jsx
│   ├── pages/
│   │   ├── Alerts.jsx
│   │   ├── LifeSupport.jsx
│   │   ├── MissionOverview.jsx
│   │   ├── MissionSimulation.jsx
│   │   ├── MissionTimeline.jsx
│   │   ├── OrbitalTrajectory.jsx
│   │   ├── SatelliteTracking.jsx
│   │   ├── Settings.jsx
│   │   ├── SolarSystem.jsx
│   │   └── SpacecraftTelemetry.jsx
│   ├── satellite/
│   │   ├── EarthSatelliteCanvas.jsx
│   │   └── SatelliteDetailPanel.jsx
│   ├── solar-system/
│   │   ├── PlanetDetailPanel.jsx
│   │   └── SolarSystemCanvas.jsx
│   └── spacecraft/
│       └── OrbitalTrajectoryCanvas.jsx
├── data/
│   ├── failureScenarios.js
│   ├── planetaryData.js
│   ├── satelliteCatalog.js
│   └── timelineEvents.js
├── hooks/
│   ├── useSimulationLoop.js
│   └── useSoundEffects.js
├── services/
│   ├── alertService.js
│   ├── orbitalService.js
│   ├── simulationEngine.js
│   └── telemetryService.js
├── store/
│   ├── missionStore.js
│   └── settingsStore.js
├── styles/
│   └── index.css
├── utils/
│   └── formatters.js
├── App.jsx
└── main.jsx
```

## Installation, Development & Production Build Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Run Production Build**:
   ```bash
   npm run build
   npm run preview
   ```
