import { Info } from "lucide-react";

interface DisclaimerProps {
  compact?: boolean;
}

export default function Disclaimer({ compact = false }: DisclaimerProps) {
  if (compact) {
    return (
      <p className="text-[10px] text-stone-400 text-center leading-tight px-4">
        Informational only — not a substitute for medical advice. Always consult your diabetes care team.
      </p>
    );
  }

  return (
    <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
      <Info size={14} className="shrink-0 mt-0.5 text-amber-500" />
      <p className="leading-relaxed">
        <span className="font-semibold">Informational only.</span> This app does not provide insulin dosing advice or make medical decisions. Always consult your diabetes care team for treatment guidance.
      </p>
    </div>
  );
}
