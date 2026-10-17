import { useEffect, useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { JobApplication } from "@/types/application";
import { STATUSES, applicationFormSchema, type ApplicationFormValues } from "@/lib/applications";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: JobApplication | null; // when set, the form is in "edit" mode
  onSubmit: (values: ApplicationFormValues) => void;
}

type Errors = Partial<Record<keyof ApplicationFormValues, string>>;

const today = () => new Date().toISOString().slice(0, 10);
const empty = (): ApplicationFormValues => ({ company: "", role: "", appliedDate: today(), status: "Applied", jobLink: "", notes: "" });

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function ApplicationFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const [values, setValues] = useState<ApplicationFormValues>(empty);
  const [errors, setErrors] = useState<Errors>({});

  // Reset the form each time it opens.
  useEffect(() => {
    if (open) {
      setValues(initial ? { ...empty(), ...initial } : empty());
      setErrors({});
    }
  }, [open, initial]);

  const set = (field: keyof ApplicationFormValues, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = applicationFormSchema.safeParse(values);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ApplicationFormValues;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    onSubmit(result.data);
  };

  const field = (id: keyof ApplicationFormValues, label: string, required = false) => ({
    id,
    label: (
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
    ),
    error: errors[id] && (
      <p id={`${id}-error`} className="text-xs font-medium text-destructive">
        {errors[id]}
      </p>
    ),
    aria: { "aria-invalid": !!errors[id], "aria-describedby": errors[id] ? `${id}-error` : undefined },
  });

  const company = field("company", "Company name", true);
  const role = field("role", "Job role", true);
  const date = field("appliedDate", "Application date", true);
  const status = field("status", "Status", true);
  const link = field("jobLink", "Job link");
  const notes = field("notes", "Notes");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit application" : "Add application"}</DialogTitle>
          <DialogDescription>Fields marked * are required.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              {company.label}
              <Input id="company" value={values.company} onChange={(e) => set("company", e.target.value)} {...company.aria} autoFocus />
              {company.error}
            </div>
            <div className="space-y-1.5">
              {role.label}
              <Input id="role" value={values.role} onChange={(e) => set("role", e.target.value)} {...role.aria} />
              {role.error}
            </div>
            <div className="space-y-1.5">
              {date.label}
              <Input id="appliedDate" type="date" value={values.appliedDate} onChange={(e) => set("appliedDate", e.target.value)} {...date.aria} />
              {date.error}
            </div>
            <div className="space-y-1.5">
              {status.label}
              <select id="status" className={selectClass} value={values.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            {link.label}
            <Input id="jobLink" type="url" placeholder="https://…" value={values.jobLink} onChange={(e) => set("jobLink", e.target.value)} {...link.aria} />
            {link.error}
          </div>
          <div className="space-y-1.5">
            {notes.label}
            <Textarea id="notes" rows={3} value={values.notes} onChange={(e) => set("notes", e.target.value)} {...notes.aria} />
            {notes.error}
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{initial ? "Save changes" : "Add application"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
