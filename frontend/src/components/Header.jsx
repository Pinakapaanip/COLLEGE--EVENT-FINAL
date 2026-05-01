import { Moon, RefreshCw, SunMedium } from "lucide-react";

export default function Header({ isDark, onToggleTheme, onRefresh, isLoading }) {
  return (
    <header className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Admin Console</p>
        <h2 className="mt-1 text-xl font-bold text-white md:text-2xl">admin@college.edu</h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
        <button
          onClick={onToggleTheme}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 text-cyan-100 transition-all hover:scale-105 hover:bg-white/15"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {isDark ? <Moon size={18} /> : <SunMedium size={18} />}
        </button>
      </div>
    </header>
  );
}
