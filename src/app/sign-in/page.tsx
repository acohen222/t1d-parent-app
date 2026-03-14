"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    color: "bg-[#E8F2FB] text-[#2E7FD4]",
    text: "Share a caregiver guide with anyone watching your child",
  },
  {
    icon: BarChart2,
    color: "bg-violet-50 text-violet-500",
    text: "Spot weekly trends in plain language",
  },
  {
    icon: Shield,
    color: "bg-[#E8F2FB] text-[#1A5FA8]",
    text: "Quick-log meals, exercise, illness, and more in seconds",
  },
];

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    if (getChildProfile()) {
      router.replace("/");
    }
  }, [router]);

  const handleGetStarted = () => {
    router.push("/profile/setup");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-frost)" }}>
      {/* Hero */}
      <div
        className="px-5 pt-16 pb-14 text-white relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -left-8 w-36 h-36 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #56CCF2 0%, transparent 70%)" }} />
        <div className="absolute -bottom-6 right-12 w-24 h-24 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #A8E6FF 0%, transparent 70%)" }} />

        <div className="max-w-md mx-auto relative z-10">
          {/* Logo centered */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden mb-3">
              <Image
                src="/sugarwise_logo.png"
                alt="SugarWise"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <span
              className="font-extrabold tracking-tight text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-[#A8E6FF]">Sugar</span><span className="text-white">Wise</span>
            </span>
            <p
              className="text-white/60 text-[11px] uppercase tracking-[2.5px] mt-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              T1D Parent Companion App
            </p>
          </div>

          <h1
            className="text-2xl font-extrabold leading-tight text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Managing T1D is hard.<br />
            You don&apos;t have to do it alone.
          </h1>
          <p className="mt-3 text-white/80 text-sm leading-relaxed text-center" style={{ fontFamily: "var(--font-body)" }}>
            A warm, supportive companion for families navigating
            Type 1 Diabetes — one moment at a time.
          </p>
        </div>
      </div>

      {/* Features list */}
      <div className="flex-1 px-5 pt-7 pb-10 max-w-md mx-auto w-full">
        <p
          className="text-[11px] font-semibold text-[#5A8EB8] uppercase tracking-[2.5px] mb-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          What this app does
        </p>
        <div className="flex flex-col gap-3 mb-8">
          {FEATURES.map(({ icon: Icon, color, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={17} />
              </div>
              <p className="text-sm text-[#2D4A63] leading-snug pt-2" style={{ fontFamily: "var(--font-body)" }}>{text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          size="lg"
          fullWidth
          onClick={handleGetStarted}
        >
          Set up your family profile
        </Button>

        {/* MVP notice */}
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold uppercase tracking-wide text-[10px] text-amber-600 block mb-1">
            MVP — No account required
          </span>
          All data is saved locally on this device. Sign-in and cloud sync will
          be added in a future release.
        </div>

        {/* Medical disclaimer */}
        <p className="text-center text-[11px] text-[#5A8EB8] mt-6 leading-relaxed px-2" style={{ fontFamily: "var(--font-body)" }}>
          This app does not provide dosing advice or make medical decisions.
          Always consult your diabetes care team.
        </p>
      </div>
    </div>
  );
}
