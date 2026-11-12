import React, { useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  CheckCheck,
  Trash2,
  Filter,
  ShieldAlert,
} from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { PanelHeader } from '../common/PanelHeader';
import { StatusBadge } from '../common/StatusBadge';

const SEVERITIES = ['ALL', 'EMERGENCY', 'CRITICAL', 'WARNING', 'INFORMATIONAL'];

export function Alerts() {
  const alerts = useMissionStore((s) => s.alerts);
  const acknowledgeAlert = useMissionStore((s) => s.acknowledgeAlert);
  const resolveAlert = useMissionStore((s) => s.resolveAlert);
  const acknowledgeAllAlerts = useMissionStore((s) => s.acknowledgeAllAlerts);
  const clearResolvedAlerts = useMissionStore((s) => s.clearResolvedAlerts);

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedIncidentId, setSelectedIncidentId] = useState(alerts[0]?.id || null);

  const filteredAlerts = alerts.filter((a) =>
    severityFilter === 'ALL' ? true : a.severity === severityFilter
  );

  const selectedIncident =
    alerts.find((a) => a.id === selectedIncidentId) || filteredAlerts[0] || null;

  return (
    <div className="space-y-4">
      {/* Top Controls & Severity Filter */}
      <div className="mission-panel rounded-lg p-4 border border-sky-500/25 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> SEVERITY FILTER:
          </span>
          {SEVERITIES.map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border transition-colors ${
                severityFilter === sev
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={acknowledgeAllAlerts}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Acknowledge All
          </button>

          <button
            type="button"
            onClick={clearResolvedAlerts}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700 hover:border-red-400/50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Resolved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: Live Alert Feed */}
        <div className="xl:col-span-7 mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title={`Live Alert & Incident Feed (${filteredAlerts.length})`}
            subtitle="Click any incident to view full forensic telemetry details"
            icon={BellRing}
          />

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-400 bg-slate-900/60 rounded border border-slate-800">
                No alerts match the selected filter criteria.
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isSelected = selectedIncident && selectedIncident.id === alert.id;
                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedIncidentId(alert.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400'
                        : 'bg-slate-900/85 border-slate-800 hover:border-sky-500/40'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={alert.severity} size="xs" />
                        <span className="text-xs font-mono text-cyan-300 font-semibold">
                          {alert.category} // {alert.subsystem}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {alert.timestamp} • MET {alert.met}
                      </div>
                    </div>

                    <div className="text-sm font-mono font-bold text-white mt-1.5">
                      {alert.title}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{alert.message}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span
                          className={
                            alert.acknowledged ? 'text-emerald-400' : 'text-amber-300'
                          }
                        >
                          {alert.acknowledged ? '✓ Acknowledged' : '• Unacknowledged'}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span
                          className={alert.resolved ? 'text-emerald-400' : 'text-slate-400'}
                        >
                          {alert.resolved ? '✓ Resolved' : 'Active Incident'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {!alert.acknowledged && (
                          <button
                            type="button"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-2.5 py-1 rounded text-[11px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25"
                          >
                            Acknowledge
                          </button>
                        )}
                        {!alert.resolved && (
                          <button
                            type="button"
                            onClick={() => resolveAlert(alert.id)}
                            className="px-2.5 py-1 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 inline-flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Incident Forensic Details Panel */}
        <div className="xl:col-span-5 mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="Incident Diagnostics & Action Log"
            subtitle="Subsystem telemetry snapshot and recommended flight procedure"
            icon={ShieldAlert}
          />

          {selectedIncident ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">INCIDENT ID: {selectedIncident.id}</span>
                  <StatusBadge status={selectedIncident.severity} size="xs" />
                </div>
                <div className="text-base font-bold text-white font-sans">
                  {selectedIncident.title}
                </div>
                <div className="text-slate-400">
                  Logged at {selectedIncident.timestamp} (MET {selectedIncident.met})
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-cyan-400 uppercase font-bold">
                  AFFECTED SUBSYSTEM & TELEMETRY SNAPSHOT
                </div>
                <div className="text-slate-200 font-semibold">
                  {selectedIncident.category} — {selectedIncident.subsystem}
                </div>
                <p className="text-slate-300 font-sans leading-relaxed">
                  {selectedIncident.details}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="text-[10px] text-emerald-300 uppercase font-bold">
                  RECOMMENDED FLIGHT RULES PROCEDURE
                </div>
                <p className="text-slate-200 font-sans leading-relaxed">
                  {selectedIncident.recommendedAction}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {!selectedIncident.acknowledged && (
                  <button
                    type="button"
                    onClick={() => acknowledgeAlert(selectedIncident.id)}
                    className="flex-1 py-2 rounded font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30"
                  >
                    Acknowledge Incident
                  </button>
                )}
                {!selectedIncident.resolved && (
                  <button
                    type="button"
                    onClick={() => resolveAlert(selectedIncident.id)}
                    className="flex-1 py-2 rounded font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  >
                    Mark Incident Resolved
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-slate-400">
              Select an alert from the feed to inspect its forensic telemetry record.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
