import { beforeEach, describe, expect, it } from "vitest";
import { applicationFormSchema, filterApplications, getStats, loadApplications, STORAGE_KEY } from "@/lib/applications";
import { sampleApplications } from "@/data/sampleApplications";

describe("applications", () => {
  beforeEach(() => localStorage.clear());

  it("search and status filter work together", () => {
    const r = filterApplications(sampleApplications, "razor", "Interview");
    expect(r.map((a) => a.company)).toEqual(["Razorpay"]);
    expect(filterApplications(sampleApplications, "razor", "Offer")).toHaveLength(0);
  });

  it("stats derive from records", () => {
    expect(getStats(sampleApplications)).toEqual({ total: 6, interviews: 2, offers: 1, rejections: 1 });
  });

  it("missing storage returns sample data, broken storage returns empty", () => {
    expect(loadApplications(sampleApplications)).toHaveLength(6);
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadApplications(sampleApplications)).toEqual([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: "x" }]));
    expect(loadApplications(sampleApplications)).toEqual([]);
  });

  it("company and role are required", () => {
    const r = applicationFormSchema.safeParse({ company: " ", role: "", appliedDate: "2026-10-01", status: "Applied" });
    expect(r.success).toBe(false);
  });
});
