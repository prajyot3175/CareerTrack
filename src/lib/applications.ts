import { z } from "zod";
import type { ApplicationStatus, JobApplication } from "@/types/application";

export const STATUSES: ApplicationStatus[] = ["Applied", "Interview", "Offer", "Rejected"];
export const STORAGE_KEY = "careertrack.applications";

// Rules for the form. Also used to check data loaded from localStorage.
export const applicationFormSchema = z.object({
  company: z.string().trim().min(1, "Please enter the company name.").max(100, "Company name must be under 100 characters."),
  role: z.string().trim().min(1, "Please enter the job role.").max(100, "Job role must be under 100 characters."),
  appliedDate: z
    .string()
    .min(1, "Please pick the application date.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a valid date."),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected"]),
  jobLink: z
    .string()
    .trim()
    .max(500, "Link must be under 500 characters.")
    .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), "Link must start with http:// or https://")
    .optional(),
  notes: z.string().trim().max(1000, "Notes must be under 1000 characters.").optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

const storedSchema = z.array(applicationFormSchema.extend({ id: z.string().min(1) }));

/**
 * Reads saved applications.
 * - Nothing saved yet → returns `fallback` (sample data on first visit).
 * - Saved data is broken → returns an empty list instead of crashing.
 */
export function loadApplications(fallback: JobApplication[]): JobApplication[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return fallback;
    const parsed = storedSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function saveApplications(apps: JobApplication[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch {
    // Storage full or blocked (e.g. private mode) — the app keeps working in memory.
  }
}

/** Search (company or role) and status filter work together. */
export function filterApplications(apps: JobApplication[], search: string, status: ApplicationStatus | "All") {
  const q = search.trim().toLowerCase();
  return apps.filter(
    (a) =>
      (status === "All" || a.status === status) &&
      (q === "" || a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)),
  );
}

/** Dashboard numbers, always calculated from the records. */
export function getStats(apps: JobApplication[]) {
  const count = (s: ApplicationStatus) => apps.filter((a) => a.status === s).length;
  return { total: apps.length, interviews: count("Interview"), offers: count("Offer"), rejections: count("Rejected") };
}
