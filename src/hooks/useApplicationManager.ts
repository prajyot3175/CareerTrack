import { useState } from "react";
import { toast } from "sonner";
import { useApplications } from "@/hooks/useApplications";
import type { ApplicationFormValues } from "@/lib/applications";
import type { JobApplication } from "@/types/application";

/**
 * Combines the stored applications with the add/edit form and delete-confirm state,
 * so the header "Add" button and the list share one source of truth on every page.
 */
export function useApplicationManager() {
  const { apps, loaded, addApp, updateApp, deleteApp } = useApplications();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [toDelete, setToDelete] = useState<JobApplication | null>(null);

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

  return {
    apps,
    loaded,
    openAdd,
    openEdit,
    formOpen,
    setFormOpen,
    editing,
    handleSubmit,
    toDelete,
    setToDelete,
    confirmDelete,
  };
}

export type ApplicationManager = ReturnType<typeof useApplicationManager>;
