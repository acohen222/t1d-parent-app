"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, User, Target, Smartphone, Phone } from "lucide-react";
import { getChildProfile, saveChildProfile } from "@/lib/storage";
import { ChildProfile } from "@/lib/types";
import Button from "@/components/ui/Button";
import Disclaimer from "@/components/Disclaimer";

type Section = "child" | "targets" | "devices" | "contacts";

const SECTIONS: { id: Section; icon: React.ElementType; label: string }[] = [
  { id: "child",    icon: User,       label: "Child info" },
  { id: "targets",  icon: Target,     label: "BG targets" },
  { id: "devices",  icon: Smartphone, label: "Devices" },
  { id: "contacts", icon: Phone,      label: "Contacts" },
];

const DEFAULT_PROFILE: ChildProfile = {
  name: "",
  dob: "",
  diagnosisDate: "",
  targetRangeLow: 80,
  targetRangeHigh: 160,
  highThreshold: 250,
  lowThreshold: 70,
  pumpType: "",
  cgmType: "",
  insulinType: "",
  lowTreatmentGrams: 15,
  lowTreatmentType: "juice box",
  siteChangeDays: 3,
  updatedAt: "",
  // T1D decision-tree fields
  lowBGThreshold: 70,
  lowTreatmentCarbs: 15,
  highBGThreshold: 250,
  correctionFactor: undefined,
  insulinDelivery: "pump",
  glucagonType: "none",
  commonHighCauses: [],
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-stone-500 mb-1">{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 bg-[#E8F2FB] border border-[#B8D4EE] rounded-lg px-3.5 text-sm text-[#2D4A63] placeholder:text-[#5A8EB8] focus:outline-none focus:shadow-[0_0_0_2px_#2E7FD4] focus:border-transparent transition-all"
    />
  );
}

function NumberInput({ value, onChange, min, max, unit }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="flex-1 h-11 bg-[#E8F2FB] border border-[#B8D4EE] rounded-lg px-3.5 text-sm text-[#2D4A63] focus:outline-none focus:shadow-[0_0_0_2px_#2E7FD4] focus:border-transparent transition-all"
      />
      {unit && <span className="text-xs text-stone-400 shrink-0">{unit}</span>}
    </div>
  );
}

export default function ProfileSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState<ChildProfile>(DEFAULT_PROFILE);
  const [activeSection, setActiveSection] = useState<Section>("child");
  const [saved, setSaved] = useState(false);
  const isEditing = !!getChildProfile();

  // Also store contact info separately (not in ChildProfile — goes to CareGuide)
  // For MVP, keeping it simple: just child profile + settings here
  const [contact1Name, setContact1Name] = useState("");
  const [contact1Phone, setContact1Phone] = useState("");
  const [contact2Name, setContact2Name] = useState("");
  const [contact2Phone, setContact2Phone] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");

  useEffect(() => {
    const p = getChildProfile();
    if (p) setForm(p);

    // Load contact info from care guide if exists
    const raw = localStorage.getItem("t1d_care_guide");
    if (raw) {
      try {
        const g = JSON.parse(raw);
        setContact1Name(g.emergencyContact1Name ?? "");
        setContact1Phone(g.emergencyContact1Phone ?? "");
        setContact2Name(g.emergencyContact2Name ?? "");
        setContact2Phone(g.emergencyContact2Phone ?? "");
        setDoctorName(g.doctorName ?? "");
        setDoctorPhone(g.doctorPhone ?? "");
      } catch { /* ignore */ }
    }
  }, []);

  const set = <K extends keyof ChildProfile>(key: K, value: ChildProfile[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) {
      setActiveSection("child");
      return;
    }

    saveChildProfile({
      ...form,
      // Keep mirrored decision-tree fields in sync with their UI counterparts
      lowBGThreshold: form.lowThreshold,
      lowTreatmentCarbs: form.lowTreatmentGrams,
      highBGThreshold: form.highThreshold,
      updatedAt: new Date().toISOString(),
    });

    // Also persist contact info into care guide structure
    const existingRaw = localStorage.getItem("t1d_care_guide");
    const existing = existingRaw ? JSON.parse(existingRaw) : {};
    localStorage.setItem("t1d_care_guide", JSON.stringify({
      ...existing,
      childName: form.name,
      diagnosisDate: form.diagnosisDate ?? "",
      targetRangeLow: form.targetRangeLow,
      targetRangeHigh: form.targetRangeHigh,
      highThreshold: form.highThreshold,
      lowThreshold: form.lowThreshold,
      emergencyContact1Name: contact1Name,
      emergencyContact1Phone: contact1Phone,
      emergencyContact2Name: contact2Name,
      emergencyContact2Phone: contact2Phone,
      doctorName,
      doctorPhone,
      updatedAt: new Date().toISOString(),
    }));

    setSaved(true);
    setTimeout(() => {
      router.push("/");
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-frost)" }}>
      {/* Header */}
      <header className="bg-white border-b border-stone-100 px-4 pt-12 pb-4 safe-area-pt">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {isEditing && (
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
              aria-label="Back"
            >
              <ChevronLeft size={20} className="text-stone-600" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-stone-800">
              {isEditing ? "Edit profile" : "Set up your child's profile"}
            </h1>
            {!isEditing && (
              <p className="text-sm text-stone-500 mt-0.5">Takes about 2 minutes</p>
            )}
          </div>
        </div>
      </header>

      {/* Section tabs */}
      <div className="bg-white border-b border-stone-100 px-4">
        <div className="max-w-md mx-auto flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {SECTIONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeSection === id
                  ? "bg-[#1A5FA8] text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 pt-5 pb-32 max-w-md mx-auto w-full">

        {/* ── Child info ──────────────────────────────────── */}
        {activeSection === "child" && (
          <div className="space-y-4">
            <div>
              <FieldLabel>Child&apos;s first name *</FieldLabel>
              <Input value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Emma" />
            </div>
            <div>
              <FieldLabel>Date of birth</FieldLabel>
              <Input value={form.dob ?? ""} onChange={(v) => set("dob", v)} type="date" />
            </div>
            <div>
              <FieldLabel>Diagnosis date</FieldLabel>
              <Input value={form.diagnosisDate ?? ""} onChange={(v) => set("diagnosisDate", v)} type="date" />
            </div>
            <div>
              <FieldLabel>Insulin type</FieldLabel>
              <Input value={form.insulinType ?? ""} onChange={(v) => set("insulinType", v)} placeholder="e.g. Humalog, NovoLog" />
            </div>
          </div>
        )}

        {/* ── BG targets ─────────────────────────────────── */}
        {activeSection === "targets" && (
          <div className="space-y-4">
            <div className="bg-sky-50 rounded-xl px-4 py-3 text-xs text-sky-700 leading-relaxed">
              Use targets set by your diabetes care team. These are used to personalize insights — not for dosing decisions.
            </div>
            <div>
              <FieldLabel>Target range — low end</FieldLabel>
              <NumberInput value={form.targetRangeLow} onChange={(v) => set("targetRangeLow", v)} min={60} max={150} unit="mg/dL" />
            </div>
            <div>
              <FieldLabel>Target range — high end</FieldLabel>
              <NumberInput value={form.targetRangeHigh} onChange={(v) => set("targetRangeHigh", v)} min={100} max={300} unit="mg/dL" />
            </div>
            <div>
              <FieldLabel>High alert threshold</FieldLabel>
              <NumberInput value={form.highThreshold} onChange={(v) => set("highThreshold", v)} min={150} max={400} unit="mg/dL" />
              <p className="text-[11px] text-stone-400 mt-1">Value that signals a &ldquo;high&rdquo; reading needing attention</p>
            </div>
            <div>
              <FieldLabel>Low alert threshold</FieldLabel>
              <NumberInput value={form.lowThreshold} onChange={(v) => set("lowThreshold", v)} min={50} max={100} unit="mg/dL" />
            </div>
            <div>
              <FieldLabel>Low treatment — fast carbs</FieldLabel>
              <NumberInput value={form.lowTreatmentGrams} onChange={(v) => set("lowTreatmentGrams", v)} min={5} max={30} unit="grams" />
            </div>
            <div>
              <FieldLabel>Low treatment type</FieldLabel>
              <Input value={form.lowTreatmentType} onChange={(v) => set("lowTreatmentType", v)} placeholder="e.g. juice box, glucose tabs" />
            </div>
            <div>
              <FieldLabel>Correction factor (optional)</FieldLabel>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={form.correctionFactor ?? ""}
                  onChange={(e) => set("correctionFactor", e.target.value ? Number(e.target.value) : undefined)}
                  min={10}
                  max={200}
                  placeholder="e.g. 50"
                  className="flex-1 h-11 bg-[#E8F2FB] border border-[#B8D4EE] rounded-lg px-3.5 text-sm text-[#2D4A63] placeholder:text-[#5A8EB8] focus:outline-none focus:shadow-[0_0_0_2px_#2E7FD4] focus:border-transparent transition-all"
                />
                <span className="text-xs text-stone-400 shrink-0">mg/dL per unit</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">How much 1 unit lowers BG. From your care team&apos;s plan.</p>
            </div>
            <div>
              <FieldLabel>Common high BG causes (optional)</FieldLabel>
              <Input
                value={form.commonHighCauses.join(", ")}
                onChange={(v) => set("commonHighCauses", v.split(",").map((s) => s.trim()).filter(Boolean))}
                placeholder="e.g. pump disconnect, delayed meal absorption"
              />
              <p className="text-[11px] text-stone-400 mt-1">Comma-separated. Shown as reminders in the High BG guide.</p>
            </div>
          </div>
        )}

        {/* ── Devices ────────────────────────────────────── */}
        {activeSection === "devices" && (
          <div className="space-y-4">
            <div>
              <FieldLabel>Insulin delivery method</FieldLabel>
              <div className="flex gap-2">
                {(["pump", "MDI"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set("insulinDelivery", opt)}
                    className={`flex-1 h-11 rounded-lg text-sm font-semibold border-2 transition-all ${
                      form.insulinDelivery === opt
                        ? "bg-[#1A5FA8] border-[#1A5FA8] text-white"
                        : "bg-[#E8F2FB] border-[#B8D4EE] text-[#2D4A63]"
                    }`}
                  >
                    {opt === "pump" ? "Pump" : "Injections (MDI)"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Insulin pump model</FieldLabel>
              <Input value={form.pumpType ?? ""} onChange={(v) => set("pumpType", v)} placeholder="e.g. Tandem t:slim X2, Omnipod 5" />
            </div>
            <div>
              <FieldLabel>CGM / sensor</FieldLabel>
              <Input value={form.cgmType ?? ""} onChange={(v) => set("cgmType", v)} placeholder="e.g. Dexcom G7, Libre 3" />
            </div>
            <div>
              <FieldLabel>Pump site change interval</FieldLabel>
              <NumberInput value={form.siteChangeDays} onChange={(v) => set("siteChangeDays", v)} min={1} max={7} unit="days" />
              <p className="text-[11px] text-stone-400 mt-1">Used to remind you when a site might be aging</p>
            </div>
            <div>
              <FieldLabel>Glucagon on hand</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: "nasal", label: "Nasal (Baqsimi)" },
                    { value: "auto-injector", label: "Auto-injector" },
                    { value: "kit", label: "Injection kit" },
                    { value: "none", label: "None / unknown" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("glucagonType", opt.value)}
                    className={`h-11 rounded-lg text-xs font-semibold border-2 px-2 transition-all ${
                      form.glucagonType === opt.value
                        ? "bg-[#1A5FA8] border-[#1A5FA8] text-white"
                        : "bg-[#E8F2FB] border-[#B8D4EE] text-[#2D4A63]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Shown in the Low BG emergency guide.</p>
            </div>
          </div>
        )}

        {/* ── Contacts ───────────────────────────────────── */}
        {activeSection === "contacts" && (
          <div className="space-y-4">
            <p className="text-xs text-stone-500 leading-relaxed">
              These appear on the printable Caregiver Guide. You can update them anytime.
            </p>
            <div>
              <FieldLabel>Primary contact name (e.g. Mom, Dad)</FieldLabel>
              <Input value={contact1Name} onChange={setContact1Name} placeholder="e.g. Alex" />
            </div>
            <div>
              <FieldLabel>Primary contact phone</FieldLabel>
              <Input value={contact1Phone} onChange={setContact1Phone} placeholder="(555) 123-4567" type="tel" />
            </div>
            <div>
              <FieldLabel>Secondary contact name</FieldLabel>
              <Input value={contact2Name} onChange={setContact2Name} placeholder="e.g. Grandma Jordan" />
            </div>
            <div>
              <FieldLabel>Secondary contact phone</FieldLabel>
              <Input value={contact2Phone} onChange={setContact2Phone} placeholder="(555) 987-6543" type="tel" />
            </div>
            <div>
              <FieldLabel>Doctor / care team name</FieldLabel>
              <Input value={doctorName} onChange={setDoctorName} placeholder="e.g. Dr. Sarah Chen" />
            </div>
            <div>
              <FieldLabel>Doctor / care team phone</FieldLabel>
              <Input value={doctorPhone} onChange={setDoctorPhone} placeholder="(555) 456-7890" type="tel" />
            </div>
          </div>
        )}

        <div className="mt-8">
          <Disclaimer compact />
        </div>
      </main>

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-4 py-3 safe-area-pb">
        <div className="max-w-md mx-auto">
          <Button
            size="lg"
            fullWidth
            onClick={handleSave}
            disabled={saved}
            icon={saved ? undefined : <Save size={18} />}
          >
            {saved ? "Saved! Taking you home…" : isEditing ? "Save changes" : "Save & go to dashboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
