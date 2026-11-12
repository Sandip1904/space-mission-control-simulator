import React, { useState } from 'react';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  Play,
  AlertCircle,
  MapPin,
  Rocket,
} from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { formatCountdown, formatMET } from '../../utils/formatters';
import { PanelHeader } from '../common/PanelHeader';
import { StatusBadge } from '../common/StatusBadge';

export function MissionTimeline() {
  const timelineEvents = useMissionStore((s) => s.timelineEvents);
  const metSeconds = useMissionStore((s) => s.metSeconds);
  const selectedTimelineEventId = useMissionStore((s) => s.selectedTimelineEventId);
  const setSelectedTimelineEventId = useMissionStore((s) => s.setSelectedTimelineEventId);
  const jumpToTimelineEvent = useMissionStore((s) => s.jumpToTimelineEvent);
  const toggleTimelineEventDelay = useMissionStore((s) => s.toggleTimelineEventDelay);

  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredEvents = timelineEvents.filter((evt) =>
    statusFilter === 'ALL' ? true : evt.status === statusFilter
  );

  const selectedEvent =
    timelineEvents.find((e) => e.id === selectedTimelineEventId) || timelineEvents[0];

  const completedCount = timelineEvents.filter((e) => e.status === 'COMPLETED').length;
  const upcomingCount = timelineEvents.filter((e) => e.status === 'UPCOMING').length;
  const delayedCount = timelineEvents.filter((e) => e.status === 'DELAYED').length;

  return (
    <div className="space-y-4">
      {/* Summary Header Bar */}
      <div className="mission-panel rounded-lg p-4 border border-sky-500/25 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarClock className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-mono font-bold uppercase text-white">
              Master Flight Plan & Mission Event Sequence
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Current Mission Elapsed Time: <strong className="text-cyan-300">{formatMET(metSeconds)}</strong> • Click any event to inspect or jump simulation state
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {['ALL', 'COMPLETED', 'IN PROGRESS', 'UPCOMING', 'DELAYED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded border font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              {st}
              {st === 'COMPLETED' && ` (${completedCount})`}
              {st === 'UPCOMING' && ` (${upcomingCount})`}
              {st === 'DELAYED' && ` (${delayedCount})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: Chronological Event Sequence */}
        <div className="xl:col-span-7 mission-panel rounded-lg p-4 border border-sky-500/25 space-y-3">
          <PanelHeader
            title="Chronological Mission Sequence (9 Flight Milestones)"
            subtitle="Launch through Pacific Splashdown & Recovery"
            icon={Clock}
          />

          <div className="space-y-2.5">
            {filteredEvents.map((evt) => {
              const isSelected = evt.id === selectedEvent.id;
              const deltaSec = evt.scheduledMetSeconds - metSeconds;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedTimelineEventId(evt.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-sm'
                      : 'bg-slate-900/85 border-slate-800 hover:border-sky-500/40'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-xs font-mono font-bold text-cyan-300">
                        {evt.sequence}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold text-white">{evt.name}</span>
                          <StatusBadge status={evt.status} size="xs" />
                        </div>
                        <div className="text-[11px] font-mono text-cyan-400">{evt.phase}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <div className="text-slate-200 font-semibold">{evt.scheduledTimeLabel}</div>
                      <div className="text-[11px] text-amber-300">{formatCountdown(deltaSec)}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">{evt.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Event Inspector & Simulation Phase Jump */}
        <div className="xl:col-span-5 mission-panel rounded-lg p-4 border border-sky-500/25 flex flex-col justify-between">
          <div className="space-y-4">
            <PanelHeader
              title={`Event #${selectedEvent.sequence} Inspector // ${selectedEvent.name}`}
              subtitle={selectedEvent.phase}
              icon={Rocket}
              rightContent={<StatusBadge status={selectedEvent.status} />}
            />

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/90 p-3.5 rounded-lg border border-slate-800">
              {selectedEvent.description}
            </p>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">SCHEDULED MISSION TIME</span>
                <strong className="text-cyan-300 text-sm mt-0.5 block">
                  {selectedEvent.scheduledTimeLabel}
                </strong>
              </div>
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ACTUAL SIMULATED TIME</span>
                <strong className="text-emerald-300 text-sm mt-0.5 block">
                  {selectedEvent.actualTimeLabel}
                </strong>
              </div>
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">COUNTDOWN / ELAPSED</span>
                <strong className="text-amber-300 text-sm mt-0.5 block">
                  {formatCountdown(selectedEvent.scheduledMetSeconds - metSeconds)}
                </strong>
              </div>
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">REQUIRED DELTA-V</span>
                <strong className="text-slate-100 text-sm mt-0.5 block">{selectedEvent.deltaV}</strong>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>LOCATION / CORRIDOR: {selectedEvent.location}</span>
              </div>
              <div className="text-slate-400">
                PRIMARY SUBSYSTEM: <strong className="text-slate-200">{selectedEvent.subsystem}</strong>
              </div>
              <div className="text-slate-300 pt-1 border-t border-slate-800">
                {selectedEvent.telemetryNotes}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => jumpToTimelineEvent(selectedEvent.id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              <Play className="w-3.5 h-3.5" /> Synchronize Sim to This Event Phase
            </button>

            <button
              type="button"
              onClick={() => toggleTimelineEventDelay(selectedEvent.id)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {selectedEvent.status === 'DELAYED' ? 'Clear Hold' : 'Simulate Delay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
