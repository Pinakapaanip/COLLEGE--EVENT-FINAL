import { BarChart3, CalendarPlus, LayoutDashboard, LogOut, Search, Trophy, UserRoundCheck, Users } from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "View Events", icon: CalendarPlus },
  { id: "add-event", label: "Add Event", icon: CalendarPlus },
  { id: "participants", label: "Participants", icon: Users },
  { id: "results", label: "Results", icon: Trophy },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "search", label: "Search Events", icon: Search }
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="glass-panel flex h-full flex-col border-r border-white/10 p-5 lg:sticky lg:top-0 lg:h-screen lg:w-80">
      <div className="flex items-center gap-3">
        <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-xl border border-cyan-300/30 bg-white/10 shadow-lg shadow-cyan-500/20">
          <img
            src="/logo.png"
            alt="Chanakya University logo"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <span className="absolute text-sm font-black text-cyan-100">CU</span>
        </div>
        <div>
          <h1 className="max-w-56 text-base font-bold leading-tight text-white">Chanakya University College Portal</h1>
          <p className="mt-1 text-xs text-cyan-200">Enterprise admin suite</p>
        </div>
      </div>

      <div className="mt-7 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-400/20 text-purple-100">
            <UserRoundCheck size={19} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Signed in as</p>
            <p className="font-semibold text-white">System Admin</p>
          </div>
        </div>
      </div>

      <nav className="mt-7 grid gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all hover:scale-[1.02] ${
                isActive
                  ? "bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/25"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <button className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition-all hover:scale-[1.02] hover:bg-rose-500/20">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
