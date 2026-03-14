"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, AlertTriangle, TrendingUp, Droplets, Thermometer,
  Phone, CheckCircle2, ShieldAlert,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import DecisionTree from "@/components/DecisionTree";
import { URGENT_GUIDES } from "@/lib/urgentGuides";
import { DECISION_TREES } from "@/lib/decisionTrees";
import { getChildProfile } from "@/lib/storage";

const ICON_MAP: Record<string, React.ElementType> = {
  low: Droplets,
  high: TrendingUp,
  ketones: AlertTriangle,
  "sick-day": Thermometer,
};

export default function UrgentGuidePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const guide = URGENT_GUIDES[id];
  const tree = DECISION_TREES[id];
  const profile = getChildProfile();

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "var(--color-frost)" }}>
        <p className="text-[#2D4A63] font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
          Guide not found.
        </p>
        <button
          onClick={() => router.back()}
          className="text-[#1A5FA8] text-sm font-semibold"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Go back
        </button>
      </div>
    );
  }

  const Icon = ICON_MAP[id] ?? ShieldAlert;

  // Use the interactive decision tree when a tree exists AND we have a profile
  const useTree = !!(tree && profile);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-frost)" }}>
      {/* Hero header with gradient */}
      <header
        className="relative text-white px-5 pt-14 pb-8 safe-area-pt overflow-hidden"
        style={{ background: guide.gradient }}
      >
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute -bottom-6 -left-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

        <div className="max-w-md mx-auto relative z-10">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors mb-5 -ml-1"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>Back</span>
          </button>

          {/* Icon + title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
              <Icon size={26} className="text-white" />
            </div>
            <div>
              <h1
                className="font-extrabold text-2xl leading-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {guide.title}
              </h1>
              <p className="text-white/80 text-sm mt-0.5 leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                {useTree
                  ? `Personalized for ${profile!.name}`
                  : guide.tagline}
              </p>
            </div>
          </div>

          {/* Interactive badge */}
          {useTree && (
            <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-semibold text-white" style={{ fontFamily: "var(--font-body)" }}>
                Interactive guide — one step at a time
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 pt-5 pb-28 max-w-md mx-auto w-full space-y-3">

        {/* Emergency banner — always shown */}
        <div
          className="rounded-2xl p-4 flex gap-3 border"
          style={{
            background: `${guide.accentHex}12`,
            borderColor: `${guide.accentHex}40`,
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${guide.accentHex}25` }}
          >
            <Phone size={15} style={{ color: guide.accentHex }} />
          </div>
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wide mb-0.5"
              style={{ color: guide.accentHex, fontFamily: "var(--font-body)" }}
            >
              Emergency
            </p>
            <p className="text-sm text-[#1A3A5C] leading-snug" style={{ fontFamily: "var(--font-body)" }}>
              {guide.emergencyNote}
            </p>
          </div>
        </div>

        {/* ── Interactive decision tree (low + high when profile exists) ── */}
        {useTree ? (
          <DecisionTree
            tree={tree}
            profile={profile!}
            accentHex={guide.accentHex}
          />
        ) : (
          /* ── Static step list (ketones, sick-day, or no profile) ── */
          <div className="space-y-2.5 pt-1">
            {guide.steps.map((step, idx) => (
              <div
                key={step.id}
                className={`bg-white rounded-2xl border shadow-[0_2px_12px_rgba(26,95,168,0.07)] overflow-hidden ${step.isCritical ? "ring-2 ring-red-400" : ""}`}
                style={{ borderColor: step.isCritical ? "#FCA5A5" : "#B8D4EE" }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Step number */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold mt-0.5"
                      style={{ background: step.isCritical ? "#EF4444" : guide.accentHex }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold text-[#1A3A5C] text-sm leading-snug"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-[#5A8EB8] text-xs mt-1.5 leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Warning block */}
                  {step.warning && (
                    <div className="mt-3 ml-10 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                      <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-700 text-xs leading-snug font-medium" style={{ fontFamily: "var(--font-body)" }}>
                        {step.warning}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No-profile nudge for tree-eligible guides */}
        {tree && !profile && (
          <div
            className="rounded-2xl p-4 flex gap-3 border border-[#B8D4EE]"
            style={{ background: "#EBF4FF" }}
          >
            <div className="w-8 h-8 rounded-xl bg-[#1A5FA8]/10 flex items-center justify-center shrink-0">
              <ShieldAlert size={15} className="text-[#1A5FA8]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1A3A5C] mb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                Personalize this guide
              </p>
              <p className="text-xs text-[#5A8EB8] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Set up your child&apos;s profile to unlock the interactive, step-by-step decision tree with your child&apos;s specific thresholds and treatment details.
              </p>
            </div>
          </div>
        )}

        {/* Footer disclaimer */}
        <div className="bg-white rounded-2xl border border-[#B8D4EE] shadow-[0_2px_12px_rgba(26,95,168,0.07)] p-4 flex gap-3 items-start">
          <CheckCircle2 size={18} className="text-[#2E7FD4] shrink-0 mt-0.5" />
          <p className="text-xs text-[#5A8EB8] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            These steps reflect common care-team guidance. Always follow your child&apos;s
            individual diabetes management plan and consult your care team when uncertain.
          </p>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
