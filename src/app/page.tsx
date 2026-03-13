"use client";

import Link from "next/link";
import { MessageCircle, ClipboardList, BarChart2, BookOpen, Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const features = [
  {
    href: "/ask",
    icon: MessageCircle,
    color: "bg-sky-50 text-sky-600",
    border: "border-sky-100",
    title: "Ask Why",
    desc: "Understand what might be affecting blood sugar levels",
  },
  {
    href: "/log",
    icon: ClipboardList,
    color: "bg-violet-50 text-violet-600",
    border: "border-violet-100",
    title: "Event Log",
    desc: "Track meals, exercise, illness, and more",
  },
  {
    href: "/insights",
    icon: BarChart2,
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
    title: "Weekly Insights",
    desc: "Spot patterns across the past 7 days",
  },
  {
    href: "/guide",
    icon: BookOpen,
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
    title: "Care Guide",
    desc: "Emergency steps and contact info for caregivers",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Hero header */}
      <header className="bg-[#4a7c59] text-white px-5 pt-14 pb-8 safe-area-pt">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={18} className="fill-white/80 stroke-none" />
            <span className="text-white/70 text-xs font-medium tracking-wide uppercase">
              T1D Parent Copilot
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-snug">
            You&apos;re doing great.
          </h1>
          <p className="mt-1.5 text-white/80 text-sm leading-relaxed">
            A calm, supportive companion for parents navigating Type 1 Diabetes — one day at a time.
          </p>
        </div>
      </header>

      {/* Feature cards */}
      <main className="flex-1 px-4 pt-6 pb-28 max-w-md mx-auto w-full">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4 px-1">
          What do you need right now?
        </p>

        <div className="grid grid-cols-1 gap-3">
          {features.map(({ href, icon: Icon, color, border, title, desc }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 bg-white rounded-2xl border ${border} p-4 shadow-sm active:scale-[0.98] transition-transform`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-stone-800 text-sm">{title}</p>
                <p className="text-xs text-stone-500 mt-0.5 leading-snug">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-center text-xs text-stone-400 mt-8 leading-relaxed px-4">
          This app is for informational support only.<br />
          Always consult your diabetes care team for medical decisions.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
