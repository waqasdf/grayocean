import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-[background,transform,border-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] ${className}`}
      style={{
        borderColor: "var(--go-border)",
        background: "transparent",
        color: "var(--go-text-muted)",
      }}
    >
      {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
    </button>
  );
}
