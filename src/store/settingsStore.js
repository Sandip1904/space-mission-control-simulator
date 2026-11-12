// Global Settings & Customization Store with safe localStorage persistence
import { create } from 'zustand';

const STORAGE_KEY = 'aero_ops_mission_settings_v1';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  compactMode: false,
  telemetryRefreshMs: 1000,
  defaultSimSpeed: 1,
  soundEnabled: true,
  animationsEnabled: true,
  thresholds: {
    minO2Pct: 92,
    minBatteryPct: 35,
    maxCabinTempC: 27,
    maxEngineTempC: 780,
    maxCo2Ppm: 900,
    minCabinPressureKpa: 92,
    minFuelPct: 28,
  },
};

function loadPersistedSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      thresholds: {
        ...DEFAULT_SETTINGS.thresholds,
        ...(parsed.thresholds || {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function savePersistedSettings(state) {
  try {
    const payload = {
      theme: state.theme,
      compactMode: state.compactMode,
      telemetryRefreshMs: state.telemetryRefreshMs,
      defaultSimSpeed: state.defaultSimSpeed,
      soundEnabled: state.soundEnabled,
      animationsEnabled: state.animationsEnabled,
      thresholds: state.thresholds,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or sandbox restrictions
  }
}

export const useSettingsStore = create((set, get) => ({
  ...loadPersistedSettings(),

  setTheme: (theme) => {
    set({ theme });
    savePersistedSettings(get());
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: next });
    savePersistedSettings(get());
  },

  setCompactMode: (compactMode) => {
    set({ compactMode });
    savePersistedSettings(get());
  },

  setTelemetryRefreshMs: (telemetryRefreshMs) => {
    set({ telemetryRefreshMs: Number(telemetryRefreshMs) || 1000 });
    savePersistedSettings(get());
  },

  setDefaultSimSpeed: (defaultSimSpeed) => {
    set({ defaultSimSpeed: Number(defaultSimSpeed) || 1 });
    savePersistedSettings(get());
  },

  setSoundEnabled: (soundEnabled) => {
    set({ soundEnabled });
    savePersistedSettings(get());
  },

  setAnimationsEnabled: (animationsEnabled) => {
    set({ animationsEnabled });
    savePersistedSettings(get());
  },

  updateThreshold: (key, value) => {
    const nextThresholds = {
      ...get().thresholds,
      [key]: Number(value),
    };
    set({ thresholds: nextThresholds });
    savePersistedSettings(get());
  },

  resetSettings: () => {
    set({ ...DEFAULT_SETTINGS });
    savePersistedSettings(DEFAULT_SETTINGS);
  },
}));
