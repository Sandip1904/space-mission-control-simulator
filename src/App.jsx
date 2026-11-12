import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { MissionOverview } from './components/pages/MissionOverview';
import { SolarSystem } from './components/pages/SolarSystem';
import { SatelliteTracking } from './components/pages/SatelliteTracking';
import { SpacecraftTelemetry } from './components/pages/SpacecraftTelemetry';
import { OrbitalTrajectory } from './components/pages/OrbitalTrajectory';
import { MissionTimeline } from './components/pages/MissionTimeline';
import { LifeSupport } from './components/pages/LifeSupport';
import { MissionSimulation } from './components/pages/MissionSimulation';
import { Alerts } from './components/pages/Alerts';
import { Settings } from './components/pages/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <MissionOverview onNavigate={setActiveTab} />;
      case 'solar-system':
        return <SolarSystem />;
      case 'satellites':
        return <SatelliteTracking />;
      case 'telemetry':
        return <SpacecraftTelemetry />;
      case 'trajectory':
        return <OrbitalTrajectory />;
      case 'timeline':
        return <MissionTimeline />;
      case 'life-support':
        return <LifeSupport />;
      case 'simulation':
        return <MissionSimulation />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <MissionOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <AppShell activeTab={activeTab} onNavigate={setActiveTab}>
      {renderPage()}
    </AppShell>
  );
}
