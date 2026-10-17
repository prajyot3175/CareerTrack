import { Calendar, ExternalLink } from "lucide-react";
import type { ApplicationStatus, JobApplication } from "@/types/application";

// Maps each status to its colour tokens (defined in styles.css).
export const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-status-applied-bg text-status-applied",
  Interview: "bg-status-interview-bg text-status-interview",
  Offer: "bg-status-offer-bg text-status-offer",
  Rejected: "bg-status-rejected-bg text-status-rejected",
};

export function ApplicationCard({ app }: { app: JobApplication }) {
  const date = new Date(app.appliedDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="flex flex-col rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-lg">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{app.role}</h3>
          <p className="truncate text-sm text-muted-foreground">{app.company}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[app.status]}`}>
          {app.status}
        </span>
      </div>
      {app.notes && <p className="mt-3 line-clamp-2 text-sm">{app.notes}</p>}
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> {date}
        </span>
        {app.jobLink && (
          <a href={app.jobLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium text-primary hover:underline">
            Job post <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
