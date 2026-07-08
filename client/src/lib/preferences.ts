// Preferences management with localStorage

export interface EditorPreferences {
  fontSize: number;
  theme: "pawn-dark" | "vs-dark" | "vs";
  minimapEnabled: boolean;
}

const DEFAULT_PREFERENCES: EditorPreferences = {
  fontSize: 13,
  theme: "pawn-dark",
  minimapEnabled: true,
};

const STORAGE_KEY = "pawn-ide-preferences";

/**
 * Load preferences from localStorage
 */
export function loadPreferences(): EditorPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch (error) {
    console.error("Failed to load preferences:", error);
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Save preferences to localStorage
 */
export function savePreferences(preferences: EditorPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
}

/**
 * Update a single preference
 */
export function updatePreference<K extends keyof EditorPreferences>(
  key: K,
  value: EditorPreferences[K]
): EditorPreferences {
  const current = loadPreferences();
  const updated = { ...current, [key]: value };
  savePreferences(updated);
  return updated;
}

/**
 * Reset preferences to default
 */
export function resetPreferences(): EditorPreferences {
  savePreferences(DEFAULT_PREFERENCES);
  return DEFAULT_PREFERENCES;
}
