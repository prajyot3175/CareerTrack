import { useEffect, useState } from "react";

const THEME_KEY = "careertrack.theme";
export type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Applies the saved theme to <html> on every page load. Call once at the root. */
export function useApplyTheme() {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", readTheme() === "dark");
  }, []);
}

/** Theme state + toggle for the Settings page. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const apply = (next: Theme) => {
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked — theme still applies for this session.
    }
  };

  return { theme, setTheme: apply };
}
