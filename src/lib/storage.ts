import { DiabetesEvent, CareGuide, ChildProfile } from "./types";

const EVENTS_KEY = "t1d_events";
const GUIDE_KEY = "t1d_care_guide";
const PROFILE_KEY = "t1d_child_profile";

export function getEvents(): DiabetesEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEvent(event: DiabetesEvent): void {
  const events = getEvents();
  events.unshift(event);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function deleteEvent(id: string): void {
  const events = getEvents().filter((e) => e.id !== id);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function getCareGuide(): CareGuide | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GUIDE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCareGuide(guide: CareGuide): void {
  localStorage.setItem(GUIDE_KEY, JSON.stringify(guide));
}

export function getChildProfile(): ChildProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveChildProfile(profile: ChildProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
