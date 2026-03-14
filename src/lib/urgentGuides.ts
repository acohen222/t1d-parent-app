export interface GuideStep {
  id: string;
  title: string;
  description: string;
  warning?: string;
  isCritical?: boolean;
}
export interface UrgentGuide {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  gradient: string;
  accentHex: string;
  iconBgClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  checkClass: string;
  stepBorderClass: string;
  steps: GuideStep[];
  emergencyNote: string;
}
export const URGENT_GUIDES: Record<string, UrgentGuide> = {
  low: {
    id: "low",
    title: "Treat Low Blood Sugar",
    shortTitle: "Low BG",
    tagline: "Under 70 mg/dL or your care team's threshold",
    gradient: "linear-gradient(150deg, #FCA5A5 0%, #EF4444 40%, #B91C1C 100%)",
    accentHex: "#EF4444",
    iconBgClass: "bg-rose-100 text-rose-600",
    badgeBgClass: "bg-rose-50 border-rose-200",
    badgeTextClass: "text-rose-700",
    checkClass: "bg-rose-500 border-rose-500",
    stepBorderClass: "border-rose-200",
    emergencyNote:
      "Unconscious or cannot swallow? Use glucagon and call 911 immediately.",
    steps: [
      {
        id: "1",
        title: "Confirm the low",
        description:
          "Check your CGM or do a finger-stick reading. Under 70 mg/dL (or your care team's target) is a low. If the CGM shows low, confirm with a finger-stick before treating if your child is awake and alert.",
      },
      {
        id: "2",
        title: "Stay with your child",
        description:
          "Do not leave them alone. Keep them sitting or lying down if they feel dizzy, shaky, or unsteady.",
      },
      {
        id: "3",
        title: "Give 15g of fast-acting carbs",
        description:
          "Choose one: 4 glucose tablets, 4 oz (½ cup) of juice or regular soda, 1 glucose gel packet, or 1 tablespoon of honey. Do not use food with fat (peanut butter, cheese) — fat slows absorption.",
      },
      {
        id: "4",
        title: "Wait 15 minutes — no more insulin",
        description:
          "Resist the urge to give more carbs right away. Wait the full 15 minutes. Do not give any correction insulin during this time.",
      },
      {
        id: "5",
        title: "Recheck blood sugar",
        description:
          "If still below 70, repeat step 3 (give another 15g carbs) and wait 15 more minutes. If above 70 and your child feels better, move to step 6.",
      },
      {
        id: "6",
        title: "Give a follow-up snack",
        description:
          "Once BG is above 70, give a small snack with both carbs and protein — crackers with peanut butter, string cheese, or half a sandwich — to prevent another drop.",
      },
      {
        id: "7",
        title: "Monitor closely and log",
        description:
          "Recheck blood sugar in 1–2 hours. Log what happened and what you gave. Watch for another drop, especially overnight.",
        warning:
          "If your child loses consciousness, has a seizure, or cannot swallow safely — use glucagon and call 911 immediately.",
      },
    ],
  },
  high: {
    id: "high",
    title: "Treat High Blood Sugar",
    shortTitle: "High BG",
    tagline: "Above your care team's target range",
    gradient: "linear-gradient(150deg, #FDE68A 0%, #F59E0B 40%, #B45309 100%)",
    accentHex: "#F59E0B",
    iconBgClass: "bg-amber-100 text-amber-600",
    badgeBgClass: "bg-amber-50 border-amber-200",
    badgeTextClass: "text-amber-700",
    checkClass: "bg-amber-500 border-amber-500",
    stepBorderClass: "border-amber-200",
    emergencyNote:
      "BG above 400 mg/dL or your child is vomiting? Call your care team now.",
    steps: [
      {
        id: "1",
        title: "Confirm the reading",
        description:
          "Check CGM or do a finger-stick to confirm. Wash hands before a finger-stick for the most accurate result.",
      },
      {
        id: "2",
        title: "Look for symptoms",
        description:
          "Note: extreme thirst, frequent urination, fatigue, blurry vision, headache, or nausea. Mild highs may have no symptoms at all.",
      },
      {
        id: "3",
        title: "Check ketones if BG > 250 mg/dL",
        description:
          "Use a blood ketone meter or urine strips. If ketones are moderate or large, follow the Ketones Protocol. Tap back to choose it.",
        warning: "Moderate or large ketones with high BG requires immediate action — do not wait.",
      },
      {
        id: "4",
        title: "Give a correction dose",
        description:
          "Use your care team's correction factor. If your child is on a pump, check for a kinked, bent, or dislodged infusion site. If the site looks questionable, give an injection instead.",
      },
      {
        id: "5",
        title: "Encourage fluids",
        description:
          "Water is best. Avoid juice, sports drinks, or anything sugary. Hydration helps the body process excess glucose.",
      },
      {
        id: "6",
        title: "Recheck in 2 hours",
        description:
          "Blood sugar should begin coming down. If BG is not moving after 2 hours, consider a site change and contact your care team.",
        warning:
          "BG above 400 mg/dL or child is vomiting? Call your care team immediately.",
      },
    ],
  },
  ketones: {
    id: "ketones",
    title: "Ketones Protocol",
    shortTitle: "Ketones",
    tagline: "For any positive ketone reading",
    gradient: "linear-gradient(150deg, #DDD6FE 0%, #7C3AED 40%, #4C1D95 100%)",
    accentHex: "#7C3AED",
    iconBgClass: "bg-violet-100 text-violet-600",
    badgeBgClass: "bg-violet-50 border-violet-200",
    badgeTextClass: "text-violet-700",
    checkClass: "bg-violet-500 border-violet-500",
    stepBorderClass: "border-violet-200",
    emergencyNote:
      "Large ketones or any DKA symptoms? Go to the ER immediately.",
    steps: [
      {
        id: "1",
        title: "Test ketone level",
        description:
          "Use a blood ketone meter (most accurate) or urine ketone strips. Note the level — it determines your next steps.",
      },
      {
        id: "2",
        title: "Trace / Small (< 0.6 mmol/L blood, or trace urine)",
        description:
          "Give extra fluids (water or clear broth). Check blood sugar every 2 hours. Give correction insulin if BG is elevated. Monitor closely — retest ketones in 2 hours.",
      },
      {
        id: "3",
        title: "Moderate (0.6–1.5 mmol/L blood, or moderate urine)",
        description:
          "Contact your care team now. Give correction insulin — if on a pump, check the site and consider an injection. Push fluids aggressively. Recheck BG and ketones in 1–2 hours.",
        warning:
          "Do NOT let your child exercise with moderate or large ketones. Physical activity can worsen DKA.",
      },
      {
        id: "4",
        title: "Large (> 1.5 mmol/L blood, or large urine)",
        description:
          "Go to the emergency room or call your care team immediately. Do not wait to see if it improves on its own.",
        isCritical: true,
      },
      {
        id: "5",
        title: "Watch for DKA warning signs",
        description:
          "Nausea or vomiting, stomach or abdominal pain, fruity-smelling breath, extreme fatigue, deep or rapid breathing, confusion, or difficulty staying awake.",
        warning:
          "Any of these symptoms with ketones = go to the ER now. DKA is life-threatening.",
      },
    ],
  },
  "sick-day": {
    id: "sick-day",
    title: "Sick Day Protocol",
    shortTitle: "Sick Day",
    tagline: "Cold, flu, stomach bug, or any illness",
    gradient: "linear-gradient(150deg, #BFDBFE 0%, #3B82F6 40%, #1E40AF 100%)",
    accentHex: "#3B82F6",
    iconBgClass: "bg-blue-100 text-blue-600",
    badgeBgClass: "bg-blue-50 border-blue-200",
    badgeTextClass: "text-blue-700",
    checkClass: "bg-blue-500 border-blue-500",
    stepBorderClass: "border-blue-200",
    emergencyNote:
      "Vomiting and can't keep fluids down? Call your care team now.",
    steps: [
      {
        id: "1",
        title: "Check blood sugar more often",
        description:
          "Every 2–3 hours during the day. Set overnight alarms. Illness is unpredictable — BG can swing high or low without warning.",
      },
      {
        id: "2",
        title: "Never skip basal insulin",
        description:
          "Illness causes blood sugar to rise, so insulin needs increase. Continue basal insulin even if your child is not eating. Contact your care team for sick-day dose adjustments.",
        warning:
          "Stopping insulin during illness is a leading cause of DKA in Type 1 diabetes. Do not skip it.",
      },
      {
        id: "3",
        title: "Check ketones if BG > 250 mg/dL or child is vomiting",
        description:
          "Use a blood ketone meter or urine strips. If moderate or large ketones are present, follow the Ketones Protocol.",
      },
      {
        id: "4",
        title: "Push fluids constantly",
        description:
          "Water, broth, and sugar-free electrolyte drinks if BG is in range or high. If BG is low or dropping, use juice, regular popsicles, or regular sports drinks. Small sips frequently if nauseous.",
      },
      {
        id: "5",
        title: "Manage food carefully",
        description:
          "If your child can't eat normally, offer small amounts of simple carbs (crackers, toast, applesauce) to cover any insulin given. Avoid high-fat, high-fiber foods during illness — they're harder to manage.",
      },
      {
        id: "6",
        title: "Keep glucagon within reach",
        description:
          "Have emergency glucagon accessible in case a severe low occurs during illness — especially if vomiting prevents treating a low orally.",
      },
      {
        id: "7",
        title: "Call your care team if any of these apply",
        description:
          "BG is not responding to correction doses. Moderate or large ketones are present. Child cannot keep any fluids down for more than 2 hours. Child is very lethargic or confused. You are unsure what to do.",
        warning:
          "When in doubt, call. Your care team would rather hear from you than have you wait.",
      },
    ],
  },
};
