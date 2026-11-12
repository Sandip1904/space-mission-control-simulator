import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Radio,
  ShieldAlert,
  Bell,
  UserCheck,
  Clock,
  Activity,
  Menu,
  X,
} from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { formatMET } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

export function TopNavbar({ onNavigate, mobileMenuOpen, setMobileMenuOpen }) {
  const spacecraft = useMissionStore((s) => s.spacecraft);
  const metSeconds = useMissionStore((s) => s.metSeconds);
  const comms = useMissionStore((s) => s.telemetry.comms);
  const alerts = useMissionStore((s) => s.alerts);
  const activeEmergency = useMissionStore((s) => s.activeEmergency);

  const [utcTime, setUtcTime] = useState(() => new Date().toISOString().slice(11, 19));
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setUtcTime(new Date().toISOString().slice(11, 19));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <header className="sticky top-0 z-40 h-14 px-3 lg:px-5 bg-[#050b1a]/95 backdrop-blur-md border-b border-sky-500/25 flex items-center justify-between gap-3">
      {/* Left: Logo & Mission Identifier */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 rounded border border-sky-500/30 text-cyan-300 hover:bg-sky-500/10"
          aria-label="Toggle navigation sidebar"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:border-cyan-300 transition-colors">
            <Rocket className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs sm:text-sm tracking-wider text-white">
                AERO-OPS // MCC-HOUSTON
              </span>
              <span className="hidden xl:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                SIMULATED TELEMETRY
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 truncate">
              {spacecraft.missionId} • <span className="text-cyan-300">{spacecraft.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: MET & UTC Clocks */}
      <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-sky-500/20 rounded-lg px-3 py-1">
        <div className="flex items-center gap-1.5 pr-3 border-r border-slate-700/70">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <div>
            <div className="text-[9px] font-mono uppercase text-slate-400">MISSION ELAPSED (MET)</div>
            <div className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
              {formatMET(metSeconds)}
            </div>
          </div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase text-slate-400">UNIVERSAL TIME (UTC)</div>
          <div className="text-xs font-mono font-semibold text-slate-200 tracking-wider">
            {utcTime} UTC
          </div>
        </div>
      </div>

      {/* Right: Comm Status, Health, Notifications, Flight Director Profile */}
      <div className="flex items-center gap-2.5">
        {/* Communication Status */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/80 border border-sky-500/20">
          <Radio className={`w-3.5 h-3.5 ${comms.signalPct > 50 ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div className="text-[11px] font-mono">
            <span className="text-slate-400">DSN: </span>
            <span className="text-emerald-300 font-semibold">{comms.signalPct.toFixed(0)}%</span>
          </div>
        </div>

        {/* System Health Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/80 border border-sky-500/20">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono text-slate-300">
            HEALTH: <strong className="text-cyan-300">{spacecraft.healthScore}%</strong>
          </span>
          <StatusBadge status={activeEmergency ? 'EMERGENCY' : spacecraft.status} size="xs" />
        </div>

        {/* Notification Center */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg bg-slate-900/90 border border-sky-500/25 text-slate-200 hover:border-cyan-400/50 transition-colors"
            aria-label="Open alert notifications"
          >
            <Bell className="w-4 h-4 text-cyan-300" />
            {unacknowledgedCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-red-500 text-white">
                {unacknowledgedCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 mission-panel rounded-lg p-3 border border-cyan-500/40 z-50 shadow-2xl">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/70">
                <span className="text-xs font-mono font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Active Telemetry Alerts ({unacknowledgedCount})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen(false);
                    onNavigate('alerts');
                  }}
                  className="text-[11px] font-mono text-cyan-400 hover:underline"
                >
                  Open Center →
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {alerts.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setNotifOpen(false);
                      onNavigate('alerts');
                    }}
                    className="p-2 rounded bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge status={a.severity} size="xs" />
                      <span className="text-[10px] font-mono text-slate-400">{a.met}</span>
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-100 mt-1">
                      {a.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {a.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Flight Director Profile */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="leading-tight text-[11px] font-mono">
            <div className="text-slate-200 font-semibold">FLIGHT DIRECTOR</div>
            <div className="text-cyan-400 text-[10px]">CONSOLE: FD-01</div>
          </div>
        </div>
      </div>
    </header>
  );
}
