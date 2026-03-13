"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, MessageCircle, HelpCircle } from "lucide-react";
import PageShell from "@/components/PageShell";
import Disclaimer from "@/components/Disclaimer";
import { getEvents } from "@/lib/storage";
import { DiabetesEvent } from "@/lib/types";

interface Pattern {
  title: string;
  detail: string;
  category: string;
}

interface InsightData {
  summary: string;
  patterns: Pattern[];
  questions: string[];
  encouragement: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  meal: "bg-orange-50 text-orange-700 border-orange-200",
  exercise: "bg-blue-50 text-blue-700 border-blue-200",
  illness: "bg-red-50 text-red-700 border-red-200",
  stress: "bg-purple-50 text-purple-700 border-purple-200",
  high_bg: "bg-amber-50 text-amber-700 border-amber-200",
  low_bg: "bg-rose-50 text-rose-700 border-rose-200",
  low_treatment: "bg-pink-50 text-pink-700 border-pink-200",
  site_change: "bg-sky-50 text-sky-700 border-sky-200",
  medication: "bg-teal-50 text-teal-700 border-teal-200",
  general: "bg-stone-50 text-stone-700 border-stone-200",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  meal: "🍽️",
  exercise: "🏃",
  illness: "🤒",
  stress: "😰",
  high_bg: "📈",
  low_bg: "📉",
  low_treatment: "🧃",
  site_change: "💉",
  medication: "💊",
  general: "💡",
};

function getWeekEvents(events: DiabetesEvent[]): DiabetesEvent[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  return events.filter((e) => new Date(e.timestamp) >= cutoff);
}

function EventCountBar({ events }: { events: DiabetesEvent[] }) {
  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.category] = (counts[e.category] ?? 0) + 1;
  }
  const total = events.length;
  if (total === 0) return null;

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-4 mb-4 shadow-sm">
      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
        This week&apos;s events ({total} total)
      </p>
      <div className="flex flex-col gap-2">
        {sorted.map(([cat, count]) => (
          <div key={cat} className="flex items-center gap-2">
            <span className="text-sm w-5 text-center">{CATEGORY_EMOJIS[cat] ?? "📝"}</span>
            <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[#4a7c59] rounded-full transition-all"
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
            <span className="text-xs text-stone-500 w-16 text-right">
              {cat.replace("_", " ")} ({count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const [weekEvents, setWeekEvents] = useState<DiabetesEvent[]>([]);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const all = getEvents();
    setWeekEvents(getWeekEvents(all));
  }, []);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: weekEvents }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setInsights(data);
      setHasLoaded(true);
    } catch {
      setError("Couldn't load insights. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Weekly Insights" subtitle="Patterns from the past 7 days">
      <div className="px-4 pt-4 pb-4">
        <Disclaimer />

        <div className="mt-4">
          <EventCountBar events={weekEvents} />
        </div>

        {/* Generate button */}
        {!hasLoaded && (
          <button
            onClick={generateInsights}
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#4a7c59] text-white font-semibold rounded-2xl py-4 text-sm disabled:opacity-50 transition-opacity"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Analyzing patterns...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Weekly Insights
              </>
            )}
          </button>
        )}

        {error && (
          <p className="text-sm text-rose-500 text-center mt-3">{error}</p>
        )}

        {/* Insights */}
        {insights && (
          <div className="mt-5 flex flex-col gap-4">
            {/* Summary */}
            <div className="bg-[#4a7c59] text-white rounded-2xl p-4">
              <p className="text-sm leading-relaxed">{insights.summary}</p>
            </div>

            {/* Patterns */}
            {insights.patterns.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 px-1">
                  Patterns noticed
                </p>
                <div className="flex flex-col gap-2">
                  {insights.patterns.map((p, i) => {
                    const color = CATEGORY_COLORS[p.category] ?? CATEGORY_COLORS.general;
                    const emoji = CATEGORY_EMOJIS[p.category] ?? "💡";
                    return (
                      <div
                        key={i}
                        className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg mt-0.5">{emoji}</span>
                          <div>
                            <span
                              className={`inline-block text-xs border rounded-full px-2 py-0.5 font-medium mb-1 ${color}`}
                            >
                              {p.category.replace("_", " ")}
                            </span>
                            <p className="font-semibold text-sm text-stone-800">{p.title}</p>
                            <p className="text-sm text-stone-600 mt-0.5 leading-relaxed">
                              {p.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Questions for care team */}
            {insights.questions.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <HelpCircle size={14} className="text-stone-400" />
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Questions for your care team
                  </p>
                </div>
                <div className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm">
                  <ul className="flex flex-col gap-2">
                    {insights.questions.map((q, i) => (
                      <li key={i} className="flex gap-2 text-sm text-stone-700">
                        <MessageCircle
                          size={14}
                          className="text-[#4a7c59] shrink-0 mt-0.5"
                        />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Encouragement */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-800 leading-relaxed">
              💛 {insights.encouragement}
            </div>

            {/* Regenerate */}
            <button
              onClick={generateInsights}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 py-2 disabled:opacity-40"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh insights
            </button>

            <Disclaimer compact />
          </div>
        )}

        {weekEvents.length === 0 && !hasLoaded && (
          <div className="text-center py-10 text-stone-400 mt-2">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm font-medium text-stone-500">No events logged this week</p>
            <p className="text-xs mt-1 leading-relaxed px-4">
              Log events in the Event Log tab — then come back here to see patterns.
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
