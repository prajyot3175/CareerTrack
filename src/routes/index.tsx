import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Briefcase, Menu, MessagesSquare, Plus, SearchX, Send, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { ApplicationFilters } from "@/components/dashboard/ApplicationFilters";
import { ApplicationFormDialog } from "@/components/dashboard/ApplicationFormDialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApplications } from "@/hooks/useApplications";
import { filterApplications, getStats, type ApplicationFormValues } from "@/lib/applications";
import type { ApplicationStatus, JobApplication } from "@/types/application";

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
  const { apps, loaded, addApp, updateApp, deleteApp } = useApplications();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [toDelete, setToDelete] = useState<JobApplication | null>(null);

  const stats = getStats(apps);
  const visible = filterApplications(apps, search, statusFilter);

  const statCards = [
    { label: "Total applications", value: stats.total, icon: Send, tone: "bg-accent text-accent-foreground" },
    { label: "Interviews", value: stats.interviews, icon: MessagesSquare, tone: "bg-status-interview-bg text-status-interview" },
    { label: "Offers", value: stats.offers, icon: Award, tone: "bg-status-offer-bg text-status-offer" },
    { label: "Rejections", value: stats.rejections, icon: XCircle, tone: "bg-status-rejected-bg text-status-rejected" },
  ];

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (app: JobApplication) => { setEditing(app); setFormOpen(true); };

  const handleSubmit = (values: ApplicationFormValues) => {
    if (editing) {
      updateApp(editing.id, values);
      toast.success(`Updated ${values.role} at ${values.company}`);
    } else {
      addApp(values);
      toast.success(`Added ${values.role} at ${values.company}`);
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteApp(toDelete.id);
    toast.success(`Deleted ${toDelete.role} at ${toDelete.company}`);
    setToDelete(null);
  };

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b bg-background/85 px-4 py-4 backdrop-blur sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <button onClick={() => setMenuOpen(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold sm:text-2xl">Dashboard</h1>
            <p className="truncate text-sm text-muted-foreground">An overview of your job search</p>
          </div>
          <Button onClick={openAdd} className="shrink-0">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add application</span>
            <span className="sr-only sm:hidden">Add application</span>
          </Button>
        </header>

        <div className="space-y-8 px-4 py-6 sm:px-8">
          <section className="grid grid-cols-2 gap-4 xl:grid-cols-4" aria-label="Statistics">
            {statCards.map((s) => <StatCard key={s.label} {...s} />)}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Applications</h2>
            {loaded && apps.length > 0 && (
              <ApplicationFilters search={search} onSearchChange={setSearch} status={statusFilter} onStatusChange={setStatusFilter} />
            )}

            {!loaded ? null : apps.length === 0 ? (
              <EmptyState icon={Briefcase} title="No applications yet" text="Add your first job application to start tracking your search.">
                <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add application</Button>
              </EmptyState>
            ) : visible.length === 0 ? (
              <EmptyState icon={SearchX} title="No matches" text="No applications match your search or filter.">
                <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("All"); }}>Clear filters</Button>
              </EmptyState>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((app) => (
                  <ApplicationCard key={app.id} app={app} onEdit={openEdit} onDelete={setToDelete} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <ApplicationFormDialog open={formOpen} onOpenChange={setFormOpen} initial={editing} onSubmit={handleSubmit} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this application?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete && `${toDelete.role} at ${toDelete.company} will be removed permanently.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, children }: { icon: typeof Briefcase; title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}
