/**
 * Decision-tree engine types and tree definitions for the urgent guides.
 *
 * Each tree is a map of nodes keyed by id. Navigation works by pushing the
 * next-node id onto a history stack; Back pops the stack.
 *
 * Text and detail strings may contain {profile.fieldName} tokens that are
 * interpolated at render time with live profile values.
 */

export interface TreeResponse {
  label: string; // may also contain {profile.*} tokens
  next: string;  // id of the target node
}

export interface TreeNode {
  id: string;
  type: "instruction" | "question" | "emergency";
  text: string;       // primary content; supports {profile.*} interpolation
  detail?: string;    // secondary / sub-text; supports interpolation
  responses?: TreeResponse[]; // absent on terminal nodes
}

export interface GuideTree {
  guideId: string;       // matches key in URGENT_GUIDES
  rootId: string;        // starting node id
  estimatedSteps: number; // used to calculate progress-bar denominator
  nodes: Record<string, TreeNode>;
}

// ─── Low BG decision tree ────────────────────────────────────────────────────

export const LOW_BG_TREE: GuideTree = {
  guideId: "low",
  rootId: "confirm",
  estimatedSteps: 7,
  nodes: {
    confirm: {
      id: "confirm",
      type: "instruction",
      text: "Check your CGM or do a finger-stick. A reading under {profile.lowBGThreshold} mg/dL — or symptoms without a reading — means it's time to treat.",
      detail: "Common symptoms: shakiness, sweating, pale skin, irritability, difficulty concentrating, or confusion.",
      responses: [{ label: "Reading confirmed — it's low", next: "conscious" }],
    },

    conscious: {
      id: "conscious",
      type: "question",
      text: "Can {profile.name} swallow safely right now?",
      responses: [
        { label: "Yes — awake and alert", next: "give-carbs" },
        { label: "No — unconscious, seizing, or cannot swallow", next: "glucagon" },
      ],
    },

    glucagon: {
      id: "glucagon",
      type: "emergency",
      text: "Use glucagon immediately — then call 911.",
      detail:
        "{profile.name}'s glucagon on hand: {profile.glucagonType}. Do NOT give anything by mouth. Stay with your child until help arrives.",
    },

    "give-carbs": {
      id: "give-carbs",
      type: "instruction",
      text: "Give {profile.lowTreatmentCarbs}g of fast-acting carbs right now.",
      detail:
        "{profile.name}'s go-to: {profile.lowTreatmentType}. Avoid anything with fat (peanut butter, cheese) — fat slows absorption.",
      responses: [{ label: "Carbs given — starting 15-min timer", next: "wait" }],
    },

    wait: {
      id: "wait",
      type: "instruction",
      text: "Wait the full 15 minutes. Do not give more carbs yet. No correction insulin during this time.",
      detail: "It takes 10–15 minutes for fast-acting carbs to raise blood sugar. Resist the urge to act sooner.",
      responses: [{ label: "15 minutes have passed", next: "recheck" }],
    },

    recheck: {
      id: "recheck",
      type: "question",
      text: "Recheck BG. Is it still below {profile.lowBGThreshold} mg/dL?",
      responses: [
        { label: "Yes — still low, repeat treatment", next: "give-carbs" },
        { label: "No — it's rising above {profile.lowBGThreshold}", next: "snack" },
      ],
    },

    snack: {
      id: "snack",
      type: "instruction",
      text: "BG is coming up — great. Give a follow-up snack with carbs and protein to prevent another drop.",
      detail: "Ideas: crackers + peanut butter, string cheese + apple slices, or half a sandwich.",
      responses: [{ label: "Snack given", next: "monitor" }],
    },

    monitor: {
      id: "monitor",
      type: "instruction",
      text: "Recheck BG in 1–2 hours. Log what happened and what you gave. Watch for another drop, especially overnight.",
      detail: "If BG drops again within a few hours, or you're unsure what caused the low, contact your care team.",
      // No responses — terminal node
    },
  },
};

// ─── High BG decision tree ───────────────────────────────────────────────────

export const HIGH_BG_TREE: GuideTree = {
  guideId: "high",
  rootId: "confirm",
  estimatedSteps: 10,
  nodes: {
    confirm: {
      id: "confirm",
      type: "instruction",
      text: "Check your CGM or do a finger-stick to confirm the high reading. Wash hands before a finger-stick for the most accurate result.",
      detail: "High BG threshold for {profile.name}: {profile.highBGThreshold} mg/dL.",
      responses: [{ label: "Reading confirmed high", next: "severity" }],
    },

    severity: {
      id: "severity",
      type: "question",
      text: "Is BG above 400 mg/dL, or is {profile.name} vomiting?",
      responses: [
        { label: "Yes — above 400 or vomiting", next: "er-now" },
        { label: "No — managing at home", next: "symptoms" },
      ],
    },

    "er-now": {
      id: "er-now",
      type: "emergency",
      text: "Call your care team or go to the ER now.",
      detail: "BG above 400 or vomiting can be a sign of DKA. Do not wait to see if it improves on its own.",
    },

    symptoms: {
      id: "symptoms",
      type: "instruction",
      text: "Note any symptoms: extreme thirst, frequent urination, fatigue, blurry vision, headache, or nausea. Mild highs may have no symptoms at all.",
      responses: [{ label: "Symptoms noted", next: "ketones-check" }],
    },

    "ketones-check": {
      id: "ketones-check",
      type: "question",
      text: "Is BG above 250 mg/dL?",
      responses: [
        { label: "Yes — above 250, need to check ketones", next: "test-ketones" },
        { label: "No — below 250", next: "delivery-check" },
      ],
    },

    "test-ketones": {
      id: "test-ketones",
      type: "instruction",
      text: "Check ketones now using a blood ketone meter or urine strips.",
      detail: "Blood meter (most accurate): trace < 0.6, moderate 0.6–1.5, large > 1.5 mmol/L.",
      responses: [
        { label: "Trace or small ketones (< 0.6 mmol/L)", next: "delivery-check" },
        { label: "Moderate or large ketones", next: "ketones-urgent" },
      ],
    },

    "ketones-urgent": {
      id: "ketones-urgent",
      type: "emergency",
      text: "Moderate or large ketones with high BG requires immediate action.",
      detail:
        "Follow the Ketones Protocol and call your care team now. Do NOT let {profile.name} exercise — physical activity can worsen DKA.",
    },

    "delivery-check": {
      id: "delivery-check",
      type: "question",
      text: "How is {profile.name} receiving insulin right now?",
      responses: [
        { label: "Pump", next: "pump-site" },
        { label: "Injections (MDI)", next: "correction" },
      ],
    },

    "pump-site": {
      id: "pump-site",
      type: "question",
      text: "Check the pump infusion site. Does it look okay — no kinking, bending, redness, or wet adhesive?",
      responses: [
        { label: "Site looks fine", next: "correction" },
        { label: "Site looks questionable", next: "change-site" },
      ],
    },

    "change-site": {
      id: "change-site",
      type: "instruction",
      text: "Change the infusion site and give this correction dose by injection — not through the pump.",
      detail: "Use a fresh site in a new location. A failed site is a common cause of unexplained highs.",
      responses: [{ label: "Site changed, injection given", next: "fluids" }],
    },

    correction: {
      id: "correction",
      type: "instruction",
      text: "Give a correction dose per your care team's plan.",
      detail:
        "Correction factor: {profile.correctionFactor} mg/dL per unit. If you're unsure of the dose, call your care team before giving insulin.",
      responses: [{ label: "Correction given", next: "fluids" }],
    },

    fluids: {
      id: "fluids",
      type: "instruction",
      text: "Encourage {profile.name} to drink water. Avoid juice, sports drinks, or anything with sugar.",
      detail: "Hydration helps the body process excess glucose and clear any early ketones.",
      responses: [{ label: "Fluids started", next: "recheck-high" }],
    },

    "recheck-high": {
      id: "recheck-high",
      type: "question",
      text: "Recheck BG in 2 hours. Is it trending down?",
      detail: "Common causes to consider: {profile.commonHighCauses}.",
      responses: [
        { label: "Yes — coming down, log and monitor", next: "done" },
        { label: "No — not moving after 2 hours", next: "not-responding" },
      ],
    },

    "not-responding": {
      id: "not-responding",
      type: "instruction",
      text: "BG isn't responding. If on a pump, consider a site change and give the next correction by injection. Then contact your care team.",
      detail: "Repeated failure to respond to correction doses needs medical guidance — don't keep stacking doses.",
      responses: [{ label: "Done — contacting care team", next: "call-team" }],
    },

    "call-team": {
      id: "call-team",
      type: "emergency",
      text: "Contact your care team now.",
      detail:
        "BG not responding to correction may need medical intervention. Document BG readings, correction doses given, and timing when you call.",
    },

    done: {
      id: "done",
      type: "instruction",
      text: "BG is trending down — good. Keep monitoring and log the episode.",
      detail: "If BG continues to rise or symptoms worsen, call your care team.",
      // No responses — terminal node
    },
  },
};

export const DECISION_TREES: Record<string, GuideTree> = {
  low: LOW_BG_TREE,
  high: HIGH_BG_TREE,
};
