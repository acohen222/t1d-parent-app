import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Highlight color for left border accent */
  accent?: "brand" | "blue" | "amber" | "rose" | "violet" | "sky" | "none";
  /** Makes the card feel tappable */
  interactive?: boolean;
}

const accentMap: Record<string, string> = {
  brand:  "border-l-4 border-l-[#1A5FA8]",
  blue:   "border-l-4 border-l-[#2E7FD4]",
  amber:  "border-l-4 border-l-amber-400",
  rose:   "border-l-4 border-l-rose-400",
  violet: "border-l-4 border-l-violet-400",
  sky:    "border-l-4 border-l-[#5BA8E8]",
  none:   "",
};

export default function Card({ children, className = "", onClick, accent = "none", interactive = false }: CardProps) {
  const base = "bg-white rounded-xl border border-[#B8D4EE]";
  const shadow = "shadow-[0_2px_12px_rgba(26,95,168,0.08)]";
  const hover = interactive || onClick
    ? "hover:shadow-[0_4px_20px_rgba(26,95,168,0.12)] hover:-translate-y-px transition-all duration-200"
    : "";
  const tap = interactive || onClick ? "active:scale-[0.98] cursor-pointer" : "";
  const accentClass = accentMap[accent] ?? "";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left ${base} ${shadow} ${hover} ${tap} ${accentClass} ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${base} ${shadow} ${hover} ${tap} ${accentClass} ${className}`}>
      {children}
    </div>
  );
}
