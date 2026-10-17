// The shape of one job application. Every part of the app uses this type.
export type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  appliedDate: string; // ISO date, e.g. "2026-10-01"
  status: ApplicationStatus;
  jobLink?: string;
  notes?: string;
}
