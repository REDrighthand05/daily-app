import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/appStore";

const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "zh-CN", label: "中文" },
];

export default function LanguagePicker() {
  const { i18n } = useTranslation();
  const { settings, updateSettings } = useAppStore();

  const handleChange = async (code: string) => {
    await i18n.changeLanguage(code);
    updateSettings({ language: code });
  };

  return (
    <div className="settings-options">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`settings-option ${settings.language === lang.code ? "active" : ""}`}
          onClick={() => handleChange(lang.code)}
        >
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}