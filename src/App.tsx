import Shell from "./components/layout/Shell";
import { useAppStore } from "./stores/appStore";
import { useEffect } from "react";
import "./styles/global.css";
import "./styles/components.css";

export default function App() {
  const { settings, loaded } = useAppStore();

  useEffect(() => {
    if (loaded) {
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

  if (!loaded) return null;
  return <Shell />;
}
