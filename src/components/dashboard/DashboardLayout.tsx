import { useState, type ReactNode } from "react";
import { Menu, Plus } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  subtitle: string;
  onAdd?: () => void;
  children: ReactNode;
}

/** Shared shell: sidebar + sticky header, used by Dashboard, Applications and Settings. */
export function DashboardLayout({ title, subtitle, onAdd, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b bg-background/85 px-4 py-4 backdrop-blur sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <button onClick={() => setMenuOpen(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold sm:text-2xl">{title}</h1>
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {onAdd && (
            <Button onClick={onAdd} className="shrink-0">
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add application</span>
              <span className="sr-only sm:hidden">Add application</span>
            </Button>
          )}
        </header>
        <div className="space-y-8 px-4 py-6 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
