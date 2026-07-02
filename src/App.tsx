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
      ipc.setWindowOpacity(settings.opacity).catch(() => {});
    }
  }, [settings.opacity, loaded]);

  if (!loaded)
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
      </div>
    );
  return <Shell />;
}
