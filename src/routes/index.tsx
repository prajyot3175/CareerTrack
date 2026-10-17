import { createFileRoute } from "@tanstack/react-router";
import { Award, MessagesSquare, Send, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ApplicationsSection } from "@/components/dashboard/ApplicationsSection";
import { useApplicationManager } from "@/hooks/useApplicationManager";
import { getStats } from "@/lib/applications";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerTrack — Smart Job Application Dashboard" },
      { name: "description", content: "Track job applications, interviews, offers and rejections in one clean dashboard." },
      { property: "og:title", content: "CareerTrack — Smart Job Application Dashboard" },
      { property: "og:description", content: "Track job applications, interviews, offers and rejections in one clean dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const manager = useApplicationManager();
  const stats = getStats(manager.apps);

  const statCards = [
    { label: "Total applications", value: stats.total, icon: Send, tone: "bg-accent text-accent-foreground" },
    { label: "Interviews", value: stats.interviews, icon: MessagesSquare, tone: "bg-status-interview-bg text-status-interview" },
    { label: "Offers", value: stats.offers, icon: Award, tone: "bg-status-offer-bg text-status-offer" },
    { label: "Rejections", value: stats.rejections, icon: XCircle, tone: "bg-status-rejected-bg text-status-rejected" },
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle="An overview of your job search" onAdd={manager.openAdd}>
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4" aria-label="Statistics">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </section>
      <ApplicationsSection manager={manager} />
    </DashboardLayout>
  );
}
