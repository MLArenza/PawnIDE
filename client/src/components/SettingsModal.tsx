import { useState } from "react";
import { EditorPreferences, resetPreferences } from "@/lib/preferences";
import "./SettingsModal.css";

interface SettingsModalProps {
  preferences: EditorPreferences;
  onPreferencesChange: (preferences: EditorPreferences) => void;
  onClose: () => void;
}

export default function SettingsModal({
  preferences,
  onPreferencesChange,
  onClose,
}: SettingsModalProps) {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleFontSizeChange = (size: number) => {
    const updated = { ...localPrefs, fontSize: size };
    setLocalPrefs(updated);
    onPreferencesChange(updated);
  };

  const handleThemeChange = (theme: EditorPreferences["theme"]) => {
    const updated = { ...localPrefs, theme };
    setLocalPrefs(updated);
    onPreferencesChange(updated);
  };

  const handleMinimapToggle = () => {
    const updated = { ...localPrefs, minimapEnabled: !localPrefs.minimapEnabled };
    setLocalPrefs(updated);
    onPreferencesChange(updated);
  };

  const handleReset = () => {
    if (confirm("Reset all settings to default?")) {
      const defaults = resetPreferences();
      setLocalPrefs(defaults);
      onPreferencesChange(defaults);
    }
  };

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-body">
          {/* Font Size Setting */}
          <div className="settings-group">
            <label className="settings-label">Font Size</label>
            <div className="settings-control">
              <input
                type="range"
                min="10"
                max="20"
                value={localPrefs.fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="settings-slider"
              />
              <span className="settings-value">{localPrefs.fontSize}px</span>
            </div>
            <div className="settings-preview">
              <code style={{ fontSize: `${localPrefs.fontSize}px` }}>
                SendClientMessage(playerid, -1, "Preview");
              </code>
            </div>
          </div>

          {/* Theme Setting */}
          <div className="settings-group">
            <label className="settings-label">Editor Theme</label>
            <div className="settings-options">
              {(["pawn-dark", "vs-dark", "vs"] as const).map((theme) => (
                <label key={theme} className="settings-radio">
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={localPrefs.theme === theme}
                    onChange={() => handleThemeChange(theme)}
                  />
                  <span className="settings-radio-label">
                    {theme === "pawn-dark"
                      ? "Pawn Dark (Default)"
                      : theme === "vs-dark"
                        ? "VS Dark"
                        : "VS Light"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimap Toggle */}
          <div className="settings-group">
            <label className="settings-label">Minimap</label>
            <div className="settings-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={localPrefs.minimapEnabled}
                  onChange={handleMinimapToggle}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">
                {localPrefs.minimapEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          {/* Reset Button */}
          <div className="settings-group">
            <button className="settings-reset-btn" onClick={handleReset}>
              Reset to Default
            </button>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
