import type { JobApplication } from "@/types/application";

// Sample records for milestone 1. Later these will come from localStorage.
export const sampleApplications: JobApplication[] = [
  { id: "1", company: "Razorpay", role: "Frontend Developer Intern", appliedDate: "2026-10-02", status: "Interview", jobLink: "https://razorpay.com/jobs", notes: "Technical round on Monday." },
  { id: "2", company: "Zoho", role: "Junior React Developer", appliedDate: "2026-09-28", status: "Applied", notes: "Referred by a college senior." },
  { id: "3", company: "Freshworks", role: "UI Engineer", appliedDate: "2026-09-20", status: "Offer", notes: "Offer letter received." },
  { id: "4", company: "Swiggy", role: "Software Engineer I", appliedDate: "2026-09-15", status: "Rejected", notes: "Ask for feedback." },
  { id: "5", company: "CRED", role: "Frontend Engineer", appliedDate: "2026-10-08", status: "Applied" },
  { id: "6", company: "Postman", role: "Web Developer Intern", appliedDate: "2026-10-05", status: "Interview", notes: "Take-home assignment due Friday." },
];
