export type EventCategory =
  | "meal"
  | "exercise"
  | "illness"
  | "stress"
  | "site_change"
  | "medication"
  | "high_bg"
  | "low_bg"
  | "other";

export interface DiabetesEvent {
  id: string;
  timestamp: string; // ISO string
  category: EventCategory;
  note: string;
  bloodSugar?: number; // mg/dL, optional
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
  emergencyContact2Name: string;
  emergencyContact2Phone: string;
  doctorName: string;
  doctorPhone: string;
  highBgSteps: string;
  lowBgSteps: string;
  schoolNotes: string;
  updatedAt: string;
}
