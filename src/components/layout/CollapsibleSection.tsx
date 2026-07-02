import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function CollapsibleSection({ title, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="collapsible-section">
      <button className="collapsible-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronDown size={14} className={`collapsible-chevron ${open ? "open" : ""}`} />
      </button>
      <div className={`collapsible-content ${open ? "open" : ""}`}>
        {children}
      </div>
    </div>
  );
}