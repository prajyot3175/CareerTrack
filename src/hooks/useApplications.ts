import { useEffect, useState } from "react";
import type { JobApplication } from "@/types/application";
import { loadApplications, saveApplications, type ApplicationFormValues } from "@/lib/applications";
import { sampleApplications } from "@/data/sampleApplications";

/**
 * Holds the list of applications in React state and keeps localStorage in sync.
 * We load after the page mounts (useEffect) because localStorage only exists in the browser.
 */
export function useApplications() {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setApps(loadApplications(sampleApplications));
    setLoaded(true);
  }, []);

  // Every time the list changes (after loading), save it.
  useEffect(() => {
    if (loaded) saveApplications(apps);
  }, [apps, loaded]);

  const addApp = (values: ApplicationFormValues) =>
    setApps((prev) => [{ id: crypto.randomUUID(), ...values }, ...prev]);

  const updateApp = (id: string, values: ApplicationFormValues) =>
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...values } : a)));

  const deleteApp = (id: string) => setApps((prev) => prev.filter((a) => a.id !== id));

  return { apps, loaded, addApp, updateApp, deleteApp };
}
