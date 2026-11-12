import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Radar,
  Cpu,
  Orbit,
  CalendarClock,
  HeartPulse,
  Flame,
  BellRing,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Mission Overview', icon: LayoutDashboard, code: '01' },
  { id: 'solar-system', label: 'Solar System 3D', icon: Globe, code: '02' },
  { id: 'satellites', label: 'Satellite Tracking', icon: Radar, code: '03' },
  { id: 'telemetry', label: 'Spacecraft Telemetry', icon: Cpu, code: '04' },
  { id: 'trajectory', label: 'Orbital Trajectory', icon: Orbit, code: '05' },
  { id: 'timeline', label: 'Mission Timeline', icon: CalendarClock, code: '06' },
  { id: 'life-support', label: 'Life Support (ECLSS)', icon: HeartPulse, code: '07' },
  { id: 'simulation', label: 'Mission Simulation', icon: Flame, code: '08' },
  { id: 'alerts', label: 'Alerts & Incidents', icon: BellRing, code: '09' },
  { id: 'settings', label: 'System Settings', icon: Settings, code: '10' },
];

export function LeftSidebar({
  activeTab,
  onNavigate,
  collapsed,
  setCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const alerts = useMissionStore((s) => s.alerts);
  const activeEmergency = useMissionStore((s) => s.activeEmergency);
  const unackCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-14 bottom-8 left-0 z-30 bg-[#050b1a]/95 backdrop-blur-md border-r border-sky-500/20 flex flex-col justify-between transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-2.5 space-y-1 overflow-y-auto">
          <div className="px-2 py-1.5 flex items-center justify-between">
            {!collapsed && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                COMMAND CONSOLES
              </span>
            )}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1 rounded hover:bg-sky-500/15 text-slate-400 hover:text-cyan-300"
              aria-label="Toggle sidebar width"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isEmergencyTab = item.id === 'simulation' && activeEmergency;
            const isAlertsTab = item.id === 'alerts' && unackCount > 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-mono text-xs transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isEmergencyTab
                        ? 'text-red-400 animate-pulse'
                        : isActive
                        ? 'text-cyan-300'
                        : 'text-slate-400'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-1">
                    {isEmergencyTab && (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-red-500/30 text-red-300 border border-red-500/50">
                        ACTIVE
                      </span>
                    )}
                    {isAlertsTab && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/40">
                        {unackCount}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-600">{item.code}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Telemetry Disclaimer Pill */}
        {!collapsed && (
          <div className="p-3 m-2.5 rounded-lg bg-slate-900/90 border border-sky-500/20 text-[10px] font-mono text-slate-400 leading-relaxed">
            <div className="text-cyan-300 font-semibold mb-0.5">SIMULATION ENGINE v2.4</div>
            All spacecraft telemetry, ephemeris, and failure dynamics are simulated in-browser.
          </div>
        )}
      </aside>
    </>
  );
}
