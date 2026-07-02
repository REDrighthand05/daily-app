import { Palette } from "lucide-react";

interface Props {
  accentColor: string;
  onChange: (color: string) => void;
}

const PRESETS = ["#4F8CFF", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#14B8A6"];

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xFF) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

export default function ThemePicker({ accentColor, onChange }: Props) {
  const handleChange = (color: string) => {
    document.documentElement.style.setProperty("--accent", color);
    document.documentElement.style.setProperty("--accent-hover", adjustColor(color, -20));
    onChange(color);
  };

  return (
    <div className="theme-picker">
      <div className="theme-picker-presets">
        {PRESETS.map((color) => (
          <button
            key={color}
            className={`theme-swatch ${accentColor === color ? "active" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => handleChange(color)}
            title={color}
          />
        ))}
      </div>
      <label className="theme-picker-custom">
        <Palette size={14} />
        <input
          type="color"
          value={accentColor}
          onChange={(e) => handleChange(e.target.value)}
        />
      </label>
    </div>
  );
}