"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp, TrendingDown, ClipboardList, BarChart2,
  BookOpen, Settings, ChevronRight,
  Utensils, Dumbbell, Thermometer, Zap, AlertTriangle, Droplets,
  Siren,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Card from "@/components/ui/Card";
import { getChildProfile, getEvents, saveEvent, generateId } from "@/lib/storage";
import { ChildProfile, EventCategory } from "@/lib/types";
import { URGENT_GUIDES } from "@/lib/urgentGuides";

// ─── Quick-log button config ─────────────────────────────────────
interface QuickLog {
  category: EventCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  ringColor: string;
}

const QUICK_LOGS: QuickLog[] = [
  { category: "meal",          label: "Meal",     icon: Utensils,      color: "bg-orange-50 text-orange-600",  ringColor: "ring-orange-300" },
  { category: "exercise",      label: "Exercise", icon: Dumbbell,      color: "bg-blue-50 text-blue-600",      ringColor: "ring-blue-300" },
  { category: "illness",       label: "Illness",  icon: Thermometer,   color: "bg-red-50 text-red-600",        ringColor: "ring-red-300" },
  { category: "site_change",   label: "Site",     icon: Zap,           color: "bg-[#E8F2FB] text-[#2E7FD4]",  ringColor: "ring-[#5BA8E8]" },
  { category: "stress",        label: "Stress",   icon: AlertTriangle, color: "bg-violet-50 text-violet-600",  ringColor: "ring-violet-300" },
  { category: "low_treatment", label: "Low Tx",   icon: Droplets,      color: "bg-rose-50 text-rose-600",      ringColor: "ring-rose-300" },
];

// ─── Dashboard action cards ───────────────────────────────────────
const ACTION_CARDS = [
  {
    href: "/ask?q=why+is+my+child%27s+blood+sugar+high",
    icon: TrendingUp,
    accent: "amber" as const,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    title: "Why is BG high?",
    desc: "Explore possible causes of elevated blood sugar",
  },
  {
    href: "/ask?q=why+is+my+child%27s+blood+sugar+dropping",
    icon: TrendingDown,
    accent: "rose" as const,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    title: "Why is BG dropping?",
    desc: "Understand what might be driving a low",
  },
  {
    href: "/log",
    icon: ClipboardList,
    accent: "brand" as const,
    iconColor: "text-[#1A5FA8]",
    iconBg: "bg-[#E8F2FB]",
    title: "Log event",
    desc: "Record a meal, exercise, illness, or site change",
  },
  {
    href: "/insights",
    icon: BarChart2,
    accent: "blue" as const,
    iconColor: "text-[#2E7FD4]",
    iconBg: "bg-[#E8F2FB]",
    title: "View patterns",
    desc: "Weekly insights from your event log",
  },
  {
    href: "/guide",
    icon: BookOpen,
    accent: "violet" as const,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    title: "Caregiver guide",
    desc: "Share emergency steps with anyone watching your child",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [recentCount, setRecentCount] = useState(0);
  const [logged, setLogged] = useState<EventCategory | null>(null);

  useEffect(() => {
    const p = getChildProfile();
    if (!p) {
      router.replace("/sign-in");
      return;
    }
    setProfile(p);

    const events = getEvents();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    setRecentCount(events.filter((e) => new Date(e.timestamp).getTime() > oneDayAgo).length);
  }, [router]);

  const handleQuickLog = (category: EventCategory) => {
    const event = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      category,
      note: "",
    };
    saveEvent(event);
    setLogged(category);
    setRecentCount((n) => n + 1);
    setTimeout(() => setLogged(null), 1800);
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-frost)" }}>
      {/* Header */}
      <header
        className="text-white px-5 pt-14 pb-6 safe-area-pt relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -left-6 w-28 h-28 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #56CCF2 0%, transparent 70%)" }} />

        {/* Settings button top-right */}
        <div className="max-w-md mx-auto flex justify-end relative z-10 mb-2">
          <Link
            href="/profile/setup"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            aria-label="Profile settings"
          >
            <Settings size={17} />
          </Link>
        </div>

        {/* Centered logo + brand */}
        <div className="max-w-md mx-auto flex flex-col items-center relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-xl overflow-hidden mb-3">
            <Image
              src="/sugarwise_logo.png"
              alt="SugarWise"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <span
            className="font-extrabold text-2xl tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-[#A8E6FF]">Sugar</span><span className="text-white">Wise</span>
          </span>
          <h1
            className="text-xl font-extrabold leading-snug text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {greeting}{profile.name ? `, ${profile.name}'s family` : ""}.
          </h1>
          <p className="text-white/75 text-sm mt-0.5 text-center" style={{ fontFamily: "var(--font-body)" }}>
            You&apos;re doing great — one moment at a time.
          </p>
        </div>

        {recentCount > 0 && (
          <div className="max-w-md mx-auto mt-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 text-xs rounded-full px-3 py-1" style={{ fontFamily: "var(--font-body)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              {recentCount} event{recentCount !== 1 ? "s" : ""} logged today
            </span>
          </div>
        )}
      </header>

      <main className="flex-1 px-4 pt-5 pb-28 max-w-md mx-auto w-full space-y-6">

        {/* ── Quick-log strip ─────────────────────────────────── */}
        <section>
          <p
            className="text-xs font-semibold text-[#5A8EB8] uppercase tracking-[2.5px] mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Quick log
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {QUICK_LOGS.map(({ category, label, icon: Icon, color, ringColor }) => {
              const active = logged === category;
              return (
                <button
                  key={category}
                  onClick={() => handleQuickLog(category)}
                  className={`
                    flex flex-col items-center gap-1.5 py-4 rounded-xl border transition-all active:scale-95
                    ${active
                      ? `${color} ring-2 ${ringColor} border-transparent shadow-[0_4px_20px_rgba(26,95,168,0.12)]`
                      : "bg-white border-[#B8D4EE] shadow-[0_2px_12px_rgba(26,95,168,0.08)]"
                    }
                  `}
                  aria-label={`Quick log ${label}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={19} />
                  </div>
                  <span className="text-xs font-medium text-[#2D4A63]" style={{ fontFamily: "var(--font-body)" }}>{label}</span>
                  {active && (
                    <span className="text-[10px] text-[#5A8EB8] -mt-0.5">Logged ✓</span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[#5A8EB8] text-center mt-2" style={{ fontFamily: "var(--font-body)" }}>
            Tap to log instantly — add notes anytime in Event Log
          </p>
        </section>

        {/* ── Urgent Guides ─────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0 animate-pulse">
              <Siren size={11} className="text-white" />
            </div>
            <p
              className="text-xs font-semibold text-red-600 uppercase tracking-[2.5px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Emergency Protocols
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {(["low", "high", "ketones", "sick-day"] as const).map((key) => {
              const guide = URGENT_GUIDES[key];
              const IconMap: Record<string, React.ElementType> = {
                low: Droplets,
                high: TrendingUp,
                ketones: AlertTriangle,
                "sick-day": Thermometer,
              };
              const Icon = IconMap[key];
              return (
                <Link key={key} href={`/urgent/${key}`}>
                  <div
                    className="relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:scale-[0.97] transition-transform duration-150 select-none"
                    style={{ background: guide.gradient }}
                  >
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 p-4">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                        <Icon size={18} className="text-white" />
                      </div>
                      <p
                        className="font-extrabold text-white text-[15px] leading-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {guide.shortTitle}
                      </p>
                      <p className="text-white/75 text-[10px] mt-0.5 leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                        {guide.tagline}
                      </p>
                      <div className="mt-3 flex items-center gap-1">
                        <span className="text-white/90 text-[10px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                          View steps
                        </span>
                        <ChevronRight size={11} className="text-white/90" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Action cards ──────────────────────────────────── */}
        <section>
          <p
            className="text-xs font-semibold text-[#5A8EB8] uppercase tracking-[2.5px] mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            What do you need right now?
          </p>
          <div className="flex flex-col gap-2.5">
            {ACTION_CARDS.map(({ href, icon: Icon, accent, iconColor, iconBg, title, desc }) => (
              <Link key={href} href={href}>
                <Card accent={accent} interactive className="px-4 py-3.5">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                      <Icon size={19} className={iconColor} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-bold text-[#1A3A5C] text-sm"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {title}
                      </p>
                      <p className="text-xs text-[#5A8EB8] mt-0.5 leading-snug" style={{ fontFamily: "var(--font-body)" }}>{desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-[#B8D4EE] shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ──────────────────────────────────── */}
        <p className="text-center text-[11px] text-[#5A8EB8] leading-relaxed px-4 pb-2" style={{ fontFamily: "var(--font-body)" }}>
          Informational only — not a substitute for medical advice.<br />
          Always consult your diabetes care team.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
