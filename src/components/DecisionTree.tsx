"use client";

import { useState } from "react";
import {
  ChevronLeft,
  HelpCircle,
  Phone,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ChildProfile } from "@/lib/types";
import { GuideTree, TreeNode, TreeResponse } from "@/lib/decisionTrees";

// ─── Interpolation ────────────────────────────────────────────────────────────

function interpolate(text: string, profile: ChildProfile): string {
  return text.replace(/\{profile\.(\w+)\}/g, (_, key) => {
    const val = (profile as unknown as Record<string, unknown>)[key];
    if (Array.isArray(val)) {
      return val.length > 0 ? val.join(", ") : "none noted yet";
    }
    if (val === undefined || val === null || val === "") return "—";
    return String(val);
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InstructionCard({
  node,
  accentHex,
  profile,
  onResponse,
}: {
  node: TreeNode;
  accentHex: string;
  profile: ChildProfile;
  onResponse: (next: string) => void;
}) {
  const isTerminal = !node.responses || node.responses.length === 0;
  return (
    <div className="bg-white rounded-2xl border border-[#B8D4EE] shadow-[0_2px_12px_rgba(26,95,168,0.07)] overflow-hidden">
      {/* Accent stripe */}
      <div className="h-1.5" style={{ background: accentHex }} />
      <div className="p-5">
        <p
          className="font-bold text-[#1A3A5C] text-base leading-snug"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {interpolate(node.text, profile)}
        </p>
        {node.detail && (
          <p
            className="text-sm text-[#5A8EB8] mt-2.5 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {interpolate(node.detail, profile)}
          </p>
        )}

        {isTerminal ? (
          <div className="mt-4 flex items-center gap-2">
            <CheckCircle2 size={16} style={{ color: accentHex }} />
            <p
              className="text-sm font-semibold"
              style={{ color: accentHex, fontFamily: "var(--font-body)" }}
            >
              You&apos;ve completed this guide.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {node.responses!.map((r: TreeResponse) => (
              <button
                key={r.next}
                onClick={() => onResponse(r.next)}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white transition-opacity active:opacity-80"
                style={{ background: accentHex, fontFamily: "var(--font-body)" }}
              >
                {interpolate(r.label, profile)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  node,
  accentHex,
  profile,
  onResponse,
}: {
  node: TreeNode;
  accentHex: string;
  profile: ChildProfile;
  onResponse: (next: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border-2 shadow-[0_2px_12px_rgba(26,95,168,0.07)] overflow-hidden" style={{ borderColor: `${accentHex}50` }}>
      <div className="p-5">
        {/* Question label */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `${accentHex}20` }}
          >
            <HelpCircle size={13} style={{ color: accentHex }} />
          </div>
          <span
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: accentHex, fontFamily: "var(--font-body)" }}
          >
            Check in
          </span>
        </div>

        <p
          className="font-bold text-[#1A3A5C] text-base leading-snug"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {interpolate(node.text, profile)}
        </p>
        {node.detail && (
          <p
            className="text-sm text-[#5A8EB8] mt-2 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {interpolate(node.detail, profile)}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2">
          {node.responses?.map((r: TreeResponse) => (
            <button
              key={r.next}
              onClick={() => onResponse(r.next)}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-left border-2 transition-colors active:opacity-80"
              style={{
                borderColor: accentHex,
                color: accentHex,
                fontFamily: "var(--font-body)",
              }}
            >
              {interpolate(r.label, profile)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmergencyCard({
  node,
  accentHex,
  profile,
}: {
  node: TreeNode;
  accentHex: string;
  profile: ChildProfile;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden border-2"
      style={{ borderColor: "#EF4444", background: "#FFF5F5" }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500">
            <Phone size={18} className="text-white" />
          </div>
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wide text-red-500"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Emergency action
            </p>
            <p
              className="font-extrabold text-[#1A3A5C] text-base leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {interpolate(node.text, profile)}
            </p>
          </div>
        </div>

        {node.detail && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <p
              className="text-red-700 text-sm leading-snug"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {interpolate(node.detail, profile)}
            </p>
          </div>
        )}

        <a
          href="tel:911"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white bg-red-500 active:bg-red-600 transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Phone size={15} />
          Call 911
        </a>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DecisionTreeProps {
  tree: GuideTree;
  profile: ChildProfile;
  accentHex: string;
}

export default function DecisionTree({
  tree,
  profile,
  accentHex,
}: DecisionTreeProps) {
  const [history, setHistory] = useState<string[]>([tree.rootId]);

  const currentId = history[history.length - 1];
  const node = tree.nodes[currentId];

  const isTerminal = !node?.responses || node.responses.length === 0;

  // Progress: steps taken / estimated total, capped at 95% until terminal
  const rawProgress = (history.length - 1) / tree.estimatedSteps;
  const progress = isTerminal ? 1 : Math.min(rawProgress, 0.92);

  const handleResponse = (next: string) => {
    if (tree.nodes[next]) {
      setHistory((prev) => [...prev, next]);
      // Scroll to top of tree on navigation
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!node) return null;

  return (
    <div className="space-y-4">
      {/* Progress bar + step counter */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-xs text-stone-400"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Step {history.length}
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: accentHex, fontFamily: "var(--font-body)" }}
          >
            {Math.round(progress * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, background: accentHex }}
          />
        </div>
      </div>

      {/* Back button */}
      {history.length > 1 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm font-semibold text-[#5A8EB8] hover:text-[#1A5FA8] transition-colors -ml-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <ChevronLeft size={18} />
          Back
        </button>
      )}

      {/* Current node */}
      {node.type === "instruction" && (
        <InstructionCard
          node={node}
          accentHex={accentHex}
          profile={profile}
          onResponse={handleResponse}
        />
      )}
      {node.type === "question" && (
        <QuestionCard
          node={node}
          accentHex={accentHex}
          profile={profile}
          onResponse={handleResponse}
        />
      )}
      {node.type === "emergency" && (
        <EmergencyCard
          node={node}
          accentHex={accentHex}
          profile={profile}
        />
      )}

      {/* Breadcrumb path (visited nodes) */}
      {history.length > 1 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {history.slice(0, -1).map((nodeId, i) => (
            <span
              key={`${nodeId}-${i}`}
              className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-400"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tree.nodes[nodeId]?.id.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
