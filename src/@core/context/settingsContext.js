// ** React Imports
import { createContext, useState, useEffect, useRef } from "react";

// ** ThemeConfig Import
import themeConfig from "src/configs/themeConfig";

const initialSettings = {
  themeColor: "primary",
  mode: themeConfig.mode,
  contentWidth: themeConfig.contentWidth,
};

// ** Create Context
export const SettingsContext = createContext({
  saveSettings: () => null,
  settings: initialSettings,
});

export const SettingsProvider = ({ children }) => {
  // ** State
  const [settings, setSettings] = useState({ ...initialSettings });

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const settingDisplay = localStorage.getItem("settingDisplay");
      if (settingDisplay) {
        const display = JSON.parse(settingDisplay);
        setSettings({ ...settings, mode: display.mode });
      }
      return;
    }
    localStorage.setItem("settingDisplay", JSON.stringify(settings));
  }, [settings.mode]);

  const saveSettings = (updatedSettings) => {
    setSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;
