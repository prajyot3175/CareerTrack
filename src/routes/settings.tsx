import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useTheme } from "@/hooks/useTheme";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CareerTrack" },
      { name: "description", content: "Adjust CareerTrack preferences, including dark and light mode." },
      { property: "og:title", content: "Settings — CareerTrack" },
      { property: "og:description", content: "Adjust CareerTrack preferences, including dark and light mode." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <DashboardLayout title="Settings" subtitle="Preferences for your workspace">
      <section className="max-w-xl rounded-xl border bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose how CareerTrack looks on this device. Your choice is saved automatically.</p>
        <div className="mt-5 grid grid-cols-2 gap-3" role="group" aria-label="Theme">
          <ThemeOption
            icon={Sun}
            label="Light"
            selected={theme === "light"}
            onClick={() => setTheme("light")}
          />
          <ThemeOption
            icon={Moon}
            label="Dark"
            selected={theme === "dark"}
            onClick={() => setTheme("dark")}
          />
        </div>
      </section>
    </DashboardLayout>
  );
}

function ThemeOption({ icon: Icon, label, selected, onClick }: { icon: typeof Sun; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-6 text-sm font-medium transition-colors ${
        selected
          ? "border-primary bg-accent text-accent-foreground ring-1 ring-ring"
          : "bg-background text-muted-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
      {selected && <span className="text-xs font-normal text-muted-foreground">Active</span>}
    </button>
  );
}
