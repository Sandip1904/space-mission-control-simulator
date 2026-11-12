import React from 'react';

export function StatusBadge({ status = 'NOMINAL', size = 'sm' }) {
  const normalized = String(status).toUpperCase();

  let colorClasses = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
  let dotClasses = 'bg-cyan-400';

  if (
    normalized.includes('EMERGENCY') ||
    normalized.includes('CRITICAL') ||
    normalized.includes('ABORT') ||
    normalized.includes('FAULT')
  ) {
    colorClasses = 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse';
    dotClasses = 'bg-red-400';
  } else if (
    normalized.includes('WARNING') ||
    normalized.includes('CAUTION') ||
    normalized.includes('DELAYED') ||
    normalized.includes('FALLBACK') ||
    normalized.includes('LEAK') ||
    normalized.includes('STALL') ||
    normalized.includes('PAUSED')
  ) {
    colorClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
    dotClasses = 'bg-amber-400';
  } else if (
    normalized.includes('COMPLETED') ||
    normalized.includes('RESOLVED') ||
    normalized.includes('NOMINAL') ||
    normalized.includes('RUNNING') ||
    normalized.includes('LOCKED') ||
    normalized.includes('ACTIVE')
  ) {
    colorClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
    dotClasses = 'bg-emerald-400';
  } else if (normalized.includes('INFORMATIONAL') || normalized.includes('UPCOMING') || normalized.includes('SCHEDULED')) {
    colorClasses = 'bg-sky-500/15 text-sky-300 border-sky-500/40';
    dotClasses = 'bg-sky-400';
  }

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5'
    : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider rounded border ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses}`} />
      {status}
    </span>
  );
}
