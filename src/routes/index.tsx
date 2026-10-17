import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Menu, MessagesSquare, Send, XCircle } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { sampleApplications } from "@/data/sampleApplications";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const apps = sampleApplications;

  // Stats are derived from the records — never stored separately.
  const count = (s: string) => apps.filter((a) => a.status === s).length;
  const stats = [
    { label: "Total applications", value: apps.length, icon: Send, tone: "bg-accent text-accent-foreground" },
    { label: "Interviews", value: count("Interview"), icon: MessagesSquare, tone: "bg-status-interview-bg text-status-interview" },
    { label: "Offers", value: count("Offer"), icon: Award, tone: "bg-status-offer-bg text-status-offer" },
    { label: "Rejections", value: count("Rejected"), icon: XCircle, tone: "bg-status-rejected-bg text-status-rejected" },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/85 px-4 py-4 backdrop-blur sm:px-8">
          <button onClick={() => setMenuOpen(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold sm:text-2xl">Dashboard</h1>
            <p className="truncate text-sm text-muted-foreground">An overview of your job search</p>
          </div>
        </header>

        <div className="space-y-8 px-4 py-6 sm:px-8">
          <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Recent applications</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {apps.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
