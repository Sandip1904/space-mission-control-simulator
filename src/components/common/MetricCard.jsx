import React from 'react';

export function MetricCard({
  label,
  value,
  unit,
  subValue,
  icon: Icon,
  status = 'normal',
  progressPct,
  compact = false,
}) {
  let borderAccent = 'border-sky-500/20 hover:border-cyan-400/40';
  let valueColor = 'text-cyan-300';
  let barColor = 'bg-cyan-400';

  if (status === 'critical') {
    borderAccent = 'border-red-500/50 bg-red-950/20';
    valueColor = 'text-red-400';
    barColor = 'bg-red-500';
  } else if (status === 'warning') {
    borderAccent = 'border-amber-500/50 bg-amber-950/20';
    valueColor = 'text-amber-300';
    barColor = 'bg-amber-400';
  } else if (status === 'nominal') {
    valueColor = 'text-emerald-300';
    barColor = 'bg-emerald-400';
  }

  return (
    <div className={`mission-panel rounded-lg ${compact ? 'p-2.5' : 'p-3.5'} border transition-all duration-200 ${borderAccent}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 truncate">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-cyan-400/80 shrink-0" />}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`${compact ? 'text-lg' : 'text-xl'} font-mono font-bold tracking-tight ${valueColor}`}>
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>
      {typeof progressPct === 'number' && (
        <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full ${barColor} transition-all duration-300`}
            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
          />
        </div>
      )}
      {subValue && (
        <div className="mt-1.5 text-[11px] font-mono text-slate-400 truncate">
          {subValue}
        </div>
      )}
    </div>
  );
}
