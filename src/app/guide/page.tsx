"use client";

import { useState, useEffect } from "react";
import { Save, Edit2, Phone, AlertTriangle, BookOpen, User, Printer } from "lucide-react";
import PageShell from "@/components/PageShell";
import Disclaimer from "@/components/Disclaimer";
import { getCareGuide, saveCareGuide } from "@/lib/storage";
import { CareGuide } from "@/lib/types";

const DEFAULT_HIGH_STEPS = `1. Check blood sugar reading and confirm it's accurate
2. Check for ketones if BG is above your care team's threshold
3. Look for possible causes: missed dose, site issue, illness, or food
4. Follow your care team's sick-day and correction guidelines
5. Offer water and encourage rest
6. Call your care team if BG stays elevated or ketones are moderate/high`;

const DEFAULT_LOW_STEPS = `1. Check blood sugar reading and confirm it's accurate
2. If your child can swallow safely: give fast-acting carbs (15g rule — follow care team's guidance)
3. Wait 15 minutes and recheck
4. If still low, repeat the treatment
5. Once stable, give a small protein/carb snack if the next meal is more than an hour away
6. Do NOT leave child unattended
7. Call 911 if child is unconscious, having a seizure, or cannot swallow`;

const EMPTY_GUIDE: CareGuide = {
  childName: "",
  diagnosisDate: "",
  targetRangeLow: 70,
  targetRangeHigh: 180,
  highThreshold: 250,
  lowThreshold: 70,
  emergencyContact1Name: "",
  emergencyContact1Phone: "",
  emergencyContact2Name: "",
  emergencyContact2Phone: "",
  doctorName: "",
  doctorPhone: "",
  highBgSteps: DEFAULT_HIGH_STEPS,
  lowBgSteps: DEFAULT_LOW_STEPS,
  schoolNotes: "",
  updatedAt: "",
};

type SectionKey = "info" | "contacts" | "high" | "low" | "school";

function Section({
  title,
  icon: Icon,
  children,
  open,
  onToggle,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm mb-3">
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
        onClick={onToggle}
      >
        <Icon size={16} className="text-[#4a7c59] shrink-0" />
        <span className="font-semibold text-stone-800 text-sm flex-1">{title}</span>
        <span className="text-stone-300 text-lg leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4 border-t border-stone-50">{children}</div>}
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="mt-3">
      <label className="text-xs text-stone-500 block mb-1">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT =
  "w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4a7c59] transition-colors";
const TEXTAREA =
  "w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4a7c59] transition-colors resize-none";

export default function GuidePage() {
  const [guide, setGuide] = useState<CareGuide>(EMPTY_GUIDE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CareGuide>(EMPTY_GUIDE);
  const [openSection, setOpenSection] = useState<SectionKey | null>("info");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getCareGuide();
    if (stored) {
      setGuide(stored);
      setDraft(stored);
      setEditing(false);
    } else {
      setEditing(true);
    }
  }, []);

  const toggleSection = (key: SectionKey) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const handleSave = () => {
    const updated = { ...draft, updatedAt: new Date().toISOString() };
    saveCareGuide(updated);
    setGuide(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const startEdit = () => {
    setDraft(guide);
    setEditing(true);
    setOpenSection("info");
  };

  const set = (field: keyof CareGuide, value: string | number) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const hasGuide = !!guide.childName;

  return (
    <PageShell
      title="Care Guide"
      subtitle="Emergency info for caregivers"
      headerRight={
        hasGuide && !editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 py-1 px-2"
          >
            <Edit2 size={13} />
            Edit
          </button>
        ) : undefined
      }
    >
      <div className="px-4 pt-4 pb-4">
        <Disclaimer />

        {!hasGuide && !editing && (
          <div className="text-center py-10 text-stone-400 mt-4">
            <p className="text-3xl mb-2">📖</p>
            <p className="text-sm font-medium text-stone-500">No guide set up yet</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-[#4a7c59] text-white text-sm font-semibold rounded-2xl px-6 py-3"
            >
              Create Care Guide
            </button>
          </div>
        )}

        {/* Saved confirmation */}
        {saved && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-2.5 text-center font-medium">
            ✓ Care guide saved
          </div>
        )}

        {/* View mode */}
        {hasGuide && !editing && (
          <div className="mt-4">
            {/* Child info card */}
            <div className="bg-[#4a7c59] text-white rounded-2xl p-4 mb-4">
              <p className="text-white/70 text-xs mb-0.5">Child&apos;s name</p>
              <p className="text-xl font-bold">{guide.childName}</p>
              {guide.diagnosisDate && (
                <p className="text-white/70 text-xs mt-1">
                  Diagnosed: {new Date(guide.diagnosisDate).toLocaleDateString([], { month: "long", year: "numeric" })}
                </p>
              )}
              <div className="flex gap-4 mt-3">
                <div>
                  <p className="text-white/60 text-xs">Target range</p>
                  <p className="font-semibold text-sm">
                    {guide.targetRangeLow}–{guide.targetRangeHigh} mg/dL
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Alert low</p>
                  <p className="font-semibold text-sm">&lt;{guide.lowThreshold} mg/dL</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Alert high</p>
                  <p className="font-semibold text-sm">&gt;{guide.highThreshold} mg/dL</p>
                </div>
              </div>
            </div>

            {/* Quick contacts */}
            <div className="bg-white border border-stone-100 rounded-2xl p-4 mb-3 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Phone size={14} className="text-[#4a7c59]" />
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Emergency Contacts
                </p>
              </div>
              {guide.emergencyContact1Name && (
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{guide.emergencyContact1Name}</p>
                    <p className="text-xs text-stone-400">Primary</p>
                  </div>
                  <a
                    href={`tel:${guide.emergencyContact1Phone}`}
                    className="text-[#4a7c59] font-semibold text-sm"
                  >
                    {guide.emergencyContact1Phone}
                  </a>
                </div>
              )}
              {guide.emergencyContact2Name && (
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{guide.emergencyContact2Name}</p>
                    <p className="text-xs text-stone-400">Secondary</p>
                  </div>
                  <a
                    href={`tel:${guide.emergencyContact2Phone}`}
                    className="text-[#4a7c59] font-semibold text-sm"
                  >
                    {guide.emergencyContact2Phone}
                  </a>
                </div>
              )}
              {guide.doctorName && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{guide.doctorName}</p>
                    <p className="text-xs text-stone-400">Diabetes Care Team</p>
                  </div>
                  <a
                    href={`tel:${guide.doctorPhone}`}
                    className="text-[#4a7c59] font-semibold text-sm"
                  >
                    {guide.doctorPhone}
                  </a>
                </div>
              )}
            </div>

            {/* High BG steps */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  If Blood Sugar is HIGH
                </p>
              </div>
              <pre className="text-xs text-amber-800 whitespace-pre-wrap leading-relaxed font-sans">
                {guide.highBgSteps}
              </pre>
            </div>

            {/* Low BG steps */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-rose-500" />
                <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                  If Blood Sugar is LOW
                </p>
              </div>
              <pre className="text-xs text-rose-800 whitespace-pre-wrap leading-relaxed font-sans">
                {guide.lowBgSteps}
              </pre>
            </div>

            {guide.schoolNotes && (
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-sky-500" />
                  <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide">
                    School / Caregiver Notes
                  </p>
                </div>
                <pre className="text-xs text-sky-800 whitespace-pre-wrap leading-relaxed font-sans">
                  {guide.schoolNotes}
                </pre>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 border border-stone-200 text-stone-600 text-sm rounded-2xl py-3 mt-1"
            >
              <Printer size={15} />
              Print / Share Guide
            </button>

            {guide.updatedAt && (
              <p className="text-xs text-stone-400 text-center mt-3">
                Last updated {new Date(guide.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Edit mode */}
        {editing && (
          <div className="mt-4">
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Fill in your child&apos;s care details. This guide is stored on your device and is perfect for sharing with teachers, grandparents, or babysitters.
            </p>

            <Section
              title="Child Info & Targets"
              icon={User}
              open={openSection === "info"}
              onToggle={() => toggleSection("info")}
            >
              <Field label="Child's name" required>
                <input
                  className={INPUT}
                  value={draft.childName}
                  onChange={(e) => set("childName", e.target.value)}
                  placeholder="e.g. Jamie"
                />
              </Field>
              <Field label="Diagnosis date">
                <input
                  type="month"
                  className={INPUT}
                  value={draft.diagnosisDate}
                  onChange={(e) => set("diagnosisDate", e.target.value)}
                />
              </Field>
              <div className="flex gap-3 mt-3">
                <div className="flex-1">
                  <label className="text-xs text-stone-500 block mb-1">Target low (mg/dL)</label>
                  <input
                    type="number"
                    className={INPUT}
                    value={draft.targetRangeLow}
                    onChange={(e) => set("targetRangeLow", Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-stone-500 block mb-1">Target high (mg/dL)</label>
                  <input
                    type="number"
                    className={INPUT}
                    value={draft.targetRangeHigh}
                    onChange={(e) => set("targetRangeHigh", Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <div className="flex-1">
                  <label className="text-xs text-stone-500 block mb-1">Alert: Low below</label>
                  <input
                    type="number"
                    className={INPUT}
                    value={draft.lowThreshold}
                    onChange={(e) => set("lowThreshold", Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-stone-500 block mb-1">Alert: High above</label>
                  <input
                    type="number"
                    className={INPUT}
                    value={draft.highThreshold}
                    onChange={(e) => set("highThreshold", Number(e.target.value))}
                  />
                </div>
              </div>
            </Section>

            <Section
              title="Emergency Contacts"
              icon={Phone}
              open={openSection === "contacts"}
              onToggle={() => toggleSection("contacts")}
            >
              <Field label="Primary contact name">
                <input
                  className={INPUT}
                  value={draft.emergencyContact1Name}
                  onChange={(e) => set("emergencyContact1Name", e.target.value)}
                  placeholder="e.g. Mom (Sarah)"
                />
              </Field>
              <Field label="Primary contact phone">
                <input
                  type="tel"
                  className={INPUT}
                  value={draft.emergencyContact1Phone}
                  onChange={(e) => set("emergencyContact1Phone", e.target.value)}
                  placeholder="555-123-4567"
                />
              </Field>
              <Field label="Secondary contact name">
                <input
                  className={INPUT}
                  value={draft.emergencyContact2Name}
                  onChange={(e) => set("emergencyContact2Name", e.target.value)}
                  placeholder="e.g. Dad (Mike)"
                />
              </Field>
              <Field label="Secondary contact phone">
                <input
                  type="tel"
                  className={INPUT}
                  value={draft.emergencyContact2Phone}
                  onChange={(e) => set("emergencyContact2Phone", e.target.value)}
                  placeholder="555-987-6543"
                />
              </Field>
              <Field label="Diabetes care team / doctor">
                <input
                  className={INPUT}
                  value={draft.doctorName}
                  onChange={(e) => set("doctorName", e.target.value)}
                  placeholder="e.g. Dr. Patel – Children's Endo Clinic"
                />
              </Field>
              <Field label="Care team phone">
                <input
                  type="tel"
                  className={INPUT}
                  value={draft.doctorPhone}
                  onChange={(e) => set("doctorPhone", e.target.value)}
                  placeholder="555-456-7890"
                />
              </Field>
            </Section>

            <Section
              title="If Blood Sugar is HIGH"
              icon={AlertTriangle}
              open={openSection === "high"}
              onToggle={() => toggleSection("high")}
            >
              <p className="text-xs text-stone-400 mt-3 mb-1 leading-relaxed">
                Steps for caregivers to follow (edit to match your care team&apos;s instructions)
              </p>
              <textarea
                className={TEXTAREA}
                rows={7}
                value={draft.highBgSteps}
                onChange={(e) => set("highBgSteps", e.target.value)}
              />
            </Section>

            <Section
              title="If Blood Sugar is LOW"
              icon={AlertTriangle}
              open={openSection === "low"}
              onToggle={() => toggleSection("low")}
            >
              <p className="text-xs text-stone-400 mt-3 mb-1 leading-relaxed">
                Steps for caregivers to follow (edit to match your care team&apos;s instructions)
              </p>
              <textarea
                className={TEXTAREA}
                rows={8}
                value={draft.lowBgSteps}
                onChange={(e) => set("lowBgSteps", e.target.value)}
              />
            </Section>

            <Section
              title="School / Caregiver Notes"
              icon={BookOpen}
              open={openSection === "school"}
              onToggle={() => toggleSection("school")}
            >
              <p className="text-xs text-stone-400 mt-3 mb-1 leading-relaxed">
                Additional notes for teachers, babysitters, or other caregivers
              </p>
              <textarea
                className={TEXTAREA}
                rows={5}
                value={draft.schoolNotes}
                onChange={(e) => set("schoolNotes", e.target.value)}
                placeholder="e.g. Jamie wears a Dexcom CGM on their upper arm. The receiver is in the blue pouch in their backpack..."
              />
            </Section>

            <button
              onClick={handleSave}
              disabled={!draft.childName.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#4a7c59] text-white font-semibold rounded-2xl py-4 text-sm mt-2 disabled:opacity-40"
            >
              <Save size={16} />
              Save Care Guide
            </button>

            <Disclaimer compact />
          </div>
        )}
      </div>
    </PageShell>
  );
}
