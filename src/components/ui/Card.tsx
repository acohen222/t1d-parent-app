import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Highlight color for left border accent */
  accent?: "green" | "blue" | "amber" | "rose" | "violet" | "sky" | "none";
  /** Makes the card feel tappable */
  interactive?: boolean;
}

const accentMap: Record<string, string> = {
  green:  "border-l-4 border-l-[#4a7c59]",
  blue:   "border-l-4 border-l-sky-400",
  amber:  "border-l-4 border-l-amber-400",
  rose:   "border-l-4 border-l-rose-400",
  violet: "border-l-4 border-l-violet-400",
  sky:    "border-l-4 border-l-sky-300",
  none:   "",
};

export default function Card({ children, className = "", onClick, accent = "none", interactive = false }: CardProps) {
  const base = "bg-white rounded-2xl border border-stone-100 shadow-sm";
  const tap = interactive || onClick ? "active:scale-[0.98] transition-transform cursor-pointer" : "";
  const accentClass = accentMap[accent] ?? "";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left ${base} ${tap} ${accentClass} ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${base} ${tap} ${accentClass} ${className}`}>
      {children}
    </div>
  );
}
