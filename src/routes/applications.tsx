import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ApplicationsSection } from "@/components/dashboard/ApplicationsSection";
import { useApplicationManager } from "@/hooks/useApplicationManager";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Applications — CareerTrack" },
      { name: "description", content: "Browse, search, filter and manage all your job applications." },
      { property: "og:title", content: "Applications — CareerTrack" },
      { property: "og:description", content: "Browse, search, filter and manage all your job applications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const manager = useApplicationManager();

  return (
    <DashboardLayout title="Applications" subtitle="All your job applications in one place" onAdd={manager.openAdd}>
      <ApplicationsSection manager={manager} />
    </DashboardLayout>
  );
}
