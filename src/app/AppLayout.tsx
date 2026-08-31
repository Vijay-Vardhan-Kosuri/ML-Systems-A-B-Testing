import { Outlet, NavLink } from "react-router-dom";
import { useUIStore } from "@/stores";
import { cn } from "@/shared/utils";

const nav = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/experiments", label: "Experiments" },
  { to: "/variants", label: "Variants" },
  { to: "/metrics", label: "Metrics" },
  { to: "/results", label: "Results" },
  { to: "/feature-flags", label: "Feature Flags" },
  { to: "/assignments", label: "Assignments" },
  { to: "/settings", label: "Settings" },
];

export function AppLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  return (
    <div className="flex min-h-screen">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">AB</div>
          <span className="text-lg font-semibold">ML Experiments</span>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
              )}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4 text-xs text-slate-400">© 2026 ML Systems</div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-6">
          <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={toggleSidebar}>☰</button>
          <div className="flex-1" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">ML</div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
