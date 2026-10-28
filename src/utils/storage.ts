// ============================================================
// QUEENFORGE — Local Storage Utilities
// Save and restore user preferences and recent configurations
// ============================================================

const STORAGE_PREFIX = 'queenforge_';

interface SavedPreferences {
  boardSize: number;
  animationSpeed: number;
  lastPresetId: string | null;
  theme: 'dark';
}

interface SavedConfig {
  boardSize: number;
  restricted: { row: number; col: number }[];
  timestamp: number;
}

const DEFAULT_PREFERENCES: SavedPreferences = {
  boardSize: 8,
  animationSpeed: 50,
  lastPresetId: null,
  theme: 'dark',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function loadPreferences(): SavedPreferences {
  return getItem('preferences', DEFAULT_PREFERENCES);
}

export function savePreferences(prefs: Partial<SavedPreferences>): void {
  const current = loadPreferences();
  setItem('preferences', { ...current, ...prefs });
}

export function loadRecentConfigs(): SavedConfig[] {
  return getItem<SavedConfig[]>('recentConfigs', []);
}

export function saveRecentConfig(config: SavedConfig): void {
  const recent = loadRecentConfigs();
  // Keep last 10 configs
  recent.unshift(config);
  if (recent.length > 10) recent.pop();
  setItem('recentConfigs', recent);
}

export function clearStorage(): void {
  const keys = Object.keys(localStorage).filter((k) =>
    k.startsWith(STORAGE_PREFIX)
  );
  keys.forEach((k) => localStorage.removeItem(k));
}
