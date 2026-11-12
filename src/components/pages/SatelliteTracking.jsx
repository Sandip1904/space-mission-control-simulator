import React, { useState } from 'react';
import { Radar, Search, Filter } from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { EarthSatelliteCanvas } from '../satellite/EarthSatelliteCanvas';
import { SatelliteDetailPanel } from '../satellite/SatelliteDetailPanel';
import { PanelHeader } from '../common/PanelHeader';
import { StatusBadge } from '../common/StatusBadge';

const CATEGORIES = [
  'ALL',
  'SPACE STATION',
  'COMMUNICATIONS',
  'DEEP SPACE RELAY',
  'EARTH OBSERVATION',
  'NAVIGATION',
];

export function SatelliteTracking() {
  const satellites = useMissionStore((s) => s.satellites);
  const selectedSatelliteId = useMissionStore((s) => s.selectedSatelliteId);
  const setSelectedSatelliteId = useMissionStore((s) => s.setSelectedSatelliteId);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredSatellites = satellites.filter((sat) => {
    const matchesCat = categoryFilter === 'ALL' || sat.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      sat.name.toLowerCase().includes(q) ||
      sat.noradId.toLowerCase().includes(q) ||
      sat.regime.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: 3D Earth & Selected Satellite Telemetry */}
        <div className="xl:col-span-7 space-y-4">
          <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
            <PanelHeader
              title="3D Orbital Tracking & Constellation Radar"
              subtitle="Simulated LEO / MEO / GEO / Cislunar demonstration catalog"
              icon={Radar}
            />
            <EarthSatelliteCanvas />
          </div>
          <SatelliteDetailPanel />
        </div>

        {/* Right: Searchable & Filterable Satellite Catalog */}
        <div className="xl:col-span-5 mission-panel rounded-lg p-4 border border-sky-500/25 flex flex-col">
          <PanelHeader
            title="Active Satellite Catalog"
            subtitle={`${filteredSatellites.length} of ${satellites.length} orbital assets displayed`}
            icon={Filter}
          />

          {/* Search & Category Filter */}
          <div className="space-y-2.5 mb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search satellite name, NORAD ID, or orbit regime..."
                className="w-full pl-9 pr-3 py-1.5 rounded bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-semibold border transition-colors ${
                    categoryFilter === cat
                      ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Satellite List */}
          <div className="space-y-2 overflow-y-auto max-h-[620px] pr-1">
            {filteredSatellites.map((sat) => {
              const isSelected = sat.id === selectedSatelliteId;
              return (
                <div
                  key={sat.id}
                  onClick={() => setSelectedSatelliteId(sat.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 hover:border-sky-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: sat.color }}
                      />
                      <span className="text-xs font-mono font-bold text-white">{sat.name}</span>
                    </div>
                    <StatusBadge status={sat.status} size="xs" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[9px]">ALTITUDE</span>
                      {sat.altitudeKm.toLocaleString()} km
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">VELOCITY</span>
                      {sat.velocityKms.toFixed(2)} km/s
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">COORDINATES</span>
                      {sat.lat.toFixed(1)}°, {sat.lon.toFixed(1)}°
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
