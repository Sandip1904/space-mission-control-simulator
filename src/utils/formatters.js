// Formatting utilities for Mission Elapsed Time (MET), countdowns, and aerospace telemetry

export function formatMET(totalSeconds) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return `${String(hours).padStart(3, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatCountdown(deltaSeconds) {
  const isPast = deltaSeconds <= 0;
  const absSec = Math.abs(Math.floor(Number(deltaSeconds) || 0));
  const hours = Math.floor(absSec / 3600);
  const minutes = Math.floor((absSec % 3600) / 60);
  const seconds = absSec % 60;
  const prefix = isPast ? 'T+' : 'T-';
  return `${prefix}${String(hours).padStart(3, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatNumber(val, decimals = 1) {
  const num = Number(val);
  if (!Number.isFinite(num)) return '0.0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}
