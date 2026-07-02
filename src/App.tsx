import Shell from "./components/layout/Shell";
import { useAppStore } from "./stores/appStore";
import { useEffect } from "react";
import * as ipc from "./bridge/ipc";
import "./styles/global.css";
import "./styles/components.css";

export default function App() {
  const { settings, loaded, loadAll } = useAppStore();

  useEffect(() => {
    if (!loaded) {
      loadAll();
      return;
    }
    if (loaded) {
      const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      ipc.setWindowOpacity(settings.opacity, isDark).catch(() => {});
      document.documentElement.setAttribute(
        "data-theme",
        settings.theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : settings.theme
      );
    }
  }, [settings.theme, loaded]);

  if (!loaded)
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
      </div>
    );
  return <Shell />;
}
