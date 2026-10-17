import { useState } from "react";
import { Briefcase, Plus, SearchX } from "lucide-react";
import { toast } from "sonner";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { ApplicationFilters } from "@/components/dashboard/ApplicationFilters";
import { ApplicationFormDialog } from "@/components/dashboard/ApplicationFormDialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { filterApplications, type ApplicationFormValues } from "@/lib/applications";
import type { ApplicationStatus, JobApplication } from "@/types/application";

interface Props {
  apps: JobApplication[];
  loaded: boolean;
  addApp: (values: ApplicationFormValues) => void;
  updateApp: (id: string, values: ApplicationFormValues) => void;
  deleteApp: (id: string) => void;
}

/** The full applications list with search, filters and add/edit/delete. Shared by the Dashboard and Applications pages. */
export function ApplicationsSection({ apps, loaded, addApp, updateApp, deleteApp }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [toDelete, setToDelete] = useState<JobApplication | null>(null);

  const visible = filterApplications(apps, search, statusFilter);

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
    </section>
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
