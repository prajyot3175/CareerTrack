import { Briefcase, LayoutDashboard, ListChecks, Settings, X } from "lucide-react";

const links = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Applications", icon: ListChecks, active: false },
  { label: "Settings", icon: Settings, active: false },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

// Fixed on desktop; slides in as a drawer on mobile when `open` is true.
export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold text-sidebar-accent-foreground">CareerTrack</span>
          </div>
          <button onClick={onClose} className="lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {links.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-sidebar-primary" : ""}`} />
              {label}
            </a>
          ))}
        </nav>
        <p className="mt-auto px-6 py-6 text-xs opacity-60">Your job hunt, organised.</p>
      </aside>
    </>
  );
}
