import React, { useState } from 'react';
import { TopNavbar } from './TopNavbar';
import { LeftSidebar } from './LeftSidebar';
import { BottomStatusBar } from './BottomStatusBar';
import { MissionControlBar } from './MissionControlBar';
import { useSimulationLoop } from '../../hooks/useSimulationLoop';
import { useSettingsStore } from '../../store/settingsStore';

export function AppShell({ activeTab, onNavigate, children }) {
  useSimulationLoop();

  const theme = useSettingsStore((s) => s.theme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className={`min-h-screen flex flex-col mission-grid-bg ${
        theme === 'light' ? 'bg-slate-900 text-slate-100' : 'bg-[#030712] text-slate-100'
      }`}
    >
      <TopNavbar
        onNavigate={onNavigate}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex min-h-0">
        <LeftSidebar
          activeTab={activeTab}
          onNavigate={onNavigate}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-5 overflow-y-auto">
          <MissionControlBar onOpenSimulation={() => onNavigate('simulation')} />
          {children}
        </main>
      </div>

      <BottomStatusBar />
    </div>
  );
}
