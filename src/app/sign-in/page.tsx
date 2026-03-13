"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Shield, BookOpen, BarChart2 } from "lucide-react";
import { getChildProfile } from "@/lib/storage";
import Button from "@/components/ui/Button";

const FEATURES = [
  {
    icon: Heart,
    color: "bg-rose-50 text-rose-500",
    text: "Understand blood sugar patterns without panic",
  },
  {
    icon: BookOpen,
    color: "bg-sky-50 text-sky-500",
    text: "Share a caregiver guide with anyone watching your child",
  },
  {
    icon: BarChart2,
    color: "bg-violet-50 text-violet-500",
    text: "Spot weekly trends in plain language",
  },
  {
    icon: Shield,
    color: "bg-emerald-50 text-emerald-600",
    text: "Quick-log meals, exercise, illness, and more in seconds",
  },
];

export default function SignInPage() {
  const router = useRouter();

  // If a profile already exists, skip landing and go straight to dashboard
  useEffect(() => {
    if (getChildProfile()) {
      router.replace("/");
    }
  }, [router]);

  const handleGetStarted = () => {
    router.push("/profile/setup");
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Hero */}
      <div className="bg-[#4a7c59] px-5 pt-16 pb-10 text-white">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Heart size={18} className="fill-white stroke-none" />
            </div>
            <span className="font-semibold tracking-tight">T1D Parent Copilot</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight">
            Managing T1D is hard.<br />
            You don&apos;t have to do it alone.
          </h1>
          <p className="mt-3 text-white/80 text-sm leading-relaxed">
            A calm, supportive companion for parents and caregivers navigating
            Type 1 Diabetes — one moment at a time.
          </p>
        </div>
      </div>

      {/* Features list */}
      <div className="flex-1 px-5 pt-7 pb-10 max-w-md mx-auto w-full">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          What this app does
        </p>
        <div className="flex flex-col gap-3 mb-8">
          {FEATURES.map(({ icon: Icon, color, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={17} />
              </div>
              <p className="text-sm text-stone-700 leading-snug pt-2">{text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          size="lg"
          fullWidth
          onClick={handleGetStarted}
        >
          Set up your child&apos;s profile
        </Button>

        {/* MVP notice — clearly labeled */}
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold uppercase tracking-wide text-[10px] text-amber-600 block mb-1">
            MVP — No account required
          </span>
          All data is saved locally on this device. Sign-in and cloud sync will
          be added in a future release.
        </div>

        {/* Medical disclaimer */}
        <p className="text-center text-[11px] text-stone-400 mt-6 leading-relaxed px-2">
          This app does not provide dosing advice or make medical decisions.
          Always consult your diabetes care team.
        </p>
      </div>
    </div>
  );
}
