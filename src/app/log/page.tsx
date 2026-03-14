"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import PageShell from "@/components/PageShell";
import { getEvents, saveEvent, deleteEvent, generateId } from "@/lib/storage";
import { DiabetesEvent, EventCategory } from "@/lib/types";

const CATEGORIES: { value: EventCategory; label: string; emoji: string; color: string }[] = [
  { value: "meal", label: "Meal", emoji: "🍽️", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "exercise", label: "Exercise", emoji: "🏃", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "illness", label: "Illness", emoji: "🤒", color: "bg-red-50 text-red-700 border-red-200" },
  { value: "stress", label: "Stress", emoji: "😰", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "site_change", label: "Site Change", emoji: "💉", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { value: "medication", label: "Medication", emoji: "💊", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { value: "high_bg", label: "High BG", emoji: "📈", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "low_bg", label: "Low BG", emoji: "📉", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { value: "low_treatment", label: "Low Treatment", emoji: "🧃", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { value: "other", label: "Other", emoji: "📝", color: "bg-stone-50 text-stone-700 border-stone-200" },
];

function categoryInfo(cat: EventCategory) {
  return CATEGORIES.find((c) => c.value === cat) ?? CATEGORIES[CATEGORIES.length - 1];
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (dDay.getTime() === today.getTime()) return `Today, ${time}`;
  if (dDay.getTime() === yesterday.getTime()) return `Yesterday, ${time}`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + `, ${time}`;
}

export default function LogPage() {
  const [events, setEvents] = useState<DiabetesEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<EventCategory>("meal");
  const [note, setNote] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleAdd = () => {
    if (!note.trim()) return;
    const event: DiabetesEvent = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      category,
      note: note.trim(),
      bloodSugar: bloodSugar ? parseFloat(bloodSugar) : undefined,
    };
    saveEvent(event);
    setEvents(getEvents());
    setNote("");
    setBloodSugar("");
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    setEvents(getEvents());
  };

  return (
    <PageShell
      title="Event Log"
      subtitle="Track what affects blood sugar"
      headerRight={
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 bg-[#2E7FD4] text-white text-xs font-semibold rounded-full px-3 py-1.5"
        >
          <Plus size={14} />
          Add Event
        </button>
      }
    >
      <div className="px-4 pt-4">
        {/* Add Event Form */}
        {showForm && (
          <div className="bg-white border border-[#B8D4EE] rounded-xl p-4 mb-5 shadow-[0_2px_12px_rgba(26,95,168,0.08)]">
            <h3 className="font-semibold text-stone-700 mb-3 text-sm">New Event</h3>

            {/* Category picker */}
            <p className="text-xs text-stone-500 mb-2">Category</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`text-xs border rounded-full px-3 py-1 transition-all ${
                    category === cat.value
                      ? cat.color + " font-semibold"
                      : "bg-white text-stone-500 border-stone-200"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Blood sugar (optional) */}
            <div className="mb-3">
              <label className="text-xs text-stone-500 block mb-1">
                Blood Sugar (mg/dL) — optional
              </label>
              <input
                type="number"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                placeholder="e.g. 210"
                className="w-full border border-[#B8D4EE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:shadow-[0_0_0_2px_#2E7FD4] focus:border-transparent transition-all"
              />
            </div>

            {/* Note */}
            <div className="mb-4">
              <label className="text-xs text-stone-500 block mb-1">
                Note <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What happened? (e.g. 'Big pasta dinner, more carbs than usual')"
                rows={2}
                className="w-full border border-[#B8D4EE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:shadow-[0_0_0_2px_#2E7FD4] focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={!note.trim()}
                className="flex-1 bg-[#2E7FD4] text-white font-bold rounded-[50px] py-2.5 text-sm disabled:opacity-45 hover:bg-[#1A5FA8] transition-colors"
              >
                Save Event
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 bg-stone-100 text-stone-600 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Event list */}
        {events.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium text-stone-500">No events logged yet</p>
            <p className="text-sm mt-1">
              Tap &ldquo;Add Event&rdquo; to start tracking what affects blood sugar
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-4">
            {events.map((event) => {
              const cat = categoryInfo(event.category);
              const expanded = expandedId === event.id;
              return (
                <div
                  key={event.id}
                  className="bg-white border border-[#B8D4EE] rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(26,95,168,0.08)]"
                >
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    onClick={() => setExpandedId(expanded ? null : event.id)}
                  >
                    <span className="text-xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs border rounded-full px-2 py-0.5 font-medium ${cat.color}`}>
                          {cat.label}
                        </span>
                        {event.bloodSugar && (
                          <span className="text-xs text-stone-500">
                            {event.bloodSugar} mg/dL
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">
                        {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                    {expanded ? (
                      <ChevronUp size={16} className="text-stone-300 shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-stone-300 shrink-0" />
                    )}
                  </button>

                  {expanded && (
                    <div className="px-4 pb-3 border-t border-stone-50">
                      <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                        {event.note}
                      </p>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-rose-400 hover:text-rose-600"
                      >
                        <Trash2 size={12} />
                        Delete event
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
