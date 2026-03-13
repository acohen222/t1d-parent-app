export type EventCategory =
  | "meal"
  | "exercise"
  | "illness"
  | "stress"
  | "site_change"
  | "medication"
  | "high_bg"
  | "low_bg"
  | "low_treatment"
  | "other";

export interface DiabetesEvent {
  id: string;
  timestamp: string; // ISO string
  category: EventCategory;
  note: string;
  bloodSugar?: number; // mg/dL, optional
}

/** Stored in localStorage (MVP). Replace with Supabase query when auth is wired. */
export interface ChildProfile {
  name: string;
  dob?: string;            // ISO date string
  diagnosisDate?: string;  // ISO date string
  targetRangeLow: number;  // mg/dL
  targetRangeHigh: number; // mg/dL
  highThreshold: number;   // mg/dL
  lowThreshold: number;    // mg/dL
  pumpType?: string;
  cgmType?: string;
  insulinType?: string;
  lowTreatmentGrams: number;
  lowTreatmentType: string;
  siteChangeDays: number;
  updatedAt: string;
}

export interface CareGuide {
  childName: string;
  diagnosisDate: string;
  targetRangeLow: number;
  targetRangeHigh: number;
  highThreshold: number;
  lowThreshold: number;
  emergencyContact1Name: string;
  emergencyContact1Phone: string;
  emergencyContact1Rel?: string;
  emergencyContact2Name: string;
  emergencyContact2Phone: string;
  emergencyContact2Rel?: string;
  doctorName: string;
  doctorPhone: string;
  lowBgSymptoms: string;
  highBgSteps: string;
  lowBgSteps: string;
  pumpCgmNotes: string;
  whenToCallParent: string;
  schoolNotes: string;
  updatedAt: string;
}
