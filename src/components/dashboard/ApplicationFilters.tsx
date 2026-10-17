import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ApplicationStatus } from "@/types/application";
import { STATUSES } from "@/lib/applications";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  status: ApplicationStatus | "All";
  onStatusChange: (v: ApplicationStatus | "All") => void;
}

export function ApplicationFilters({ search, onSearchChange, status, onStatusChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <label htmlFor="search" className="sr-only">Search by company or role</label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input id="search" type="search" placeholder="Search company or role…" value={search} onChange={(e) => onSearchChange(e.target.value)} className="bg-card pl-9" />
      </div>
      <label htmlFor="status-filter" className="sr-only">Filter by status</label>
      <select
        id="status-filter"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as ApplicationStatus | "All")}
        className="h-9 rounded-md border border-input bg-card px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-44"
      >
        <option value="All">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
